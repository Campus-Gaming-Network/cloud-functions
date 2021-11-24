import { db, functions } from "../firebase";
import { changeLog } from "../utils";
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// updateTeammatesOnUserUpdate
exports.updateTeammatesOnUserUpdate = functions.firestore
  .document(DOCUMENT_PATHS.USER)
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

    if (previousUserData.status !== newUserData.status) {
      changes.push(changeLog(previousUserData.status, newUserData.status));
    }

    if (previousUserData.school.id !== newUserData.school.id) {
      changes.push(changeLog(previousUserData.school.id, newUserData.school.id));
    }

    if (changes.length > 0) {
      const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.params.userId);
      const teammtesQuery = db
        .collection(COLLECTIONS.TEAMMATES)
        .where("user.ref", QUERY_OPERATORS.EQUAL_TO, userDocRef);

      console.log(
        `User updated ${context.params.userId} updated: ${changes.join(", ")}`
      );

      return teammtesQuery
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
                    status: newUserData.status,
                    school: {
                      id: newUserData.school.id,
                      ref: newUserData.school.ref,
                      name: newUserData.school.name,
                    },
                  },
                },
                { merge: true }
              );
            });

            return batch.commit();
          }

          return;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });
