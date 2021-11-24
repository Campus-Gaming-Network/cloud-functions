import { admin, db, functions } from "../firebase";
import { COLLECTIONS, TEAM_ROLES } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// demoteTeammate
exports.demoteTeammate = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    return { error: { message: "Invalid request" } };
  }

  if (!context.auth || !context.auth.uid) {
    return { error: { message: "Not authorized" } };
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

    if (record.exists) {
      team = record.data();
    }
  } catch (error) {
    return { error };
  }

  if (!team) {
    return { error: { message: "Invalid team" } };
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
