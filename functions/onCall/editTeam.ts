import { db, functions } from "../firebase";
import { COLLECTIONS } from "../constants";
import { hashPassword } from "../utils";

////////////////////////////////////////////////////////////////////////////////
// editTeam
exports.editTeam = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    return { error: { message: "Invalid request" } };
  }

  if (!context.auth || !context.auth.uid) {
    return { error: { message: "Not authorized" } };
  }

  if (!context.auth.token || !context.auth.token.email_verified) {
    return { error: { message: "Email verification required" } };
  }

  if (!data.teamId) {
    return { error: { message: "Team id required" } };
  }

  if (!data.name || !data.name.trim()) {
    return { error: { message: "Team name required" } };
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let team;

  try {
    const teamRecord = await teamDocRef.get();

    if (teamRecord.exists) {
      team = teamRecord.data();
    }
  } catch (error) {
    return { error };
  }

  if (!team) {
    return { error: { message: "Invalid team" } };
  }

  if (team.roles.leader.id !== context.auth.uid) {
    return { error: { message: "Invalid permissions" }};
  }

  const name = data.name ? data.name.trim() : data.name;
  const shortName = data.shortName ? data.shortName.trim() : data.shortName;
  const description = data.description ? data.description.trim() : data.description;
  const website = data.website ? data.website.trim() : data.website;

  try {
    await teamDocRef.set({
      name,
      shortName,
      description,
      website,
    }, { merge: true });
  } catch (error) {
    return { error };
  }

  if (Boolean(data.password) && Boolean(data.password.trim())) {
    let teamsAuthDocRef;

    try {
      const teamsAuthSnapshot = await db
        .collection(COLLECTIONS.TEAMS_AUTH)
        .where("team.ref", "==", teamDocRef)
        .limit(1)
        .get();
  
      if (teamsAuthSnapshot.empty) {
        return { error: { message: "Invalid team auth" } };
      }
  
      teamsAuthDocRef = teamsAuthSnapshot.docs[0];
    } catch (error) {
      return { error };
    }

    const joinHash = await hashPassword(data.password.trim());

    try {
        await teamsAuthDocRef.set({ joinHash }, { merge: true });
      } catch (error) {
        return { error };
      }
  }

  return { success: true };
});
