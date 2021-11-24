import { db, functions } from "../firebase";
import { COLLECTIONS, CHALLONGE_API_KEY, FUNCTIONS_ERROR_CODES } from "../constants";

const PARTICIPANT_TYPES = [
    "user",
    "team",
];

////////////////////////////////////////////////////////////////////////////////
// createTournamentParticipant
exports.createTournamentParticipant = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.INVALID_ARGUMENT, 'Invalid request');
  }

  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
  }

  if (!context.auth.token || !context.auth.token.email_verified) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Email verification required');
  }

  if (!data.tournamentId || !data.tournamentId.trim()) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'Tournament id required');
  }

  if (!data.participantType || !data.participantType.trim()) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'Participant type is required');
  }

  if (!PARTICIPANT_TYPES.includes(data.participantType)) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.FAILED_PRECONDITION, 'Invalid participant type');
  }

  let user;

  const userDocRef = db.collection(COLLECTIONS.USERS).doc(context.auth.uid);

  try {
    const record = await userDocRef.get();

    if (record.exists) {
      user = record.data();
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (!user) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.INVALID_ARGUMENT, 'Invalid user');
  }

  try {
    const tournamentUsersSnapshot = await db
      .collection(COLLECTIONS.TOURNAMENT_USER)
      .where("user.ref", "==", userDocRef)
      .where("tournament.ref", "==", tournamentDocRef)
      .get();

    if (!tournamentUsersSnapshot.empty) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.ALREADY_EXISTS, 'Already joined tournament');
    }
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
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
} catch (error: any) {
  throw new functions.https.HttpsError(error.code, error.message);
}

try {
  await tournamentUserDocRef.set({ id: tournamentUserDocRef.id }, { merge: true });
} catch (error: any) {
  throw new functions.https.HttpsError(error.code, error.message);
}
   
  return { tournamentId: null };
});
