const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

const { isValidEmail } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// searchUsers
exports.searchUsers = functions.https.onCall(async (data, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Allows admins to query for a user based on uid or email.
  //
  // If a matching auth user exists, it will query for the matching firestore document
  // of the user too.
  //
  ////////////////////////////////////////////////////////////////////////////////

  // TODO: Only allow admins access to this route
  try {
    const query = data.query ? data.query.trim() : "";

    let authRecord;
    let record;

    if (query && query !== "") {
      const isEmailQuery = isValidEmail(query);

      if (isEmailQuery) {
        authRecord = await auth.getUserByEmail(query);
      } else {
        authRecord = await auth.getUser(query);
      }

      if (authRecord && authRecord.uid) {
        record = await db.collection("users").doc(authRecord.uid).get();
      }
    }

    return {
      authUser: authRecord,
      docUser: record.exists ? record.data() : null,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
});
