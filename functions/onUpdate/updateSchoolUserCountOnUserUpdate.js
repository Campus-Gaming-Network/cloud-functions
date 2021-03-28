const { db, functions } = require("../firebase");
const { COLLECTIONS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// updateSchoolUserCountOnUserUpdate
exports.updateSchoolUserCountOnUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate((change) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // When a user updates their school, decrement the previous schools userCount
    // and increment the new users school userCount.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousUserData = change.before.data();
    const newUserData = change.after.data();

    if (previousUserData.school.id !== newUserData.school.id) {
        const prevSchoolRef = db.collection(COLLECTIONS.SCHOOLS).doc(previousUserData.school.id);
        const newSchoolRef = db.collection(COLLECTIONS.SCHOOLS).doc(previousUserData.school.id);

        try {
            await prevSchoolRef.set({ userCount: admin.firestore.FieldValue.increment(-1) }, { merge: true });
        } catch (error) {
            console.log(error);
            return false;
        }

        try {
            await newSchoolRef.set({ userCount: admin.firestore.FieldValue.increment(1) }, { merge: true });    
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }

    return null;
  });
