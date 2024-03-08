/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

import { collection, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { db } from "./config.js";

import { ZeroShotClassificationPipelineOptions, pipeline } from "@xenova/transformers";

import { request } from "express";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.process = onRequest(async (request, response) => {
    const sentiment_model = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    const topic_model = await pipeline('zero-shot-classification', 'Xenova/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7');

    type CompiledPreds = {
        content: string;
        date: string;
        sentiment: string;
        mainTag: string;
        subTag: string;
        score: number;
    }

    let preds: CompiledPreds[] = [];

    let mainTags = request.body.tags.map((tag: { mainTag: String; }) => tag.mainTag);

    await Promise.all(request.body.content.map(async (cont: { content: string; date: string }) => {
        const sentiment = await sentiment_model(cont.content) as unknown as { label: string;[key: string]: any; };
        const mainTag = await topic_model(cont.content, mainTags, { multi_label: false } as ZeroShotClassificationPipelineOptions) as { labels: Array<string>;[key: string]: any; };

        const subTags = request.body.tags.find((tag: { mainTag: String; }) => tag.mainTag === mainTag.labels[0]).subTag.map((sT: { name: string;[key: string]: any; }) => sT.name);
        const subTag = await topic_model(cont.content, subTags, { multi_label: false } as ZeroShotClassificationPipelineOptions) as { labels: Array<string>;[key: string]: any; };;

        const multiplier = request.body.tags.find((tag: { mainTag: String; }) => tag.mainTag === mainTag.labels[0]).multiplier;
        const score = request.body.tags.find((tag: { mainTag: String; }) => tag.mainTag === mainTag.labels[0]).subTag.find((sT: { name: string;[key: string]: any; }) => sT.name === subTag.labels[0]).weight * multiplier;

        const compiled: CompiledPreds = {
            content: cont.content,
            date: cont.date,
            sentiment: sentiment[0].label,
            mainTag: mainTag.labels[0],
            subTag: subTag.labels[0],
            score: parseFloat(score.toFixed(2))
        }

        preds.push(compiled);
    }));

    preds.forEach((pred) => {
        addDoc(collection(db, "ClientInstances", request.body.id, "Feedbacks"), pred);
    });

    response.send('Processing Completed');
});
