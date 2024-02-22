from transformers import pipeline
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

emotion_model = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")
topic_model = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")

app = FastAPI()

class Feedback(BaseModel):
    content: str
    date: str
    tags: dict

class FeedbackBatch(BaseModel):
    content: list
    tags: list

class Result:
    content: str
    emotion: str
    tag: str
    subTag: str
    date: str

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/process/')
async def process_feedback(fd: Feedback):
    main_tags = [tag["mainTag"] for tag in fd.tags["tags"]]

    emotion = emotion_model(fd.content)
    mainTag = topic_model(fd.content, main_tags, multi_label=False)

    sub_tags = [tag["subTag"] for tag in fd.tags["tags"] if tag["mainTag"] == mainTag['labels'][0]]
    subTag = topic_model(fd.content, sub_tags[0], multi_label=False)

    res = {
        'content': fd.content,
        'emotion': emotion[0]['label'],
        'tag': mainTag['labels'][0],
        'subTag': subTag['labels'][0],
        'date': fd.date
    }    

    file_path = "./data/Feedbacks.JSON"
    try:
        with open(file_path, 'r') as json_file:
            cached_feedbacks = json.load(json_file)
    except FileNotFoundError:
        cached_feedbacks = {'feedbacks': []}

    cached_feedbacks['feedbacks'].append(res)

    with open(file_path, 'w') as json_file:
        json.dump(cached_feedbacks, json_file, indent=2) 
        
    return {'response': res}

@app.post('/process/batch')
async def process_feedback(fdb: FeedbackBatch):
    main_tags = [tag["mainTag"] for tag in fdb.tags]

    print(main_tags)
    for fd in fdb.content:
        print(fd)

    # emotion = emotion_model(fd.content)
    # mainTag = topic_model(fd.content, main_tags, multi_label=False)

    # sub_tags = [tag["subTag"] for tag in fdb.tags if tag["mainTag"] == mainTag['labels'][0]]
    # subTag = topic_model(fd.content, sub_tags[0], multi_label=False)

    # res = {
    #     'content': fd.content,
    #     'emotion': emotion[0]['label'],
    #     'tag': mainTag['labels'][0],
    #     'subTag': subTag['labels'][0],
    #     'date': fd.date
    # }    

        
    return {'response': 'test'}
    