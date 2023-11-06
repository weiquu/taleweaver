import sys
from pathlib import Path
import json
import os
import stripe
from dotenv import load_dotenv
from pydantic import BaseModel, Json
from supabase import create_client, Client

from typing import Any

sys.path.append(str(Path(__file__).parent.parent.parent))

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Header, HTTPException, Request

from api.supabase_api import get_user_from_email, get_users, get_stories_by_user, get_public_stories, get_story_by_id, \
    save_users_story, set_story_public_status, delete_story_by_id, add_avatar, edit_avatar, delete_avatar, get_avatar_by_id, \
    get_avatars_by_userid, save_story_metadata_to_db, save_story_pages_to_db, save_story_title_to_db, mark_story_as_done_generating, \
    is_story_done_generating, set_contentflagged, set_generationfailed, get_public_stories, get_story_by_id, save_users_story, \
    set_story_public_status, delete_story_by_id, add_avatar, edit_avatar, delete_avatar, get_avatar_by_id, get_avatars_by_userid, \
    handle_gen_success, handle_gen_failure, manage_subscription_status_change, get_credits_by_userid, get_story_character_name_from_db, \
    increment_story_score, decrement_story_score, update_story_moral_and_genre, get_subscription_by_userid

app = FastAPI()

origins = [
    "http//localhost:3000",
    "http//localhost:5173",
    "http://localhost:5173/"
    "http://13.212.192.8:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()  # Loads environment variables from .env file

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

def new_client():
    return create_client(url, key)

supabase: Client = new_client()


############################## NULL GET REQUESTS ##############################


@app.get("/get-all-users")
async def get_all_users():
    # no particular return format settled
    return get_users(supabase)

@app.get("/{user_id}/get-public-stories")
async def get_all_public_stories(user_id: str):
    # no particular return format settled
    return get_public_stories(supabase, user_id)


############################## USER_ID GET REQUESTS ##############################


@app.get("/{user_id}/get-all-stories")
async def get_users_stories(user_id: str):
    # no particular return format settled
    return get_stories_by_user(supabase, \
                               user_id, \
                               is_done_generating = True, \
                               content_flagged = False, \
                               generation_failed = False)

@app.get("/{user_id}/get-failed-stories")
async def get_failed_stories(user_id: str):
    return get_stories_by_user(supabase, user_id, generation_failed = True)

@app.get("/{user_id}/get-flagged-stories")
async def get_flagged_stories(user_id: str):
    return get_stories_by_user(supabase, user_id, content_flagged = True)

@app.get("/{user_id}/num-generating-stories/")
async def num_generating_stories(user_id: str):
    return len(get_stories_by_user(supabase, user_id, is_done_generating = False))

@app.get("/{user_id}/currently-generating-stories/")
async def currently_generating_stories(user_id: str):
    return get_stories_by_user(supabase, user_id, is_done_generating = False)
    
@app.get("/avatars/{user_id}")
async def get_user_avatars(user_id: str):
    # Call the get_avatars_by_userid function to retrieve avatars
    avatars = get_avatars_by_userid(supabase, user_id)

    # Check if avatars were found for the user
    if not avatars:
        raise HTTPException(status_code=404, detail="No avatars found for this user")

    # Return the avatars as JSON response
    return {"avatars": avatars}

############################## CREDITS / SUBSCRIPTION GET REQUESTS ##############################

@app.get("/credits/{user_id}")
async def get_user_credits(user_id: str):
    try:
        credits = get_credits_by_userid(supabase, user_id)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="No credits found for this user")
    
    return credits

@app.get("/subscription/{user_id}")
async def get_user_subscription(user_id: str):
    try:
        subscription = get_subscription_by_userid(supabase, user_id)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="No subscription found for this user")

    return subscription

############################## STORY_ID GET REQUESTS ##############################


@app.put("/{story_id}/set-to-public")
async def set_story_to_public(story_id: int):
    # Return format: {success: bool}
    response = set_story_public_status(supabase, story_id, True)
    success = response['ispublic'] == True
    return {
        "success": success
    }

