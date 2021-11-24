import { admin, db, functions } from "../firebase";
import { changeLog } from "../utils";
import { COLLECTIONS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnUpdated
exports.eventResponsesOnUpdated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onUpdate((change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If an event-response document response field is updated, increment or decrement
    // the related event responses count field.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousEventResponseData = change.before.data();
    const newEventResponseData = change.after.data();
    const changes = [];

    if (previousEventResponseData.response !== newEventResponseData.response) {
      changes.push(
        changeLog(
          previousEventResponseData.response,
          newEventResponseData.response
        )
      );
    }

    if (changes.length > 0) {
      const eventRef = db
        .collection(COLLECTIONS.EVENTS)
        .doc(newEventResponseData.event.id);

      console.log(
        `Event Response ${
          context.params.eventResponseId
        } updated: ${changes.join(", ")}`
      );

      if (newEventResponseData.response === "YES") {
        return eventRef
          .set(
            {
              responses: {
                no: admin.firestore.FieldValue.increment(-1),
                yes: admin.firestore.FieldValue.increment(1),
              },
            },
            { merge: true }
          )
          .catch((err) => {
            console.log(err);
            return false;
          });
      } else if (newEventResponseData.response === "NO") {
        return eventRef
          .set(
            {
              responses: {
                yes: admin.firestore.FieldValue.increment(-1),
                no: admin.firestore.FieldValue.increment(1),
              },
            },
            { merge: true }
          )
          .catch((err) => {
            console.log(err);
            return false;
          });
      }
    }

    return null;
  });
