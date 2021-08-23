const { db, functions } = require("../firebase");
const { COLLECTIONS, TEAM_ROLES } = require("../constants");
const { isAuthenticated } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// kickTeammate
exports.kickTeammate = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context) || !data) {
    return { error: { message: "Invalid request" } };
  }

  if (!data.teamId || !data.teamId.trim()) {
    return { error: { message: "Team id required" } };
  }

  if (!data.teammateId || !data.teammateId.trim()) {
    return { error: { message: "Teammate id required" } };
  }

  if (data.teammateId === context.auth.uid) {
    return { error: { message: "You cannot kick yourself" } };
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

  if (
      team.roles.leader.id !== context.auth.uid ||
      (
        Boolean(team.roles.officer) &&
        team.roles.officer.id !== context.auth.uid    
      )
    ) {
    return { error: { message: "Invalid permissions" } };
  }

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(teammateId);

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