@app.put("/{story_id}/set-to-private")
async def set_story_to_private(story_id: int):
    # Return format: {success: bool}
    response = set_story_public_status(supabase, story_id, False)
    success = response['ispublic'] == False
    return {
        "success": success
    }

@app.get("/{story_id}/get-story")
async def get_story(story_id: int, authorization: str = Header(None)):
    user_client = new_client()
    user_client.auth.session_token = authorization
    # Return format: same return format as with the genapi
    return get_story_by_id(supabase, story_id)

@app.get("/{story_id}/story-character-name")
async def story_character_name(story_id: int):
    story = get_story_character_name_from_db(supabase, story_id)
    return story['charactername']

@app.delete("/{story_id}/delete-story")
async def delete_story(story_id: int):
    # Return format: {success: bool}
    response = delete_story_by_id(supabase, story_id)
    success = response['storyid'] == story_id
    return {
        "success": success
    }

@app.get("/{story_id}/story-generation-status/")
async def story_generation_status(story_id: int):
    return is_story_done_generating(supabase, story_id)

@app.get("/{story_id}/set-contentflagged/{flagged}")
async def set_content_flagged(story_id: int, flagged: bool):
    set_contentflagged(supabase, story_id, flagged)
    return {
        "success": True
    }

@app.get("/{story_id}/set-generationfailed/{failed}")
async def set_generation_failed(story_id: int, failed: bool):
    set_generationfailed(supabase, story_id, failed)
    return {
        "success": True
    }

############################## REQUEST MESSAGE CLASSES ##############################


class AvatarData(BaseModel):
    avatarImage: str
    avatarName: str
    hairColor: str
    ethnicity: str
    hairstyle: str
    age: int
    gender: str
    favoriteClothingColor: str

class AddAvatarPayload(BaseModel):
    user_id: str
    avatar_data: AvatarData

class SaveStoryRequest(BaseModel):
    user_id: str
    story_data: dict

class SaveStoryMetadataRequest(BaseModel):
    user_id: str
    story_prompt: str
    vocab_age: int
    moral: str
    genre: str
    name: str
    num_pages: int

class SaveStoryPagesAndTitleRequest(BaseModel):
    story_id: int
    title: str
    moral: str
    genre: str
    story: list

class GenerationLog(BaseModel):
    user_id: str
    success: bool
    result: str
    prompt: str
    name: str
    reason: str

class Like(BaseModel):
    user_id: str
    story_id: int


############################## POST REQUESTS ##############################


@app.post("/increase-score")
async def increase_story_score(request_data: Like):
    # Return format: {score: int}
    response = increment_story_score(supabase, request_data.story_id, request_data.user_id)
    return {
        "score": response
    }

@app.post("/decrease-score")
async def decrease_story_score(request_data: Like):
    # Return format: {score: int}
    response = decrement_story_score(supabase, request_data.story_id, request_data.user_id)
    return {
        "score": response
    }

# TODO: remove. Currently still used by handleSave in CreateStory, but that function should be removed too
@app.post("/save-story")
async def save_story(request_data: SaveStoryRequest):
    # returns an int, which is the story id
    return save_users_story(supabase, request_data.user_id, request_data.story_data)

@app.post("/save-story-metadata")
async def save_story_metadata(request_data: SaveStoryMetadataRequest):
    return save_story_metadata_to_db(supabase,
                                     request_data.user_id,
                                     request_data.vocab_age,
                                     request_data.moral,
                                     request_data.genre,
                                     request_data.story_prompt,
                                     request_data.num_pages,
                                     request_data.name)

@app.post("/save-story-pages-title-moral-genre")
async def save_story_pages_title_moral_genre(request_data: SaveStoryPagesAndTitleRequest):
    save_story_title_to_db(supabase, request_data.story_id, request_data.title)
    save_story_pages_to_db(supabase, request_data.story_id, request_data.story)
    update_story_moral_and_genre(supabase, request_data.story_id, request_data.moral, request_data.genre)
    mark_story_as_done_generating(supabase, request_data.story_id)

