import { db, functions } from "../firebase";
import { COLLECTIONS, DOCUMENT_PATHS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// eventOnDelete
exports.eventOnDelete = functions.firestore
  .document(DOCUMENT_PATHS.EVENT)
  .onDelete((snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a user deletes an event, find all the event-responses tied to the event and
    // delete those too.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const eventDocRef = db.collection(COLLECTIONS.EVENTS).doc(context.params.eventId);
    const eventResponsesQuery = db
      .collection(COLLECTIONS.EVENT_RESPONSES)
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

        return;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  });
