const { db, functions } = require("../firebase");
const { COLLECTIONS } = require("../constants");
const { isAuthenticated, comparePasswords } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// joinTeam
exports.joinTeam = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context) || !data) {
    return { error: { message: "Invalid request" } };
  }

  if (!data.teamId || !data.teamId.trim()) {
    return { error: { message: "Team id required" } };
  }

  if (!data.password || !data.password.trim()) {
    return { error: { message: "Team password required" } };
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);

  let teamAuth;
  let team;
  let user;

  try {
    const snapshot = await db
      .collection(COLLECTIONS.TEAMS_AUTH)
      .where("team.ref", "==", teamDocRef)
      .get();

    if (snapshot.empty) {
      return { error: { message: "Invalid team" } };
    }

    teamAuth = snapshot[0].data();
  } catch (error) {
    return { error };
  }

  if (Boolean(teamAuth)) {
    if (!await comparePasswords(data.password, teamAuth.joinHash)) {
      return { error: { message: "Invalid password" } };
    }
  }

  try {
    const record = await db
      .collection(COLLECTIONS.TEAMS)
      .doc(teamAuth.team.id)
      .get();

    if (!record.exists) {
      return { error: { message: "Invalid team" } };
    }

    team = record.data();
  } catch (error) {
    return { error };
  }

  try {
    const record = await db
      .collection(COLLECTIONS.USERS)
      .doc(context.auth.uid)
      .get();

    if (!record.exists) {
      return { error: { message: "Invalid user" } };
    }

    user = record.data();
  } catch (error) {
    return { error };
  }

  try {
    await db.collection(COLLECTIONS.TEAMMATES).add({
      user: {
        id: user.id,
        ref: user.ref,
        firstName: user.firstName,
        lastName: user.lastName,
        gravatar: user.gravatar,
        status: user.status,
        school: {
          ref: user.school.ref,
          id: user.school.id,
          name: user.school.name,
        },
      },
      team: {
        id: team.id,
        ref: team.ref,
        name: team.name,
        shortName: team.shortName,
      },
    });
  } catch (error) {
    return { error };
  }

  return null;
});
