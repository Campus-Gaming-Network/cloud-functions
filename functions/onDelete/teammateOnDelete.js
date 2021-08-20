const { admin, db, functions } = require("../firebase");
const { COLLECTIONS, DOCUMENT_PATHS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// teammateOnDelete
exports.teammateOnDelete = functions.firestore
  .document(DOCUMENT_PATHS.TEAMMATES)
  .onDelete((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a teammate document is deleted, find the attached team document if it
    // exists and decrement the memberCount by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    console.log('snapshot.exists', snapshot.exists)

    if (snapshot.exists) {
      const deletedData = snapshot.data();

      console.log('deletedData', deletedData)

      if (deletedData) {
        console.log('deletedData.team.id', deletedData.team.id)
        const teamRef = db.collection(COLLECTIONS.TEAMS).doc(deletedData.team.id);

        if (teamRef.exists) {
            return teamRef
              .set(
                { memberCount: admin.firestore.FieldValue.increment(-1) },
                { merge: true }
              )
              .catch((err) => {
                console.log(err);
                return false;
              });
        }

        return null;
      }
    }
  });
