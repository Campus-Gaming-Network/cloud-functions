const { db, functions } = require("../firebase");
const { changeLog } = require("../utils");
const { COLLECTIONS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// updateEventResponsesOnSchoolUpdate
exports.updateEventResponsesOnSchoolUpdate = functions.firestore
  .document("schools/{schoolId}")
  .onUpdate((change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // We store the name of the school tied to an event on the event-response so that it can
    // be used for display reasons. If the name of that school gets changed for whatever reason,
    // we need to update all the event-responses tied to that school.
    //
    // Data is duplicated on these documents because of the nature of NoSQL databases.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousSchoolData = change.before.data();
    const newSchoolData = change.after.data();
    const changes = [];

    if (previousSchoolData.name !== newSchoolData.name) {
      changes.push(changeLog(previousSchoolData.name, newSchoolData.name));
    }

    if (changes.length > 0) {
      const schoolDocRef = db
        .collection(COLLECTIONS.SCHOOLS)
        .doc(context.params.schoolId);
      const eventResponsesQuery = db
        .collection(COLLECTIONS.EVENT_RESPONSES)
        .where("school.ref", "==", schoolDocRef);

      console.log(
        `School updated ${context.params.schoolId} updated: ${changes.join(
          ", "
        )}`
      );

      return eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            return null;
          } else {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.update(
                doc.ref,
                {
                  school: {
                    name: newSchoolData.name,
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
