import openai
import os
from dotenv import load_dotenv
import json
import requests
import random

load_dotenv()  # Loads environment variables from .env file

openai.api_key = os.environ.get("VITE_OPENAPI_KEY")
MAX_REGENERATION_TRIES = 5
STABILITY_API_KEY = os.environ.get("VITE_STABILITY_API_KEY")
STORAGE_URL = os.environ.get("VITE_STORAGE_URL")

SUCCESS = "success"
INAPPROPRIATE_CONTENT = "inappropriate content"
PARSING_ERROR = "parsing error"
UNKNOWN_ERROR = "unknown error"


############################## MAIN API FUNCTIONS #############################


# generates a story and saves it to db
def generate_and_save(user_id: str, story_id: int, system_prompt: str, user_prompt: str) -> None:
    gen_logs_params = {
        'user_id': user_id,
        'success': True,
        'result': SUCCESS,
        'prompt': user_prompt,
        'name': '',
        'reason': '',
    }
    try:
        response = generate_response(system_prompt, user_prompt)
    except Exception as e:
        if "Content Flagged:" in e.args[0]:
            # set in 'stories' table contentflagged to true
            db_response= requests.get(f"{STORAGE_URL}/{story_id}/set-contentflagged/true")

            # insert log into 'generations' table
            gen_logs_params['success'] = False
            gen_logs_params['result'] = INAPPROPRIATE_CONTENT
            gen_logs_params['reason'] = e.args[0]
            print(f"logging: {str(gen_logs_params)}")
            log_generation(gen_logs_params)
            return
        elif "Max tries exceeded" in e.args[0]:
            # set in 'stories' table contentflagged to true
            db_response = requests.get(f"{STORAGE_URL}/{story_id}/set-generationfailed/true")

            # insert log into 'generations' table
            gen_logs_params['success'] = False
            gen_logs_params['result'] = PARSING_ERROR
            gen_logs_params['reason'] = e.args[0]
            print(f"logging: {str(gen_logs_params)}")
            log_generation(gen_logs_params)
            return
        else: 
            # set in 'stories' table generationfailed to true
            db_response = requests.get(f"{STORAGE_URL}/{story_id}/set-generationfailed/true")

            # insert log into 'generations' table
            gen_logs_params['success'] = False
            gen_logs_params['result'] = UNKNOWN_ERROR
            gen_logs_params['reason'] = e.args[0]
            print(f"logging: {str(gen_logs_params)}")
            log_generation(gen_logs_params)
            return

    responseJson = json.loads(response)
    
    # add story_id for saving to db
    responseJson["story_id"] = story_id
    
    print("saving to db")
    save_to_db(responseJson)

    characterName = story_character_name(story_id)
    gen_logs_params['name'] = characterName
    print(f"logging: {str(gen_logs_params)}")
    log_generation(gen_logs_params)

# Exceptions:
#  - Content Flagged
#  - Max tries exceeded
def generate_response(system_prompt: str, user_prompt: str) -> str:
    print(system_prompt)
    print(user_prompt)
    
    text_json = generate_story_max_tries(system_prompt, user_prompt)

    pages = text_json["story"]
    for page in pages:
        page["image_url"] = generate_image_max_tries(page["image_prompt"])

    return json.dumps(text_json)


############################## MAX TRY FUNCTIONS ############################## 


# Exceptions:
#   - Content Flagged
#   - Max tries exceeded
def generate_story_max_tries(system_prompt: str, user_prompt: str, max_tries: int = MAX_REGENERATION_TRIES) -> dict:
    text_response = None
    remaining_tries = max_tries

    while text_response is None and remaining_tries > 0:
        # try generating story, if exception, retry
        try:
            text_response = generate_story(system_prompt, user_prompt)
        except Exception as e:
            print("Error in generating story, retrying...")
            remaining_tries -= 1
            text_response = None
            continue

        if ("Content Flag" in text_response):
            raise Exception("Content Flagged: " + text_response)

        text_json = json.loads(text_response)
        print(f'Response: {text_json}')

        if not validate_response(text_json):
            print("Response format was invalid, retrying...")
            remaining_tries -= 1
            text_response = None
            continue

        pages = text_json["story"]
        for page in pages:
            page['image_prompt'] = f'{substitute_actors(page["image_prompt"], page["subject_description"])}'

    if text_response is None:
        print("Error in generating story, max tries exceeded")
        raise Exception("Max tries exceeded")

    print(f'Tried {max_tries - remaining_tries + 1} times')

    return text_json


# Exceptions:
#   - Max tries exceeded
def generate_image_max_tries(prompt: str, max_tries: int = MAX_REGENERATION_TRIES) -> str:
    remaining_tries = max_tries
    image_url = None
    while image_url is None and remaining_tries > 0:
        # try generating image, if exception, retry
        try:
            image_url = generate_image_from_prompt(prompt)
        except:
            print("Error in generating image, retrying...")
            remaining_tries -= 1
            image_url = None
            continue

    if image_url is None:
        print("Error in generating image, max tries exceeded")
        raise Exception("Max tries exceeded")

    print(f'Tried {max_tries - remaining_tries + 1} times')

    return image_url


