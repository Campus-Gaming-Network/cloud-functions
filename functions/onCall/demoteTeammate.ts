import { admin, db, functions } from "../firebase";
import { COLLECTIONS, TEAM_ROLES, FUNCTIONS_ERROR_CODES } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// demoteTeammate
exports.demoteTeammate = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.INVALID_ARGUMENT, 'Invalid request');
  }

  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
  }

  if (!data.teamId || !data.teamId.trim()) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'Team id required');
  }

  if (!data.teammateId || !data.teammateId.trim()) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'Teammate id required');
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let team;

  try {
    const record = await teamDocRef.get();

    if (record.exists) {
      team = record.data();
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (!team) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.NOT_FOUND, 'Invalid team');
  }

  const isTeamLeader = team.roles.leader.id === context.auth.uid;

  if (isTeamLeader) {
    try {
        await teamDocRef.set({
            roles: {
                "officer": admin.firestore.FieldValue.delete(),
            },
        }, { merge: true });
      } catch (error: any) {
        throw new functions.https.HttpsError(error.code, error.message);
      }
  } else {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
  }

  return { success: true };
});