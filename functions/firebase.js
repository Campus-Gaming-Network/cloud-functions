const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, functions, db, auth };
