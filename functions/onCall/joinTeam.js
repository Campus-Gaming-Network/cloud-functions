const { db, functions } = require("../firebase");
const { COLLECTIONS } = require("../constants");
const { isAuthenticated } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// joinTeam
exports.joinTeam = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context)) {
    return;
  }

  const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(data.teamId);
  const teamsAuthResponsesQuery = db
    .collection(COLLECTIONS.TEAMS_AUTH)
    .where("team.ref", "==", teamDocRef)
    .where("password", "==", data.password);

    let teamAuth;
    let team;
    let user;

  try {
    const snapshot = await teamsAuthResponsesQuery.get();

    if (snapshot.empty) {
        return { error: { password: "Invalid password" } };
    } else {
        teamAuth = snapshot[0].data();
    }
  } catch (error) {
      return { error };
  }

  try {
    const record = await db.collection(COLLECTIONS.TEAMS).doc(teamAuth.team.id).get();
    
    if (!record.exists) {
        return { error: { user: "Invalid team" } };
    } else {
      team = record.data();
    }
} catch (error) {
    return { error };
}

  try {
      const record = await db.collection(COLLECTIONS.USERS).doc(context.auth.uid).get();
      
      if (!record.exists) {
          return { error: { user: "Invalid user" } };
      } else {
        user = record.data();
      }
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
