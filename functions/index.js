/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");

const sumModel = "Salesforce/blip-image-captioning-base";
// const testUrl = "https://backend-instacap.onrender.com/api/test";
const awakenUrl = "https://backend-instacap.onrender.com/api/awaken";
const awakenUrl = "https://backend-instacap.onrender.com/api/image/awaken";


exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello world suceeded", { structuredData: true });
  response.send("Hello world!");
  response.send(`Hello ${process.env.PLANET} and ${process.env.AUDIENCE}`);
});


exports.triggerHF = onRequest(async (request, response) => {
  try {
    const res = await axios.post(awakenUrl, {sumModelId: sumModel});
    logger.log("HF on-demand request successful, response:", res.data);
    response.send({message: "HF on-demand request successful", data: res.data});
  } catch (error) {
    logger.error("Error pinging /awaken endpoint:", error);
    response.status(500).send({error: "Error pinging /awaken endpoint"});
  }
});

exports.keepHfWarm = onSchedule("every 14 minutes", async (data) => {
  try {
    const res = await axios.post(awakenUrl, {sumModelId: sumModel});
    logger.log("HF wake request successful, response:", res.data);
  } catch (error) {
    logger.error("Error with HF wake cron job:", error);
  }
});

// also firebase remoteconfig, generate an image
// exports.keepBackendWarm = onSchedule("every 14 minutes", async (data) => {
//   try {
//     const res = await axios.get(testUrl);
//     logger.log("Server pinged successfully, response:", res.data);
//   } catch (error) {
//     logger.error("Error pinging server for keepBackendWarm:", error);
//   }
// });
