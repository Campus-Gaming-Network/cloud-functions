const { admin, db, functions } = require("../firebase");
const { COLLECTIONS, DOCUMENT_PATHS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// teammatesOnCreated
exports.teammatesOnCreated = functions.firestore
  .document(DOCUMENT_PATHS.TEAMMATES)
  .onCreate((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // To keep track of how many people are apart of a team, when a teammate is created
    // find the team tied to it and increment the memberCount by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const teammateResponseData = snapshot.data();

      if (teammateResponseData) {
        const teamRef = db.collection(COLLECTIONS.TEAMS).doc(teammateResponseData.team.id);

        if (teamRef.exists) {
          return teamRef
          .set(
          { memberCount: admin.firestore.FieldValue.increment(1) },
          { merge: true }
          )
          .catch((err) => {
          console.log(err);
          return false;
          });
        }
      }

    }

    return null;
  });
