const { db, functions } = require("../firebase");
const { COLLECTIONS, TEAM_ROLES } = require("../constants");
const { isAuthenticated } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// promoteTeammate
exports.promoteTeammate = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context) || !data) {
    return { error: { message: "Invalid request" } };
  }

  if (!data.teamId || !data.teamId.trim()) {
    return { error: { message: "Team id required" } };
  }

  if (!data.teammateId || !data.teammateId.trim()) {
    return { error: { message: "Teammate id required" } };
  }

  if (!data.role || !data.role.trim()) {
    return { error: { message: "Teammate role is required" } };
  }

  if (!TEAM_ROLES.includes(data.role)) {
    return { error: { message: "Invalid teammate role" } };
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let team;
  let user;

  try {
    const record = await teamDocRef.get();

    if (!record.exists) {
      return { error: { message: "Invalid team" } };
    }

    team = record.data();
  } catch (error) {
    return { error };
  }

  if (team.roles.leader.id === context.auth.uid) {
    return { error: { message: "Invalid permissions" } };
  }

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(teammateId);

  try {
    const record = await userDocRef.get();

    if (!record.exists) {
      return { error: { message: "Invalid user" } };
    }

    user = record.data();
  } catch (error) {
    return { error };
  }

  try {
    await teamDocRef.set({
        roles: {
            [data.role]: {
                id: user.id,
                ref: userDocRef,
            },
        },
    }, { merge: true });
  } catch (error) {
    return { error };
  }

  return { success: true };
});
