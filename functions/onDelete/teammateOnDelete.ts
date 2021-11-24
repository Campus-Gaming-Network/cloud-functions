import { admin, db, functions } from "../firebase";
import { COLLECTIONS, DOCUMENT_PATHS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// teammateOnDelete
exports.teammateOnDelete = functions.firestore
  .document(DOCUMENT_PATHS.TEAMMATES)
  .onDelete(async (snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a teammate document is deleted, find the attached team document if it
    // exists and decrement the memberCount by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const deletedData = snapshot.data();
      const teamRef = db.collection(COLLECTIONS.TEAMS).doc(deletedData.team.id);

      let teamDoc;

      try {
          teamDoc = await teamRef.get();
      } catch (error) {
          console.log(error);
          return false;
      }

      if (teamDoc.exists) {
        try {
          await teamRef.set(
            { memberCount: admin.firestore.FieldValue.increment(-1) },
            { merge: true }
          );
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    }

    return null;
  });
