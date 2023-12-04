from fastapi import HTTPException
from supabase import Client
from pydantic import BaseModel
from datetime import datetime
import json
import requests
import base64
import stripe
from api.utils import to_iso_format

def get_users(db: Client):
    users = db.table('users').select('userid').execute().model_dump_json()
    users = json.loads(users)
    return users['data']

def get_user_from_email(db: Client, email: str):
    users = db.table('users').select('userid').eq('email', email).execute().model_dump_json()
    users = json.loads(users)
    return users['data']


# def update_name_from_userid(db: Client, user_id: str, name: str):
#     response = db.table('users').update({'name': name}).eq('userid', user_id).execute().model_dump_json()
#     name = json.loads(response)['data'][0]['name']
#     return name

def get_stories_by_user(db: Client,
                        user_id: str,
                        is_done_generating: bool = None,
                        content_flagged: bool = None,
                        generation_failed: bool = None):
    query = db.table('stories').select('*').eq('userid', user_id)

    if is_done_generating is not None:
        query = query.eq('isdonegenerating', is_done_generating)
    if content_flagged is not None:
        query = query.eq('contentflagged', content_flagged)
    if generation_failed is not None:
        query = query.eq('generationfailed', generation_failed)

    stories = query.order('storyid', desc=True).execute().model_dump_json()
    stories = json.loads(stories)
    return stories['data']

def get_public_stories(db: Client, user_id: str):
    stories = db.table('stories') \
        .select('storyid', 'age', 'moral', 'title', 'ispublic', 'genre', 'coverurl', 'score', 'numpages', 'likes ( storyid, userid )') \
        .eq('likes.userid', user_id).eq('ispublic', True).order('storyid', desc=True).execute().model_dump_json()
    # stories = db.table('stories').select('*').eq('ispublic', True).order('storyid', desc=True).execute().model_dump_json()
    stories = json.loads(stories)['data']
    for story in stories:
        story['userLiked'] = (len(story['likes']) > 0)
    return stories

def set_story_public_status(db: Client, story_id: int, new_status: bool):
    response = db.table('stories').update({'ispublic': new_status}).eq('storyid', story_id).execute().model_dump_json()
    response = json.loads(response)
    return response['data'][0]

def increment_story_score(db: Client, story_id: int, user_id: str): # Returns the current score of the story
    params = { 'x': 1, 'row_id': story_id }
    response = db.rpc('increment', params).execute()
    response = db.table('likes').insert({'userid': user_id, 'storyid': story_id}).execute().model_dump_json()
    response = db.table('stories').select('score').eq('storyid', story_id).execute().model_dump_json()
    response = json.loads(response)
    return response['data'][0]['score']

def decrement_story_score(db: Client, story_id: int, user_id: str): # Returns the current score of the story
    params = { 'x': -1, 'row_id': story_id }
    response = db.rpc('increment', params).execute()
    response = db.table('likes').delete().eq('userid', user_id).eq('storyid', story_id).execute().model_dump_json()
    response = db.table('stories').select('score').eq('storyid', story_id).execute().model_dump_json()
    response = json.loads(response)
    return response['data'][0]['score']


def get_story_character_name_from_db(db: Client, story_id: int):
    story_info = db.table('stories').select('charactername').eq('storyid', story_id).execute().model_dump_json()
    story_info_json = json.loads(story_info)
    return story_info_json['data'][0]

def get_story_by_id(db: Client, story_id: int):
    story_info = db.table('stories').select('title', 'age', 'moral', 'genre', 'score').eq('storyid', story_id).execute().model_dump_json()
    story_info = json.loads(story_info)['data']

    if story_info == []:
        # this is Not Good
        raise HTTPException(status_code=404, detail="Item not found 😔")
    story_info = story_info[0]

    pages = db.table('pages').select('*').eq('storyid', story_id).execute().model_dump_json()
    pages = json.loads(pages)['data']
    story = {
        "title": story_info['title'],
        "moral": story_info['moral'],
        "genre": story_info['genre'],
        "vocabulary_age": str(story_info['age']),
        "score": str(story_info['score']),
        "total_pages": len(pages),
        "story": []
    }

    pages.sort(key=lambda x: x['pagenumber'])
    for page in pages:
        contents = db.table('contents').select('pagetext', 'imageprompt', 'subjdesc', 'imageurl').eq('pageid', page['pageid']).execute().model_dump_json()
        contents = json.loads(contents)['data'][0]
        story['story'].append({
            "page": page['pagenumber'],
            "text": contents['pagetext'],
            "image_prompt": contents['imageprompt'],
            "subject_description": contents['subjdesc'],
            "image_url": contents['imageurl']
        })
    return json.dumps(story)

