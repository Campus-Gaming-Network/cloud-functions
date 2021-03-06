const { admin, db, functions } = require("../firebase");
const { COLLECTIONS, DOCUMENT_PATHS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// userOnCreated
exports.userOnCreated = functions.firestore
  .document(DOCUMENT_PATHS.USER)
  .onCreate((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // To keep track of how many users belong to a school, when a user is created
    // find the school tied to it and increment the userCount by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const userData = snapshot.data();
      const schoolRef = db.collection(COLLECTIONS.SCHOOLS).doc(userData.school.id);
      return schoolRef.set({ userCount: admin.firestore.FieldValue.increment(1) }, { merge: true }).catch((err) => { console.log(err); return false; });
    }

    return null;
  });