@app.post("/log-generation")
async def log_generation(payload: GenerationLog):
    # Return format: {success: bool}
    if payload.success:
        response = handle_gen_success(supabase, payload.user_id, payload.result, payload.prompt, payload.name, payload.reason)
    else:
        response = handle_gen_failure(supabase, payload.user_id, payload.result, payload.prompt, payload.name, payload.reason)
    print(f"Handle generation success/failure response: {response}")
    success = response > 0
    return {
        "success": success
    }

@app.post("/avatars/{user_id}")
async def add_new_avatar(payload: AddAvatarPayload):    
    # Add a new avatar for the user
    avatar_id = add_avatar(supabase, payload.user_id, payload.avatar_data)

    return {"avatar_id": avatar_id}


############################## PUT REQUESTS ##############################


# @app.put("/update-name")
# async def update_name(user_id: str, name: str):
#     # Return format: {success: bool}
#     success = update_name_from_userid(supabase, user_id, name) == name
#     return {
#         "success": success
#     }### Avatar data handling


@app.put("/avatars/{user_id}")
async def edit_existing_avatar(avatar_id: int, avatar_data: dict):
    # Check if the provided avatar_id exists and belongs to the user
    existing_avatar = get_avatar_by_id(supabase, avatar_id)
    if not existing_avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")

    # Edit the existing avatar
    updated_avatar_data = edit_avatar(supabase, avatar_id, avatar_data)

    return updated_avatar_data
     

############################## DELETE REQUESTS ##############################


@app.delete("/avatars/{avatar_id}")
async def delete_existing_avatar(avatar_id: int):
    # Check if the provided avatar_id exists and belongs to the user
    existing_avatar = get_avatar_by_id(supabase, avatar_id)
    if not existing_avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    
    # Delete the existing avatar
    success = delete_avatar(supabase, avatar_id)

    if success:
        return {"message": "Avatar deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Avatar deletion failed")
    
@app.get("/avatars/{user_id}")
async def get_user_avatars(user_id: str):
    # Call the get_avatars_by_userid function to retrieve avatars
    avatars = get_avatars_by_userid(supabase, user_id)

    # Check if avatars were found for the user
    if not avatars:
        raise HTTPException(status_code=404, detail="No avatars found for this user")

    # Return the avatars as JSON response
    return {"avatars": avatars}

# Stripe
stripe.api_key = os.getenv('VITE_STRIPE_SECRET_LIVE_KEY')

# This is your Stripe CLI webhook secret for testing your endpoint locally.
endpoint_secret = os.environ.get("VITE_STRIPE_WEBHOOK_SECRET")

relevant_events = {
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
}

@app.post('/webhook')
async def webhook(
    event: dict,
    request: Request,
    stripe_signature=Header(None)
):
    raw_body = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            raw_body, stripe_signature, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        print(f"❌ Error message: {str(e)}")
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print(f"❌ Error message: {str(e)}")
        raise e

    # Handle the event
    if event['type'] in relevant_events:
        try:
            event_type = event['type']
            data_object = event['data']['object']

            if event_type in ['customer.subscription.created']:
                manage_subscription_status_change(
                    supabase,
                    data_object['id'],
                    data_object['customer'],
                    True
                )
            elif event_type in ['customer.subscription.updated', 'customer.subscription.deleted']:
                manage_subscription_status_change(
                    supabase,
                    data_object['id'],
                    data_object['customer'],
                    False
                )
            elif event_type == 'checkout.session.completed' and data_object['mode'] == 'subscription':
                manage_subscription_status_change(
                    supabase,
                    data_object['subscription'],
                    data_object['customer'],
                    True,
                    data_object['customer_email']
                )
            else:
                print("Unhandled relevant event!")
                raise e

        except Exception as e:
            print(e)
            raise e
    else:
        print('Unhandled event type {}'.format(event['type']))
   
    return {"success": True}
