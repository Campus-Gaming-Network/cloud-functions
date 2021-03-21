const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

////////////////////////////////////////////////////////////////////////////////
// eventOnDelete
exports.eventOnDelete = functions.firestore
  .document("events/{eventId}")
  .onDelete((snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a user deletes an event, find all the event-responses tied to the event and
    // delete those too.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const eventDocRef = db.collection("events").doc(context.params.eventId);
    const eventResponsesQuery = db
      .collection("event-responses")
      .where("event.ref", "==", eventDocRef);

    return eventResponsesQuery
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let batch = db.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          return batch.commit();
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  });
