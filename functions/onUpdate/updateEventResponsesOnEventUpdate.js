const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const { shallowEqual, changeLog } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// updateEventResponsesOnEventUpdate
exports.updateEventResponsesOnEventUpdate = functions.firestore
  .document("events/{eventId}")
  .onUpdate((change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Updates all event responses that are tied to the event we are updating.
    //
    // There are specific fields that are duplicated on the event responses, so we
    // only need to update the event responses if those specific fields change.
    //
    // Data is duplicated on these documents because of the nature of NoSQL databases.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousEventData = change.before.data();
    const newEventData = change.after.data();
    const changes = [];

    if (previousEventData.name !== newEventData.name) {
      changes.push(changeLog(previousEventData.name, newEventData.name));
    }

    if (previousEventData.description !== newEventData.description) {
      changes.push(
        changeLog(previousEventData.description, newEventData.description)
      );
    }

    if (previousEventData.startDateTime !== newEventData.startDateTime) {
      changes.push(
        changeLog(previousEventData.startDateTime, newEventData.startDateTime)
      );
    }

    if (previousEventData.endDateTime !== newEventData.endDateTime) {
      changes.push(
        changeLog(previousEventData.endDateTime, newEventData.endDateTime)
      );
    }

    if (previousEventData.isOnlineEvent !== newEventData.isOnlineEvent) {
      changes.push(
        changeLog(previousEventData.isOnlineEvent, newEventData.isOnlineEvent)
      );
    }

    if (!shallowEqual(previousEventData.responses, newEventData.responses)) {
      changes.push(
        changeLog(previousEventData.responses, newEventData.responses)
      );
    }

    if (!shallowEqual(previousEventData.game, newEventData.game)) {
      changes.push(changeLog(previousEventData.game, newEventData.game));
    }

    if (changes.length > 0) {
      const eventDocRef = db.collection("events").doc(context.params.eventId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("event.ref", "==", eventDocRef);

      console.log(
        `Event ${context.params.eventId} updated: ${changes.join(", ")}`
      );

      return eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.set(
                doc.ref,
                {
                  event: {
                    name: newEventData.name,
                    description: newEventData.description,
                    startDateTime: newEventData.startDateTime,
                    endDateTime: newEventData.endDateTime,
                    isOnlineEvent: newEventData.isOnlineEvent,
                    responses: newEventData.responses,
                    game: newEventData.game,
                  },
                },
                { merge: true }
              );
            });

            return batch.commit();
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });
