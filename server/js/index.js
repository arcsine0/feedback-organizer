import { pipeline } from '@xenova/transformers';

import { collection, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { db } from "./firebase/config.js";

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
    
    await Promise.all(req.body.content.map(async (cont) => {
        const sentiment = await sentiment_model(cont.content);
        const mainTag = await topic_model(cont.content, mainTags, false);

        const subTags = req.body.tags.find(tag => tag.mainTag === mainTag.labels[0]).subTag.map(sT => sT.name);
        const subTag = await topic_model(cont.content, subTags, false);

        const multiplier = req.body.tags.find(tag => tag.mainTag === mainTag.labels[0]).multiplier;
        const score = req.body.tags.find(tag => tag.mainTag === mainTag.labels[0]).subTag.find(sT => sT.name === subTag.labels[0]).weight * multiplier;

        const compiled = {
            content: cont.content,
            date: cont.date,
            sentiment: sentiment[0].label,
            mainTag: mainTag.labels[0],
            subTag: subTag.labels[0],
            score: parseFloat(score).toFixed(2),
            status: req.body.status,
            note: req.body.note
        }

        preds.push(compiled);
    }));

    preds.forEach((pred) => {
        addDoc(collection(db, "ClientInstances", req.body.id, "Feedbacks"), pred);
    });

    res.send('Processing Completed');
});

server.listen(8000, () => {
    console.log('Server listening at port 8000');
});