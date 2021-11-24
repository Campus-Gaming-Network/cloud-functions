import { admin, db, functions } from "../firebase";
import { COLLECTIONS, DOCUMENT_PATHS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// teammateOnCreated
exports.teammateOnCreated = functions.firestore
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
      const teamRef = db.collection(COLLECTIONS.TEAMS).doc(teammateResponseData.team.id);

      return teamRef.set(
        { memberCount: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );
    }

    return null;
  });
