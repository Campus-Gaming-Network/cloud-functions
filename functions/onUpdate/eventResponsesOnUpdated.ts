import { admin, db, functions } from "../firebase";
import { changeLog } from "../utils";
import { COLLECTIONS, DOCUMENT_PATHS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnUpdated
exports.eventResponsesOnUpdated = functions.firestore
  .document(DOCUMENT_PATHS.EVENT_RESPONSES)
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
        eventRef.set({
            responses: {
              no: admin.firestore.FieldValue.increment(-1),
              yes: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
      } else if (newEventResponseData.response === "NO") {
        eventRef.set({
            responses: {
              yes: admin.firestore.FieldValue.increment(-1),
              no: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
      }
    }

    return;
  });
