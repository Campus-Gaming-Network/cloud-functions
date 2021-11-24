import { db, functions } from "../firebase";
import { changeLog } from "../utils";
import { COLLECTIONS, DOCUMENT_PATHS, QUERY_OPERATORS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// updateTeammatesOnTeamUpdate
exports.updateTeammatesOnTeamUpdate = functions.firestore
  .document(DOCUMENT_PATHS.TEAM)
  .onUpdate((change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // When a team updates specific fields on their document, update all other documents
    // that contain the duplicated data that we are updating.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousTeamData = change.before.data();
    const newUserData = change.after.data();
    const changes = [];

    if (previousTeamData.name !== newUserData.name) {
      changes.push(changeLog(previousTeamData.name, newUserData.name));
    }

    if (previousTeamData.shortName !== newUserData.shortName) {
      changes.push(changeLog(previousTeamData.shortName, newUserData.shortName));
    }

    if (changes.length > 0) {
      const teammtesQuery = db.collection(COLLECTIONS.TEAMMATES).where("team.id", QUERY_OPERATORS.EQUAL_TO, context.params.teamId);

      console.log(
        `Team updated ${context.params.userId} updated: ${changes.join(", ")}`
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
                  team: {
                    name: newUserData.name,
                    shortName: newUserData.shortName,
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
