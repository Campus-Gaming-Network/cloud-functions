import { admin, db, functions } from "../firebase";
import { COLLECTIONS } from "../constants";

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

        prevSchoolRef.set({ userCount: admin.firestore.FieldValue.increment(-1) }, { merge: true }).then(() => {
            newSchoolRef.set({ userCount: admin.firestore.FieldValue.increment(1) }, { merge: true }).catch((error) => {
                console.log(error);
                return false;
            });
        }).catch((error) => {
            console.log(error);
            return false;
        });
    }

    return null;
  });
