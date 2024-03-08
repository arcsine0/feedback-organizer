/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const { collection, getDocs, getDoc, addDoc, doc } = require("firebase/firestore");
const { db } = require("../firebase/config");

const { request } = require("express");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.process = onRequest(async (request, response) => {
    const sentiment_model = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    const topic_model = await pipeline('zero-shot-classification', 'Xenova/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7');

    let preds = [];

    let mainTags = request.body.tags.map(tag => tag.mainTag);
    
    await Promise.all(request.body.content.map(async (cont) => {
        const sentiment = await sentiment_model(cont.content);
        const mainTag = await topic_model(cont.content, mainTags, false);

        const subTags = request.body.tags.find(tag => tag.mainTag === mainTag.labels[0]).subTag.map(sT => sT.name);
        const subTag = await topic_model(cont.content, subTags, false);

        const multiplier = request.body.tags.find(tag => tag.mainTag === mainTag.labels[0]).multiplier;
        const score = request.body.tags.find(tag => tag.mainTag === mainTag.labels[0]).subTag.find(sT => sT.name === subTag.labels[0]).weight * multiplier;

        const compiled = {
            content: cont.content,
            date: cont.date,
            sentiment: sentiment[0].label,
            mainTag: mainTag.labels[0],
            subTag: subTag.labels[0],
            score: parseFloat(score).toFixed(2)
        }

        preds.push(compiled);
    }));

    preds.forEach((pred) => {
        addDoc(collection(db, "ClientInstances", request.body.id, "Feedbacks"), pred);
    });

    response.send('Processing Completed');
});
