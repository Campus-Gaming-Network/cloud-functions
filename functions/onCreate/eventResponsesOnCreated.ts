import { admin, db, functions } from '../firebase';
import { COLLECTIONS, DOCUMENT_PATHS, EVENT_RESPONSES } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// eventResponsesOnCreated
export const eventResponsesOnCreated = functions.firestore
  .document(DOCUMENT_PATHS.EVENT_RESPONSES)
  .onCreate(async (snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // To keep track of how many people are going to an event, when a event-response is created
    // find the event tied to it and increment the responses by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (!snapshot.exists) {
      return;
    }

    const eventResponseData = snapshot.data();
    const eventRef = db.collection(COLLECTIONS.EVENTS).doc(eventResponseData.event.id);

    if (eventResponseData.response === EVENT_RESPONSES.YES) {
      try {
        await eventRef.set({ responses: { yes: admin.firestore.FieldValue.increment(1) } }, { merge: true });
      } catch (error) {
        console.log(error);
      }
    } else if (eventResponseData.response === EVENT_RESPONSES.NO) {
      try {
        await eventRef.set({ responses: { no: admin.firestore.FieldValue.increment(1) } }, { merge: true });
      } catch (error) {
        console.log(error);
      }
    }

    return;
  });
