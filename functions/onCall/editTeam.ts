import { db, functions } from "../firebase";
import { COLLECTIONS, FUNCTIONS_ERROR_CODES } from "../constants";
import { hashPassword } from "../utils";

////////////////////////////////////////////////////////////////////////////////
// editTeam
exports.editTeam = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.INVALID_ARGUMENT, 'Invalid request');
  }

  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
  }

  if (!context.auth.token || !context.auth.token.email_verified) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Email verification required');
  }

  if (!data.teamId) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'Team id required');
  }

  if (!data.name || !data.name.trim()) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'Team name required');
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let team;

  try {
    const teamRecord = await teamDocRef.get();

    if (teamRecord.exists) {
      team = teamRecord.data();
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (!team) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.INVALID_ARGUMENT, 'Invalid team');
  }

  if (team.roles.leader.id !== context.auth.uid) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
  }

  const name = data.name ? data.name.trim() : data.name;
  const shortName = data.shortName ? data.shortName.trim() : data.shortName;
  const description = data.description ? data.description.trim() : data.description;
  const website = data.website ? data.website.trim() : data.website;

  try {
    await teamDocRef.set({
      name,
      shortName,
      description,
      website,
    }, { merge: true });
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (Boolean(data.password) && Boolean(data.password.trim())) {
    let teamsAuthDocRef;

    try {
      const teamsAuthSnapshot = await db
        .collection(COLLECTIONS.TEAMS_AUTH)
        .where("team.ref", "==", teamDocRef)
        .limit(1)
        .get();
  
      if (!teamsAuthSnapshot.empty) {
        teamsAuthDocRef = teamsAuthSnapshot.docs[0];
      }
    } catch (error: any) {
      throw new functions.https.HttpsError(error.code, error.message);
    }

    if (!teamsAuthDocRef) {
      throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
    }

    const joinHash = await hashPassword(data.password.trim());

    try {
        await teamsAuthDocRef.set({ joinHash }, { merge: true });
      } catch (error: any) {
        throw new functions.https.HttpsError(error.code, error.message);
      }
  }

  return { success: true };
});
