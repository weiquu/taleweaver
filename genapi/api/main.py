import json
import sys
from pathlib import Path

from typing import Any
from pydantic import BaseModel

sys.path.append(str(Path(__file__).parent.parent.parent))

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, BackgroundTasks
from api.openai_api import generate_response, generate_random_story, generate_image_from_prompt, generate_avatar_from_prompt, \
    generate_and_save

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

@app.get("/")
async def root():
    return {"message": "Hello World"}

class QuestionRequest(BaseModel):
    system_prompt: str
    user_prompt: str
    context: Any

@app.post("/generate-story")
async def get_story(request_data: QuestionRequest):
    system_prompt = request_data.system_prompt
    user_prompt = request_data.user_prompt
    response = generate_response(system_prompt, user_prompt)
    print(response)
    return response

class GenerationJobRequest(BaseModel):
    user_id: str
    story_id: int
    system_prompt: str
    user_prompt: str
    context: Any

@app.post("/submit-story-generation-job")
async def submit_story_generation_job(request_data: GenerationJobRequest, background_tasks: BackgroundTasks):
    user_id = request_data.user_id
    story_id = request_data.story_id
    system_prompt = request_data.system_prompt
    user_prompt = request_data.user_prompt
    background_tasks.add_task(generate_and_save, user_id, story_id, system_prompt, user_prompt)
    return {"message": "Story generation job submitted in the background"}

class ImageRequest(BaseModel):
    prompt: str

@app.post("/generate-image")
async def generate_image(imagePrompt: ImageRequest):
    response = generate_image_from_prompt(imagePrompt.prompt)
    print("Generated image successfully.")
    return response

@app.get("/generate-random-story")
async def generate_random_story_endpoint():
    response = generate_random_story()
    print(response)
    return response

@app.post("/generate-avatar")
async def generate_avatar(imagePrompt: ImageRequest):
    response = generate_avatar_from_prompt(imagePrompt.prompt)
    print("Generated avatar successfully.")
    return response
