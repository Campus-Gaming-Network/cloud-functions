import { db, functions } from "../firebase";
import { COLLECTIONS, TEAM_ROLES } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// promoteTeammate
exports.promoteTeammate = functions.https.onCall(async (data, context) => {
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

  if (!team) {
    return { error: { message: "Invalid team" } };
  }

  const isTeamLeader = team.roles.leader.id === context.auth.uid;

  if (isTeamLeader) {
    const userDocRef = db.collection(COLLECTIONS.USERS).doc(data.teammateId);

    try {
      const record = await userDocRef.get();
  
      if (!record.exists) {
        return { error: { message: "Invalid user" } };
      }
  
      user = record.data();
    } catch (error) {
      return { error };
    }

    if (!user) {
        return { error: { message: "Invalid user" } };
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
  } else {
    return { error: { message: "Invalid permissions" } };
  }

  return { success: true };
});
