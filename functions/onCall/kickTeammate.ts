import { db, functions } from "../firebase";
import { COLLECTIONS, TEAM_ROLES, FUNCTIONS_ERROR_CODES } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// kickTeammate
exports.kickTeammate = functions.https.onCall(async (data, context) => {
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

  if (data.teammateId === context.auth.uid) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'You cannot kick yourself');
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
  const isTeamOfficer = (
    Boolean(team.roles.officer) &&
    team.roles.officer.id === context.auth.uid    
  );

  if (isTeamLeader || isTeamOfficer) {
      const userDocRef = db.collection(COLLECTIONS.USERS).doc(data.teammateId);

      try {
        const teammatesSnapshot = await db
          .collection(COLLECTIONS.TEAMMATES)
          .where("user.ref", "==", userDocRef)
          .where("team.ref", "==", teamDocRef)
          .limit(1)
          .get();
    
        if (!teammatesSnapshot.empty) {
          teammatesSnapshot.docs[0].ref.delete();
        }
      } catch (error: any) {
        throw new functions.https.HttpsError(error.code, error.message);
      }
  } else {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
  }

  return { success: true };
});
