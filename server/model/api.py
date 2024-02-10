from transformers import pipeline
from fastapi import FastAPI
from pydantic import BaseModel

emotion_model = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")
topic_model = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")

app = FastAPI()

class Feedback(BaseModel):
    content: str
    date: str
    tags: list

class Result:
    content: str
    emotion: str
    tag: str
    date: str

@app.get('/')
def read_root():
    return {'Hello': 'World'}

@app.post('/process/')
async def process_feedback(fd: Feedback):
    
    emotion = emotion_model(fd.content)
    tag = topic_model(fd.content, fd.tags, multi_label=False)

    res = {
        'content': fd.content,
        'emotion': emotion[0]['label'],
        'tag': tag['labels'][0],
        'date': fd.date
    }    
        
    return {'response': res}
    