def delete_story_by_id(db: Client, story_id: int):
    delete_images(db, story_id)
    response = db.table('stories').delete().eq('storyid', story_id).execute().model_dump_json()
    response = json.loads(response)
    return response['data'][0]

def delete_images(db: Client, story_id: int):
    pages = db.table('pages').select('pagenumber').eq('storyid', story_id).execute().model_dump_json()
    pages = json.loads(pages)['data']
    pages.sort(key=lambda x: x['pagenumber'])
    for page in pages:
        path = f'{story_id}/{page["pagenumber"]}.png'
        db.storage.get_bucket('images').remove(path)

# TODO: remove
def save_users_story(db: Client, user_id: int, story: dict):
    story_id = save_story_info(db, user_id, story['title'], int(story['vocabulary_age']), story['moral'], story['genre'])
    first_image_url = save_story_pages(db, story_id, story['story'])
    db.table('stories').update({'coverurl': first_image_url}).eq('storyid', story_id).execute()
    return story_id

# TODO: remove
def save_story_info(db: Client, user_id: str, title: str, age: int, moral: str, genre: str):
    story_info = {
        "userid": user_id,
        "title": title,
        "age": age,
        "moral": moral,
        "genre": genre
    }
    response = db.table('stories').insert(story_info).execute().model_dump_json()
    story_id = json.loads(response)['data'][0]['storyid']
    return story_id

def save_story_pages(db: Client, story_id: int, pages: list):
    first_image_url = ''
    for page in pages:
        page_info = {
            "storyid": story_id,
            "pagenumber": page['page']
        }
        response = db.table('pages').insert(page_info).execute().model_dump_json()
        page_id = json.loads(response)['data'][0]['pageid']

        image_url = save_image(db, story_id, page['page'], page['image_url'])
        if page['page'] == 1:
            first_image_url = image_url

        save_page_contents(db, page_id, page['text'], page['image_prompt'], page['subject_description'], image_url)

    return first_image_url

def save_image(db: Client, story_id: int, page_number: int, image_url: str):
    if image_url.startswith("data:image/png;base64,"):
        image_base64 = image_url.split(",")[1]
        # Decode the base64 encoded string
        image = base64.b64decode(image_base64)
    else:
        data = requests.get(image_url)
        image = data.content

    path = f'{story_id}/{page_number}.png'
    db.storage.get_bucket('images').upload(path, image)
    return db.storage.get_bucket('images').get_public_url(path)

def save_page_contents(db: Client, page_id: int, text: str, image_prompt: str, subject_description: str, image_url: str):
    content_info = {
        "pageid": page_id,
        "pagetext": text,
        "imageprompt": image_prompt,
        "subjdesc": subject_description,
        "imageurl": image_url
    }
    db.table('contents').insert(content_info).execute()

def update_story_moral_and_genre(db: Client, story_id: int, moral: str, genre: str):
    db.table('stories') \
      .update({'moral': moral, 'genre': genre}) \
      .eq('storyid', story_id) \
      .execute()

def save_story_metadata_to_db(db: Client, user_id: int, age: int, moral: str, genre: str, 
                              story_prompt: str, num_pages: int, name: str, artstyle: str, is_public: bool = False):
    story_metadata = {
        "userid": user_id,
        "storyprompt": story_prompt,
        "age": age,
        "moral": moral,
        "genre": genre,
        "artstyle": artstyle,
        "numpages": num_pages,
        "charactername": name,
        "ispublic": is_public,
    }
    response = db.table('stories').insert(story_metadata).execute().model_dump_json()
    story_id = json.loads(response)['data'][0]['storyid']
    return story_id

def get_story_metadata_from_db(db: Client, story_id: int):
    story_metadata = db.table('stories').select('*').eq('storyid', story_id).execute().model_dump_json()
    story_metadata = json.loads(story_metadata)['data'][0]
    return story_metadata

def save_story_title_to_db(db: Client, story_id: int, title: str):
    db.table('stories').update({'title': title}).eq('storyid', story_id).execute()

def save_story_pages_to_db(db: Client, story_id: int, pages: list):
    first_image_url = save_story_pages(db, story_id, pages)
    db.table('stories').update({'coverurl': first_image_url}).eq('storyid', story_id).execute()

def mark_story_as_done_generating(db: Client, story_id: int):
    db.table('stories') \
        .update({
            'isdonegenerating': True,
            'contentflagged': False,
            'generationfailed': False,
            }) \
        .eq('storyid', story_id).execute()

