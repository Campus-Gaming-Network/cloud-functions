const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnDelete
exports.eventResponsesOnDelete = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onDelete((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If an event-response document is deleted, find the attached event document if it
    // exists and decrement the responses count by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const deletedData = snapshot.data();

      if (deletedData) {
        const eventRef = db.collection("events").doc(deletedData.event.id);

        if (eventRef.exists) {
          if (deletedData.response === "YES") {
            return eventRef
              .set(
                {
                  responses: { yes: admin.firestore.FieldValue.increment(-1) },
                },
                { merge: true }
              )
              .catch((err) => {
                console.log(err);
                return false;
              });
          } else if (deletedData.response === "NO") {
            return eventRef
              .set(
                { responses: { no: admin.firestore.FieldValue.increment(-1) } },
                { merge: true }
              )
              .catch((err) => {
                console.log(err);
                return false;
              });
          }
        }

        return null;
      }
    }
  });
