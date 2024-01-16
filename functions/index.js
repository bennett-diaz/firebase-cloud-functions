/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");

const testUrl = "https://backend-instacap.onrender.com/api/test";
const awakenUrl = "https://backend-instacap.onrender.com/api/awaken";

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello world suceeded", { structuredData: true });
  response.send("Hello world!");
});

exports.triggerWarm = onRequest(async (request, response) => {
  try {
    const res = await axios.get(testUrl);
    logger.log("On-demand request successful, response:", res.data);
    response.send({ message: "On-demand request successful", data: res.data });
  } catch (error) {
    logger.error("Error pinging server:", error);
  }
});

exports.triggerHF = onRequest(async (request, response) => {
  try {
    const res = await axios.post(awakenUrl, { sumModelId: "Salesforce/blip-image-captioning-base" });
    logger.log("On-demand request successful, response:", res.data);
    response.send({ message: "On-demand request successful", data: res.data });
  } catch (error) {
    logger.error("Error pinging server:", error);
  }
});


exports.keepServerWarmNew = onSchedule("every 14 minutes", async (data) => {
  try {
    const response = await axios.get(testUrl);
    logger.log("Server pinged successfully, response:", response.data);
  } catch (error) {
    logger.error("Error pinging server:", error);
  }
});

console.log('test')
console.log('test back')

