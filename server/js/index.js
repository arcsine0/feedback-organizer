import { pipeline } from '@xenova/transformers';

import { collection, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import cors from 'cors';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

// server config
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// model config
let sentiment_model = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
let topic_model = await pipeline('zero-shot-classification', 'Xenova/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7');

app.post('/process/batch', async (req, res) => {
    let preds = [];

    let mainTags = req.body.tags.map(tag => tag.mainTag);

    // Use Promise.all to wait for all promises to resolve
    await Promise.all(req.body.content.map(async (cont) => {
        let sentiment = await sentiment_model(cont.content);
        let mainTag = await topic_model(cont.content, mainTags, false);

        let subTags = req.body.tags.find(tag => tag.mainTag === mainTag.labels[0]).subTag;
        let subTag = await topic_model(cont.content, subTags, false);

        const compiled = {
            content: cont.content,
            date: cont.date,
            sentiment: sentiment[0].label,
            mainTag: mainTag.labels[0],
            subTag: subTag.labels[0]
        }

        preds.push(compiled);
    }));

    res.send(preds);
});

server.listen(8000, () => {
    console.log('Server listening at port 8000');
});