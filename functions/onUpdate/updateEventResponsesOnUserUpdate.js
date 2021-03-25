const { db, functions } = require("../firebase");
const { changeLog } = require("../utils");
const { COLLECTIONS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// updateEventResponsesOnUserUpdate
exports.updateEventResponsesOnUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // When a user updates specific fields on their document, update all other documents
    // that contain the duplicated data that we are updating.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousUserData = change.before.data();
    const newUserData = change.after.data();
    const changes = [];

    if (previousUserData.firstName !== newUserData.firstName) {
      changes.push(
        changeLog(previousUserData.firstName, newUserData.firstName)
      );
    }

    if (previousUserData.lastName !== newUserData.lastName) {
      changes.push(changeLog(previousUserData.lastName, newUserData.lastName));
    }

    if (previousUserData.gravatar !== newUserData.gravatar) {
      changes.push(changeLog(previousUserData.gravatar, newUserData.gravatar));
    }

    if (changes.length > 0) {
      const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.params.userId);
      const eventResponsesQuery = db
        .collection(COLLECTIONS.EVENT_RESPONSES)
        .where("user.ref", "==", userDocRef);

      console.log(
        `User updated ${context.params.userId} updated: ${changes.join(", ")}`
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
                  user: {
                    firstName: newUserData.firstName,
                    lastName: newUserData.lastName,
                    gravatar: newUserData.gravatar,
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