############################## EXTERNAL API CALLS ##############################


# Exceptions:
#   - Story generation error
def generate_story(system_prompt: str, user_prompt: str) -> str:
    print('Generating story')
    try:
        response = openai.ChatCompletion.create(
            model = "gpt-3.5-turbo",
            # n = 1, => higher = generate multiple messages choices
            top_p = 0.8,
            # frequency_penalty = 0,
            # presence_penalty = 0,
            temperature = 0.7,
            messages = [
                {
                    "role": "system", 
                    "content": system_prompt
                },
                {
                    "role": "user", 
                    "content": user_prompt
                },
                # {
                #     "role": "assistant", 
                #     "content": str(generate_story_debugger("prompt"))
                # },
            ],
        )

    except Exception as e:
        print("Error in creating story:", str(e))
        raise Exception("Story generation error")

    return response["choices"][0]["message"]["content"]

def generate_avatar_from_prompt(prompt):
    print(f"openai_api: Generating image with prompt: '{prompt}'")
    api_host = 'https://api.stability.ai'
    engine_id = "stable-diffusion-xl-1024-v1-0"

    # Making a POST request to the Stability API
    response = requests.post(
        f"{api_host}/v1/generation/{engine_id}/text-to-image",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {STABILITY_API_KEY}"  # Using your defined STABILITY_API_KEY
        },
        json={
            "text_prompts": [
                {
                    "text": f"{prompt}, cute, portrait",
                    "weight": 1
                },
                {
                    "text": f"beautiful realistic eyes",
                    "weight": 0.3
                },
                {
                    "text": "text, watermark, low-quality, signature,\
                        moiré pattern, downsampling, aliasing, distorted, \
                        blurry, glossy, blur, jpeg artifacts, compression artifacts, \
                        poorly drawn, low-resolution, bad, distortion, twisted, excessive, \
                        exaggerated pose, exaggerated limbs, grainy, symmetrical, duplicate, \
                        error, pattern, beginner, pixelated, fake, hyper, glitch, overexposed, \
                        high-contrast, bad-contrast, poorly drawn hands, poorly rendered hands, mutated limbs",
                    "weight": -0.7
                }],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
        }
    )

    # Handling non-successful responses
    if response.status_code != 200:
        print("Error in creating image:", response.text)
        return 503

    # Extracting the base64 encoded image data and decoding it
    data = response.json()
    img_data_base64 = data["artifacts"][0]["base64"]
    img_payload = {
        "image": f"data:image/png;base64,{img_data_base64}"}

    return json.dumps(img_payload)

# Exceptions:
#   - Image generation error
def generate_image_from_prompt(prompt: str) -> str:
    print(f"openai_api: Generating image with prompt: '{prompt}'")
    api_host = 'https://api.stability.ai'
    engine_id = "stable-diffusion-xl-1024-v1-0"

    # Making a POST request to the Stability API
    response = requests.post(
        f"{api_host}/v1/generation/{engine_id}/text-to-image",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {STABILITY_API_KEY}"  # Using your defined STABILITY_API_KEY
        },
        json={
            "text_prompts": [
                {
                    "text": f"{prompt} watercolor, storybook",
                    "weight": 1
                },
                {
                    "text": f"beautiful realistic eyes",
                    "weight": 0.3
                },
                {
                    "text": "text, watermark, low-quality, signature,\
                        moiré pattern, downsampling, aliasing, distorted, \
                        blurry, glossy, blur, jpeg artifacts, compression artifacts, \
                        poorly drawn, low-resolution, bad, distortion, twisted, excessive, \
                        exaggerated pose, exaggerated limbs, grainy, symmetrical, duplicate, \
                        error, pattern, beginner, pixelated, fake, hyper, glitch, overexposed, \
                        high-contrast, bad-contrast, poorly drawn hands, poorly rendered hands, mutated limbs",
                    "weight": -0.7
                }],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 20,
        }
    )

    # Handling non-successful responses
    if response.status_code != 200:
        print("Error in creating image:", response.text)
        raise Exception("Image generation error")

    # Extracting the base64 encoded image data and decoding it
    data = response.json()
    img_data_base64 = data["artifacts"][0]["base64"]

    return f"data:image/png;base64,{img_data_base64}"

    # print(data)

    # if not os.path.exists('./static'):
    #     os.makedirs('./static')

    # # Saving the image locally
    # img_name = f"./static/v1_txt2img_{prompt[:10]}.png"  # Naming the image using the first 10 chars of the prompt for uniqueness
    # with open(img_name, "wb") as f:
    #     f.write(img_data)


############################## HELPER FUNCTIONS ##############################


def log_generation(gen_logs_params: dict) -> None:
    print(f"openai_api::log_generation: {gen_logs_params}")
    try:
        response = requests.post(
            f"{STORAGE_URL}/log-generation",
            headers={
                "Content-Type": "application/json",
            },
            json=gen_logs_params
        )
        print(f"log_generation: {str(response)}")
    except Exception as e:
        print(f"Error logging generation: {str(e)}")

