import { db, functions } from "../firebase";
import { COLLECTIONS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// leaveTeam
exports.leaveTeam = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    return { error: { message: "Invalid request" } };
  }

  if (!context.auth || !context.auth.uid) {
    return { error: { message: "Not authorized" } };
  }

  if (!context.auth.token || !context.auth.token.email_verified) {
    return { error: { message: "Email verification required" } };
  }

  if (!data.teamId || !data.teamId.trim()) {
    return { error: { message: "Team id required" } };
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let team;

  try {
    const record = await teamDocRef.get();

    if (!record.exists) {
      return { error: { message: "Invalid team" } };
    }

    team = record.data();
  } catch (error) {
    return { error };
  }

  if (!team) {
    return { error: { message: "Invalid team" } };
  }

  const isTeamLeader = team.roles.leader.id === context.auth.uid;
  const hasOtherMembers = team.memberCount > 1;

  if (isTeamLeader && hasOtherMembers) {
    return { error: { message: "You must assign a new leader before leaving the team." } };
  }

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);

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
  } catch (error) {
    return { error };
  }

  return { success: true };
});
