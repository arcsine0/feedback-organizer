import { pipeline } from '@xenova/transformers';

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

app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// model config
let sentiment_model = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
let topic_model = await pipeline('zero-shot-classification', 'Xenova/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7');

app.post('/process/batch', async (req, res) => {
    console.log(req.body);
    let sentiment = sentiment_model(req.body[0].content);
    console.log(sentiment);

    res.send({'response': 'test'});
});

server.listen(8000, () => {
    console.log('Server listening at port 8000');
});