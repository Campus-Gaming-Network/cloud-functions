const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

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

    const userDocRef = db.collection("users").doc(context.params.userId);
    const eventsQuery = db
      .collection("events")
      .where("creator", "==", userDocRef);
    const eventResponsesQuery = db
      .collection("event-responses")
      .where("user.ref", "==", userDocRef);

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
  