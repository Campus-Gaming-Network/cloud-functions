import { db, functions } from "../firebase";
import { COLLECTIONS } from "../constants";
import { comparePasswords } from "../utils";

////////////////////////////////////////////////////////////////////////////////
// joinTeam
exports.joinTeam = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    return { error: { message: "Invalid request" } };
  }

  if (!context.auth || !context.auth.uid) {
    return { error: { message: "Not authorized" } };
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
    const teamsAuthSnapshot = await db
      .collection(COLLECTIONS.TEAMS_AUTH)
      .where("team.ref", "==", teamDocRef)
      .limit(1)
      .get();

    if (teamsAuthSnapshot.empty) {
      return { error: { message: "Invalid team" } };
    }

    const doc = teamsAuthSnapshot.docs[0];

    teamAuth = doc.data();
  } catch (error) {
    return { error };
  }

  if (Boolean(teamAuth)) {
    const isValidPassword = await comparePasswords(data.password, teamAuth.joinHash);

    if (!isValidPassword) {
      return { error: { message: "Invalid password" } };
    }
  }

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

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);

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
    const teammatesSnapshot = await db
      .collection(COLLECTIONS.TEAMMATES)
      .where("user.ref", "==", userDocRef)
      .where("team.ref", "==", teamDocRef)
      .get();

    if (!teammatesSnapshot.empty) {
      return { error: { message: "Already joined team" } };
    }
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
      id: team.id,
      ref: teamDocRef,
      name: team.name,
      shortName: team.shortName,
    },
  };

  try {
    await db.collection(COLLECTIONS.TEAMMATES).add(teammateData);
  } catch (error) {
    return { error };
  }

  return { teamId: team.id };
});