def is_story_done_generating(db: Client, story_id: int):
    response = db.table('stories').select('isdonegenerating').eq('storyid', story_id).execute().model_dump_json()
    response = json.loads(response)
    if response['data'] == []:
        # this is Not Good
        raise HTTPException(status_code=404, detail="Story not found 😔")
    return response['data'][0]['isdonegenerating']

def set_contentflagged(db: Client, story_id: int, flagged: bool):
    response = db.table('stories') \
        .update({'contentflagged': flagged,
                'isdonegenerating': True}) \
        .eq('storyid', story_id) \
        .execute()
    print(response)

def set_generationfailed(db: Client, story_id: int, failed: bool):
    response = db.table('stories') \
        .update({'generationfailed': failed,
                'isdonegenerating': True}) \
        .eq('storyid', story_id) \
        .execute()
    print(response)

def get_reason_from_logs(db: Client, story_id: int):
    response = db.table('generations').select('reason').eq('storyid', story_id).execute().model_dump_json()
    response = json.loads(response)
    if response['data'] == []:
        # this is Not Good
        raise HTTPException(status_code=404, detail="Story generation log not found 😔")
    return response['data'][0]['reason']

def insert_gen(db: Client, user_id: str, result: str, prompt: str, name: str, reason: str, story_id: int):
    gen_info = {
        "storyid": story_id,
        "userid": user_id,
        "result": result,
        "prompt": prompt,
        "name": name,
        "reason": reason
    }
    response = db.table('generations').insert(gen_info).execute().model_dump_json()
    response = json.loads(response)['data'][0]['id']
    return response

def handle_gen_success(db: Client, user_id: str, result: str, prompt: str, name: str, reason: str, story_id: int):
    response = increment_gen_success(db, user_id)
    if response != 1:
        return 0
    return insert_gen(db, user_id, result, prompt, name, reason, story_id)

def handle_gen_failure(db: Client, user_id: str, result: str, prompt: str, name: str, reason: str, story_id: int):
    response = increment_gen_failure(db, user_id)
    if response != 1:
        return 0
    return insert_gen(db, user_id, result, prompt, name, reason, story_id)
    

def increment_gen_success(db: Client, user_id: str): # just return 1 if no error... supabase has no return for python rpc
    params = { 'x': 1, 'row_id': user_id }
    response = db.rpc('incr_gensuccess', params).execute()

    params = { 'x': -1, 'user_id': user_id }
    response = db.rpc('incr_credits', params).execute()
    return 1

def increment_gen_failure(db: Client, user_id: str): # just return 1 if no error... supabase has no return for python rpc
    params = { 'x': 1, 'row_id': user_id }
    response = db.rpc('incr_genfailure', params).execute()
    return 1

### Avatar data handling
def get_avatars_by_userid(db: Client, user_id: str):
    # Query the avatars table to get all avatars belonging to the user
    avatars_info = db.table('avatars').select('*').eq('ownerid', user_id).execute().model_dump_json()
    avatars_info = json.loads(avatars_info)['data']

    # If no avatars are found for the user, return an empty list
    if not avatars_info:
        return []

    # Create a list to store information about each avatar
    avatars = []

    for avatar_info in avatars_info:
        avatar = {
            "avatarid": avatar_info['avatarid'],
            "name": avatar_info['name'],
            "hair_color": avatar_info['hair_color'],
            "ethnicity": avatar_info['ethnicity'],
            "hairstyle": avatar_info['hairstyle'],
            "age": avatar_info['age'],
            "gender": avatar_info['gender'],
            "clothing_color": avatar_info['clothing_color'],
            "image": avatar_info['image'],
        }
        avatars.append(avatar)

    return avatars

def get_avatar_by_id(db: Client, avatar_id: int):
    # Query the avatars table to get avatar information by avatar_id
    avatar_info = db.table('avatars').select('*').eq('avatarid', avatar_id).execute().model_dump_json()
    avatar_info = json.loads(avatar_info)['data']

    if not avatar_info:
        # Avatar with the given ID was not found
        raise HTTPException(status_code=404, detail="Avatar not found")

    # Assuming that there's only one result for the given avatar_id
    avatar_info = avatar_info[0]

    # You can structure the response as needed based on your requirements
    avatar = {
        # is image needed?
        "avatar_id": avatar_info['avatarid'],
        "owner_id": avatar_info['ownerid'],
        "name": avatar_info['name'],
        "hair_color": avatar_info['hair_color'],
        "ethnicity": avatar_info['ethnicity'],
        "hairstyle": avatar_info['hairstyle'],
        "age": avatar_info['age'],
        "gender": avatar_info['gender'],
        "clothing_color": avatar_info['clothing_color'],
    }

    return avatar

