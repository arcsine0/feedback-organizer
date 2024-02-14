from transformers import pipeline
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

emotion_model = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")
topic_model = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")

app = FastAPI()

class Feedback(BaseModel):
    content: str
    date: str
    tags: dict

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


@app.get('/')
def read_root():
    return {'Hello': 'World'}

@app.post('/process/')
async def process_feedback(fd: Feedback):
    main_tags = [tag["mainTag"] for tag in fd.tags["tags"]]

    emotion = emotion_model(fd.content)
    mainTag = topic_model(fd.content, main_tags, multi_label=False)

    sub_tags = [tag["subTag"] for tag in fd.tags["tags"] if tag["mainTag"] == mainTag['labels'][0]]
    subTag = topic_model(fd.content, sub_tags[0], multi_label=False)

    print(sub_tags)

    res = {
        'content': fd.content,
        'emotion': emotion[0]['label'],
        'tag': mainTag['labels'][0],
        'subTag': subTag['labels'][0],
        'date': fd.date
    }    
        
    return {'response': res}
    