import { db, functions } from "../firebase";
import { COLLECTIONS, TEAM_ROLES } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// kickTeammate
exports.kickTeammate = functions.https.onCall(async (data, context) => {
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

  if (!team) {
    return { error: { message: "Invalid team" } };
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
      } catch (error) {
        return { error };
      }
  } else {
    return { error: { message: "Invalid permissions" } };
  }

  return { success: true };
});
