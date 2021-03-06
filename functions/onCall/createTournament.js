const { db, functions } = require("../firebase");
const { COLLECTIONS, CHALLONGE_API_KEY } = require("../constants");
const { isAuthenticated } = require("../utils");
////////////////////////////////////////////////////////////////////////////////
// createTournament
exports.createTournament = functions.https.onCall(async (data, context) => {
  if (!isAuthenticated(context) || !data || !hasVerifiedEmail(context)) {
    return { error: { message: "Invalid request" } };
  }

  if (!data.name || !data.name.trim()) {
    return { error: { message: "Tournament name required" } };
  }

  let challongeResponse;

  try {
    challongeResponse = await rp({
      method: "POST",
      uri: "https://api.challonge.com/v1/tournaments.json",
      json: true,
      body: {
        api_key: CHALLONGE_API_KEY,
        "tournament[name]": data.name,
        "tournament[tournament_type]": data.tournamentFormat,
        "tournament[url]": "",
        "tournament[subdomain]": "",
        "tournament[description]": data.description,
        "tournament[open_signup]": "",
        "tournament[hold_third_place_match]": data.holdThirdPlaceMatch,
        "tournament[pts_for_match_win]": data.ptsForMatchWin,
        "tournament[pts_for_match_tie]": data.ptsForMatchTie,
        "tournament[pts_for_game_win]": data.ptsForGameWin,
        "tournament[pts_for_game_tie]": data.ptsForGameTie,
        "tournament[pts_for_bye]": data.ptsForBye,
        "tournament[swiss_rounds]": "",
        "tournament[ranked_by]": data.rankedBy,
        "tournament[rr_pts_for_match_win]": data.rrPtsForMatchWin,
        "tournament[rr_pts_for_match_tie]": data.rrPtsForMatchTie,
        "tournament[rr_pts_for_game_win]": data.rrPtsForGameWin,
        "tournament[rr_pts_for_game_tie]": data.rrPtsForGameTie,
        "tournament[accept_attachments]": "",
        "tournament[hide_forum]": "",
        "tournament[show_rounds]": "",
        "tournament[private]": "",
        "tournament[notify_users_when_matches_open]": "",
        "tournament[notify_users_when_the_tournament_ends]": "",
        "tournament[sequential_pairings]": "",
        "tournament[signup_cap]": "",
        "tournament[start_at]": "",
        "tournament[check_in_duration]": "",
        "tournament[grand_finals_modifier]": "",
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

let tournamentDocRef;

try {
  tournamentDocRef = await db.collection(COLLECTIONS.TOURNAMENTS).add({
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
  await tournamentDocRef.set({ id: tournamentDocRef.id }, { merge: true });
} catch (error) {
  return { error };
}
   
  return { tournamentId: null };
});