def story_character_name(story_id: int):
    try:
        response = requests.get(
            f"{STORAGE_URL}/{story_id}/story-character-name",
        )
        responseJson = response.json()
        print(f"story character name: {responseJson}")
        return responseJson
    except Exception as e:
        print(f"Error getting story character name: {str(e)}")

# saves story pages and title to db
def save_to_db(story_data: dict) -> None:
    # TODO: add error handling
    response = requests.post(
        f"{STORAGE_URL}/save-story-pages-title-moral-genre",
        headers={
            "Content-Type": "application/json",
        },
        json=story_data
    )
    print(f"save_to_db: {str(response)}")

def generate_random_story() -> str:
    # Define arrays for placeholders
    main_stories = [
        "exploring a magical forest", "finding confidence in a circus", "discovering a hidden treasure", "making new friends in an enchanted garden", "embarking on a treasure hunt",
        "solving a mystery in the jungle", "learning to fly with the birds", "unlocking a secret in an ancient cave", "traveling to the moon", "saving a kingdom from darkness",
        "helping an injured animal", "rescuing lost souls", "meeting a time-traveling friend", "uncovering a hidden world", "finding a lost city",
        "learning the secrets of the stars", "sailing the seven seas", "journeying to a parallel universe", "helping a fairy in distress", "meeting magical creatures"
    ]
    challenges = [
        "overcoming bedtime fears", "saving the day from a mischievous dragon", "helping a lost alien find its way home", "solving riddles and puzzles", "rescuing friends from a tricky situation",
        "defeating an evil sorcerer", "finding a hidden treasure", "stopping an environmental disaster", "saving a mythical creature", "solving a mystery",
        "bringing harmony to a divided world", "breaking a wicked spell", "rebuilding a broken kingdom", "breaking a curse", "finding the lost city of gold",
        "protecting a magical artifact", "stopping time from unraveling", "braving a haunted house", "saving a beloved creature", "bringing back the sun"
    ]
    settings = [
        "in a whimsical circus", "in a candy kingdom", "on an uncharted island", "in a magical forest", "in an enchanted castle",
        "in a futuristic city", "in an underwater world", "in a prehistoric land", "in a wild west town", "in a haunted mansion",
        "in an ancient temple", "in a fairy tale village", "in a time-traveling laboratory", "in a steampunk city", "on a faraway planet",
        "in a dreamy wonderland", "in a snowy kingdom", "in a tropical paradise", "in a whimsical garden", "in a mystical desert"
    ]
    supporting_characters = [
        "a friendly squirrel", "a wise old owl", "a mischievous pixie", "a kind-hearted pirate", "a playful mermaid",
        "a helpful gnome", "a talking parrot", "a loyal dog", "a magical genie", "a wise mentor",
        "a cheerful fairy", "a brave knight", "a misfit unicorn", "a talking teapot", "a curious ghost",
        "a brave princess", "a wise hermit", "a mysterious traveler", "a helpful wizard", "a gentle giant"
    ]

    # Basically a coin flip for each optional component to decide if it should be included
    include_supporting_character = random.choice([True, False])
    include_setting = random.choice([True, False])
    include_challenge = random.choice([True, False])

    # Generate random values for each optional component if it should be included
    setting_description = f", {random.choice(settings)}" if include_setting else ""
    challenge_description = f", {random.choice(challenges)}" if include_challenge else ""
    supporting_character_description = f" with {random.choice(supporting_characters)}" if include_supporting_character else ""

    full_description = f"{random.choice(main_stories)}{setting_description}{challenge_description}{supporting_character_description}."

    # Capitalize the first letter of the output sentence
    full_description = full_description.capitalize()

    return full_description

def substitute_actors(prompt: str, name_to_description: dict) -> str:
    # Replacing the names in the prompt with their descriptions
    for name, desc in name_to_description.items():
        # Removing full stops from the descriptions
        desc = desc.replace(".", "")
        prompt = prompt.replace(name, desc)

    return prompt

# Checks that the response is of the following format:
# {
#     "title": "Creative Story Title Here",
#     "moral": "{values}",
#     "genre": "{genre}",
#     "vocabulary_age": "{vocabAge}",
#     "total_pages": "{numPages}",
#     "story": [
#         {
#             "page": 1,
#             "text": "First page of the story text goes here",
#             "image_prompt": "A subject(s) doing an activity at a place",
#             "subject_description": 
#             {
#                 "Actor1Name": "A 6 year-old boy with black hair",
#                 "Actor2Name": "A girl with blonde hair",
#             }
#         },
#         ...
#     ]
# }
def validate_response(response_dict: dict) -> bool:
    top_level_keys = ["title", "moral", "genre", "vocabulary_age", "total_pages", "story"]
    story_page_keys = ["page", "text", "image_prompt", "subject_description"]
    # check that:
    # 1. all top level keys are present
    # 2. all story page keys are present
    # 3. all subject descriptions are valid dictionaries
    return all(key in response_dict for key in top_level_keys) and \
           all(key in page for page in response_dict["story"] for key in story_page_keys) and \
           all(isinstance(page["subject_description"], dict) for page in response_dict["story"])