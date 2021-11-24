import { admin, db, functions } from "../firebase";
import { COLLECTIONS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnDelete
exports.eventResponsesOnDelete = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onDelete(async (snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If an event-response document is deleted, find the attached event document if it
    // exists and decrement the responses count by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const deletedData = snapshot.data();

      if (deletedData) {
        const eventRef = db.collection(COLLECTIONS.EVENTS).doc(deletedData.event.id);

        let eventDoc;

        try {
            eventDoc = await eventRef.get();
        } catch (error) {
            console.log(error);
            return false;
        }

        if (eventDoc.exists && deletedData.response === "YES") {

          try {
            await eventRef.set(
              { responses: { yes: admin.firestore.FieldValue.increment(-1) } },
              { merge: true }
            ) 
          } catch (error) {
            console.log(error);
            return false;
          }

        } else if (eventDoc.exists && deletedData.response === "NO") {

          try {
            await eventRef.set(
              { responses: { no: admin.firestore.FieldValue.increment(-1) } },
              { merge: true }
            )
          } catch (error) {
            console.log(error);
            return false;
          }

        }

      }
    }

    return;
  });