class AvatarData(BaseModel):
    avatarImage: str
    avatarName: str
    hairColor: str
    ethnicity: str
    hairstyle: str
    age: int
    gender: str
    favoriteClothingColor: str

def add_avatar(db: Client, owner_id: str, avatar_data: AvatarData):
    """
    Add a new avatar to the database.
    :param db: Supabase client
    :param owner_id: User ID of the avatar owner
    :param avatar_data: Dictionary containing avatar data
    :return: Avatar ID of the newly added avatar
    """
    response = db.table('avatars').insert({
        'ownerid': owner_id,
        'image': avatar_data.avatarImage,
        'name': avatar_data.avatarName,
        'hair_color': avatar_data.hairColor,
        'ethnicity': avatar_data.ethnicity,
        'hairstyle': avatar_data.hairstyle,
        'age': avatar_data.age,
        'gender': avatar_data.gender,
        'clothing_color': avatar_data.favoriteClothingColor
    }).execute().model_dump_json()

    avatar_id = json.loads(response)['data'][0]['avatarid']
    image_url = save_avatar_image(db, avatar_id, avatar_data.avatarImage)
    db.table('avatars').update({'image': image_url}).eq('avatarid', avatar_id).execute()

    return avatar_id


# WARNING: edit_avatar is not accessible from the webpage as of 12/11/2023 - this function has not been tested
def edit_avatar(db: Client, avatar_id: int, avatar_data: dict):
    """
    Edit an existing avatar in the database.
    :param db: Supabase client
    :param avatar_id: ID of the avatar to be edited
    :param avatar_data: Dictionary containing updated avatar data
    :return: Updated avatar data
    """
    delete_avatar_image(db, avatar_id)
    image_url = save_avatar_image(db, avatar_id, avatar_data.avatarImage)
    response = db.table('avatars').update({
        'image': image_url,
        'name': avatar_data.avatarName,
        'hair_color': avatar_data.hairColor,
        'ethnicity': avatar_data.ethnicity,
        'hairstyle': avatar_data.hairstyle,
        'age': avatar_data.age,
        'gender': avatar_data.gender,
        'clothing_color': avatar_data.favoriteClothingColor
    }).eq('avatarid', avatar_id).execute().model_dump_json()
    
    updated_avatar_data = json.loads(response)['data'][0]
    return updated_avatar_data

def delete_avatar(db: Client, avatar_id: int):
    """
    Delete an avatar from the database.
    :param db: Supabase client
    :param avatar_id: ID of the avatar to be deleted
    :return: True if the avatar was deleted successfully, False otherwise
    """
    response = db.table('avatars').delete().eq('avatarid', avatar_id).execute().model_dump_json()
    
    avatar_id = json.loads(response)['data'][0]['avatarid']

    # Delete the avatar image from the bucket
    delete_avatar_image(db, avatar_id)
    
    # Check if the avatar was deleted successfully
    if avatar_id:
        return True
    else:
        return False


# temp function for transferring avatar images from table to bucket
'''
def transfer_avatars(db: Client):
    # get all the avatars from the old table
    avatar_info = db.table('avatars').select('avatarid, image').execute().model_dump_json()
    avatar_info = json.loads(avatar_info)['data']
    # place each in avatars/avatar_id bucket
    for avatar in avatar_info:
        if avatar["image"].startswith("data:image/png;base64,"):
            print(avatar["avatarid"])
            try:
                path = f'{avatar["avatarid"]}.png'
                image_base64 = avatar["image"].split("base64,")[1]
                image = base64.b64decode(image_base64)
                db.storage.get_bucket('avatars').upload(path, image,{ 'content-type': 'image/png' })
                image_url = db.storage.get_bucket('avatars').get_public_url(path)
                db.table('avatars').update({'image': image_url}).eq('avatarid', avatar["avatarid"]).execute()
            except Exception as e:
                print(e)
                return
'''

def save_avatar_image(db: Client, avatarid: int, image: str):
    path = f'{avatarid}.png'
    image_base64 = image.split("base64,")[1]
    image = base64.b64decode(image_base64)
    print("Saving avatar image to bucket...")
    db.storage.get_bucket('avatars').upload(path, image, { 'content-type': 'image/png' })
    image_url = db.storage.get_bucket('avatars').get_public_url(path)
    return image_url

def delete_avatar_image(db: Client, avatarid: int):
    path = f'{avatarid}.png'
    db.storage.get_bucket('avatars').remove(path)


