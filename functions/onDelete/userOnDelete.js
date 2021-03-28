const { auth, db, functions } = require("../firebase");
const { COLLECTIONS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// userOnDelete
exports.userOnDelete = functions.firestore
  .document("users/{userId}")
  .onDelete((snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // A user can delete their account whenever they want.
    //
    // If they decide to do this, find all documents (events, event-responses) that are attached to this user
    // and delete those too so there is no record of them.
    //
    // We delete both the firestore document of the user and their auth user profile.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const userData = snapshot.data();
    const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.params.userId);
    const schoolDocRef = db.collection(COLLECTIONS.SCHOOLS).doc(userData.school.id);
    const eventsQuery = db
      .collection(COLLECTIONS.EVENTS)
      .where("creator", "==", userDocRef);
    const eventResponsesQuery = db
      .collection(COLLECTIONS.EVENT_RESPONSES)
      .where("user.ref", "==", userDocRef);

    schoolDocRef.set({ userCount: admin.firestore.FieldValue.increment(-1) }, { merge: true }).catch((err) => {
      console.log(err);
    });

    eventResponsesQuery
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let batch = db.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          batch.commit();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    eventsQuery
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let batch = db.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          batch.commit();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return auth.deleteUser(context.params.userId);
  });
