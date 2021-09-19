const { db, functions } = require("../firebase");
const { COLLECTIONS } = require("../constants");
const { isAuthenticated, hashPassword, hasVerifiedEmail } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// editTeam
exports.editTeam = functions.https.onCall(async (data, context) => {
  if (!data) {
    return { error: { message: "Invalid request" } };
  }

  if (!isAuthenticated(context)) {
    return { error: { message: "Account required" } };
  }

  if (!hasVerifiedEmail(context)) {
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

    if (!teamRecord.exists) {
      return { error: { message: "Invalid team" } };
    }

    team = teamRecord.data();
  } catch (error) {
    return { error };
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
