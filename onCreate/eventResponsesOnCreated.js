const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnCreated
exports.eventResponsesOnCreated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onCreate((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // To keep track of how many people are going to an event, when a event-response is created
    // find the event tied to it and increment the responses by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const eventResponseData = snapshot.data();
      const eventRef = db.collection("events").doc(eventResponseData.event.id);

      if (eventResponseData.response === "YES") {
        return eventRef
          .set(
            { responses: { yes: admin.firestore.FieldValue.increment(1) } },
            { merge: true }
          )
          .catch((err) => {
            console.log(err);
            return false;
          });
      } else if (eventResponseData.response === "NO") {
        return eventRef
          .set(
            { responses: { no: admin.firestore.FieldValue.increment(1) } },
            { merge: true }
          )
          .catch((err) => {
            console.log(err);
            return false;
          });
      }

      return null;
    }
  });
  