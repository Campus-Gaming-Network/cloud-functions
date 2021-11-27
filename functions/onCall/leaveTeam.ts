import { db, functions } from "../firebase";
import {
  COLLECTIONS,
  FUNCTIONS_ERROR_CODES,
  QUERY_OPERATORS,
} from "../constants";

////////////////////////////////////////////////////////////////////////////////
// leaveTeam
exports.leaveTeam = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new InvalidRequestError();
  }

  if (!context.auth || !context.auth.uid) {
    throw new NotAuthorizedError();
  }

  if (!context.auth.token || !context.auth.token.email_verified) {
    throw new EmailVerificationEror();
  }

  if (!data.teamId || !data.teamId.trim()) {
    throw new functions.https.HttpsError(
      FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION,
      "Team id required"
    );
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
    throw new functions.https.HttpsError(
      FUNCTIONS_ERROR_CODES.NOT_FOUND,
      "Invalid team"
    );
  }

  const isTeamLeader = team.roles.leader.id === context.auth.uid;
  const hasOtherMembers = team.memberCount > 1;

  if (isTeamLeader && hasOtherMembers) {
    throw new functions.https.HttpsError(
      FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION,
      "You must assign a new leader before leaving the team"
    );
  }

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);

  try {
    const teammatesSnapshot = await db
      .collection(COLLECTIONS.TEAMMATES)
      .where("user.ref", QUERY_OPERATORS.EQUAL_TO, userDocRef)
      .where("team.ref", QUERY_OPERATORS.EQUAL_TO, teamDocRef)
      .limit(1)
      .get();

    if (!teammatesSnapshot.empty) {
      teammatesSnapshot.docs[0].ref.delete();
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  return { success: true };
});
