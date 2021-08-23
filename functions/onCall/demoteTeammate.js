const { admin, db, functions } = require("../firebase");
const { COLLECTIONS, TEAM_ROLES } = require("../constants");
const { isAuthenticated } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// demoteTeammate
exports.demoteTeammate = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context) || !data) {
    return { error: { message: "Invalid request" } };
  }

  if (!data.teamId || !data.teamId.trim()) {
    return { error: { message: "Team id required" } };
  }

  if (!data.teammateId || !data.teammateId.trim()) {
    return { error: { message: "Teammate id required" } };
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

  const isTeamLeader = team.roles.leader.id === context.auth.uid;

  if (isTeamLeader) {
    try {
        await teamDocRef.set({
            roles: {
                "officer": admin.firestore.FieldValue.delete(),
            },
        }, { merge: true });
    } catch (error) {
        return { error };
    }
  } else {
    return { error: { message: "Invalid permissions" } };
  }

  return { success: true };
});