def create_or_retrieve_customer(db: Client, customer_id: str, email: str) -> str:
    # Retrieve the user's userid based on their email.
    user = db.table("users").select("userid").eq("email", email).execute().model_dump_json()
    userid = json.loads(user)["data"][0]["userid"]

    if not userid:
        # Handle case where no user is found with the provided email.
        raise Exception("No user found with the provided email.")

    # Check if a customer entry already exists for this user.
    customer_entry = db.table("customers").select("userid").eq("userid", userid).execute().model_dump_json()
    customer_row = json.loads(customer_entry)["data"]

    if not customer_row:
        # No customer record found, so we should create one and add it to the 'customers' table.
        new_customer_data = {
            "userid": userid,  # The user's userid from the 'users' table.
            "stripe_customer_id": customer_id  # The Stripe Customer ID.
        }
        response = db.table("customers").insert(new_customer_data).execute().model_dump_json()
        customer_id = json.loads(response)['data'][0]['userid']
    
    return userid 

def get_credits_by_userid(db: Client, user_id: str):
    credits_info = db.table('users').select('credits').eq('userid', user_id).execute().model_dump_json()
    try:
        credits_info = json.loads(credits_info)['data'][0]['credits']
    except Exception as e:
        raise e

    return credits_info

def get_subscription_by_userid(db: Client, user_id: str):
    subscription_info = db.table('users').select('subscription_type').eq('userid', user_id).execute().model_dump_json()
    try:
        subscription_info = json.loads(subscription_info)['data'][0]['subscription_type']
    except Exception as e:
        raise e
    
    return subscription_info

def handle_allowance_change(db: Client, userid, metadata):
    subscription_type = metadata.subscription_type
    db.table('users') \
        .update({
            'subscription_type': subscription_type,
            }) \
        .eq('userid', userid).execute()
    
    params = { 'x': metadata.credit_allowance, 'user_id': userid }
    response = db.rpc('incr_credits', params).execute()

def manage_subscription_status_change(db: Client, subscription_id, customer_id, create_action=False, customer_email=""):
    """Manage changes in subscription status."""
    # If it's a create action, we assume that the customer may not exist in the database.
    userid = None

    if create_action:
        # If it's a creation event, we'll need the customer's email to find or create a customer record.
        if not customer_email:
            stripe_customer_response = stripe.Customer.retrieve(customer_id)
            userid = create_or_retrieve_customer(db, customer_id, stripe_customer_response["email"])
        else:
            userid = create_or_retrieve_customer(db, customer_id, customer_email)
    else:
        # For other types of subscription events, find the customer based on the Stripe customer ID.
        customer_response = db.table("customers").select("userid").eq("stripe_customer_id", customer_id).execute().model_dump_json()
        
        userid = json.loads(customer_response)["data"][0]["userid"]

    subscription = stripe.Subscription.retrieve(subscription_id, expand=["default_payment_method"])
    product = stripe.Product.retrieve(subscription["items"].data[0].plan.product)
    
    if create_action:
        handle_allowance_change(db, userid, product.metadata)

    subscription_data = {
        "subscription_id": subscription.id,
        "userid": userid,
        "metadata": product.metadata,
        "status": subscription.status,
        "price_id": subscription["items"].data[0].price.id,  # Accessing the first item's price ID
        # "quantity" is retrieved depending on your subscription's structure. 
        # If it's uncertain or might be missing, use safe navigation.
        "quantity": getattr(subscription, 'quantity', None),  # Assumes 'quantity' is a direct attribute of 'subscription'
        "cancel_at_period_end": subscription.cancel_at_period_end,
        "cancel_at": to_iso_format(subscription.cancel_at) if subscription.cancel_at else None,
        "canceled_at": to_iso_format(subscription.canceled_at) if subscription.canceled_at else None,
        "current_period_start": to_iso_format(subscription.current_period_start),
        "current_period_end": to_iso_format(subscription.current_period_end),
        "created": to_iso_format(subscription.created),
        "ended_at": to_iso_format(subscription.ended_at) if subscription.ended_at else None,
        "trial_start": to_iso_format(subscription.trial_start) if subscription.trial_start else None,
        "trial_end": to_iso_format(subscription.trial_end) if subscription.trial_end else None,
    }

    # Upsert the latest status of the subscription object.
    response = db.table("subscriptions").upsert(subscription_data).execute().model_dump_json()
    subscription_id = json.loads(response)['data'][0]['subscription_id']

    print(f"Inserted/updated subscription [{subscription.id}] for user [{userid}]")
    return subscription_id
