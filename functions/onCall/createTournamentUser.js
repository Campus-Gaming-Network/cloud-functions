const { db, functions } = require("../firebase");
const { COLLECTIONS, CHALLONGE_API_KEY, TEAM_ROLES } = require("../constants");
const { isAuthenticated } = require("../utils");

const PARTICIPANT_TYPES = [
    "user",
    "team",
];

////////////////////////////////////////////////////////////////////////////////
// createTournamentParticipant
exports.createTournamentParticipant = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context) || !data || !hasVerifiedEmail(context)) {
    return { error: { message: "Invalid request" } };
  }

  if (!data.tournamentId || !data.tournamentId.trim()) {
    return { error: { message: "Tournament id required" } };
  }

  if (!data.participantType || !data.participantType.trim()) {
    return { error: { message: "Participant type is required." } };
  }

  if (!PARTICIPANT_TYPES.includes(data.participantType)) {
    return { error: { message: "Invalid participant type." } };
  }


  let user;

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

  try {
    const tournamentUsersSnapshot = await db
      .collection(COLLECTIONS.TOURNAMENT_USER)
      .where("user.ref", "==", userDocRef)
      .where("tournament.ref", "==", tournamentDocRef)
      .get();

    if (!tournamentUsersSnapshot.empty) {
      return { error: { message: "Already joined tournament" } };
    }
  } catch (error) {
    return { error };
  }

  let challongeResponse;

  const participantName = data.participantType === "team"
    ? team.name
    : Boolean(data.username) && Boolean(data.username.trim())
    ? data.username
    : `${user.firstName} ${user.lastName}`;
  const participantEmail = data.participantType === "user"
    ? context.auth.token.email
    : null;

  try {
    challongeResponse = await rp({
      method: "POST",
      uri: `https://api.challonge.com/v1/tournaments/${data.tournamentId}/participants.json`,
      json: true,
      body: {
        api_key: CHALLONGE_API_KEY,
        // Allow them to enter a username if entering as user not team
        "participant[name]": participantName,
        "participant[challonge_username]": "",
        "participant[email]": participantEmail,
        "participant[seed]": "",
        "participant[misc]": "",
      },
    });
  } catch (error) {
    return {
      success: false,
      error,
    };
}

if (challongeResponse.errors) {
    return {
        success: false,
        errors,
    };
}

let tournamentUserDocRef;

try {
  tournamentUserDocRef = await db.collection(COLLECTIONS.TOURNAMENT_USER).add({
      challonge: {
          id: challongeResponse.tournament.id,
          url: challongeResponse.tournament.url,
          fullUrl: challongeResponse.tournament.full_challonge_url,
      },
      name: data.name,
      description: data.description,
  });
} catch (error) {
  return { error };
}

try {
  await tournamentUserDocRef.set({ id: tournamentUserDocRef.id }, { merge: true });
} catch (error) {
  return { error };
}
   
  return { tournamentId: null };
});
