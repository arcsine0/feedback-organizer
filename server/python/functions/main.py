# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app

from transformers import pipeline
from pydantic import BaseModel

sentiment_model = pipeline("text-classification", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")
topic_model = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7")

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

initialize_app()

@https_fn.on_request()
def process(req: https_fn.Request) -> https_fn.Response:
    data = req.data
    # main_tags = [tag["mainTag"] for tag in req.body.tags["tags"]]

    # sentiment = sentiment_model(fd.content)
    # mainTag = topic_model(fd.content, main_tags, multi_label=False)

    # sub_tags = [tag["subTag"] for tag in fd.tags["tags"] if tag["mainTag"] == mainTag['labels'][0]]
    # subTag = topic_model(fd.content, sub_tags[0], multi_label=False)

    # res = {
    #     'content': fd.content,
    #     'date': ,
    #     'sentiment': ,
    #     'mainTag': mainTag.labels[0],
    #     'subTag': subTag.labels[0],
    #     'score': ,
    #     'status':,
    #     'note': 
    # }    
    print(data)
    return https_fn.Response("Hello world!")