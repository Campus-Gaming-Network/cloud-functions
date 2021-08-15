const { db, functions } = require("../firebase");
const { COLLECTIONS } = require("../constants");
const { isAuthenticated, hashPassword } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// createTeam
exports.createTeam = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context) || !data) {
    return { error: { message: "Invalid request" } };
  }

  if (!data.name || !data.name.trim()) {
    return { error: { message: "Team name required" } };
  }

  if (!data.password || !data.password.trim()) {
    return { error: { message: "Team password required" } };
  }

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);

  let user;

  try {
    const userRecord = await userDocRef.get();

    if (!userRecord.exists) {
      return { error: { message: "Invalid user" } };
    }

    user = userRecord.data();
  } catch (error) {
    return { error };
  }

  const shortName = data.shortName ? data.shortName.trim() : data.shortName;
  const description = data.description ? data.description.trim() : data.description;
  const website = data.website ? data.website.trim() : data.website;

  const teamData = {
    name: data.name.trim(),
    shortName,
    description,
    website,
    roles: {
      leader: {
        id: user.id,
        ref: userDocRef,
      },
    },
    memberCount: 0,
  };

  let teamDocRef;

  try {
    teamDocRef = await db.collection(COLLECTIONS.TEAMS).add(teamData);
  } catch (error) {
    return { error };
  }

  try {
    await teamDocRef.set({ id: teamDocRef.id }, { merge: true });
  } catch (error) {
    return { error };
  }

  const teammateData = {
    user: {
      id: user.id,
      ref: userDocRef,
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
      id: teamDocRef.id,
      ref: teamDocRef,
      name: teamData.name,
      shortName: teamData.shortName,
    },
  };

  try {
    await db.collection(COLLECTIONS.TEAMMATES).add(teammateData);
  } catch (error) {
    return { error };
  }

  const joinHash = await hashPassword(data.password.trim());

  const teamsAuthData = {
    team: {
      id: teamDocRef.id,
      ref: teamDocRef,
    },
    joinHash: joinHash,
  };

  try {
    await db.collection(COLLECTIONS.TEAMS_AUTH).add(teamsAuthData);
  } catch (error) {
    return { error };
  }

  return { teamId: teamDocRef.id };
});
