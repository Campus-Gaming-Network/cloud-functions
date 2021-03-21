const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const rp = require("request-promise");
const { DateTime } = require("luxon");

const IGDB_CLIENT_ID = functions.config().igdb.client_id;
const IGDB_CLIENT_SECRET = functions.config().igdb.client_secret;
const IGDB_GRANT_TYPE = "client_credentials";

////////////////////////////////////////////////////////////////////////////////
// searchGames
exports.searchGames = functions.https.onCall(async (data) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Searches IGDB for games matching search query.
  //
  // Returns a list of matching games, limited to 10, containing the fields: name, cover url, slug.
  //
  // The data returned for each query isn't that important and probably doesn't change often
  // so it isn't a priorty that we always return fresh data, so we store each query and
  // their results in a firestore collection "game-queries" and track how many times
  // the specific query has been made.
  //
  // If the query has been made previously, we grab the results from the stored document
  // instead of querying IGDB to save on API requests. (hopefully this is more cost effective).
  //
  // Later on we should make a change that checks the last time the document has been updated and
  // if its been longer than a certain time period (maybe 1-2 months?), we should update the query
  // results so it stays just slightly relevant.
  //
  // By counting how many times a query is made, we can eventually optimize for the top N queries and
  // their results.
  //
  // TODO: Rewrite with new IGDB api process involved
  //
  ////////////////////////////////////////////////////////////////////////////////

  if (!IGDB_CLIENT_ID) {
    return { success: false, error: "Missing client id" };
  }

  if (!IGDB_CLIENT_SECRET) {
    return { success: false, error: "Missing client secret" };
  }

  if (!IGDB_GRANT_TYPE) {
    return { success: false, error: "Missing grant type" };
  }

  const configsQueryRef = db.collection("configs").doc("igdb");
  const gameQueryRef = db.collection("game-queries").doc(data.query);

  let tokenStatus = "READY";
  let accessToken;
  let expireDateTime;
  let authResponse;
  let gameQueryDoc;
  let igdbConfigDoc;
  let igdbResponse;

  // See if we've made this same query before
  try {
    gameQueryDoc = await gameQueryRef.get();
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }

  // Return what we have stored if weve made the query before
  if (gameQueryDoc.exists) {
    // But first, update the query account
    try {
      await gameQueryRef.set(
        { queries: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      games: gameQueryDoc.data().games,
      query: data.query,
    };
  }

  // Check if we have a token already stored
  try {
    igdbConfigDoc = await configsQueryRef.get();
  } catch (error) {
    tokenStatus = "ERROR";
    console.log(error);
    return {
      success: false,
      error,
    };
  }

  if (igdbConfigDoc.exists) {
    accessToken = igdbConfigDoc.data().accessToken;
    expireDateTime = igdbConfigDoc.data().expireDateTime;
  } else {
    tokenStatus = "NOT_EXISTS";
  }

  // Check if the stored token is expired
  if (tokenStatus === "READY") {
    const today = DateTime.local();
    const expiration = DateTime.fromISO(expireDateTime.toDate().toISOString());
    const { days } = expiration.diff(today, "days").toObject();
    const DAYS_WITHIN_EXPIRATION = 14;
    if (Math.floor(days) <= DAYS_WITHIN_EXPIRATION) {
      tokenStatus = "EXPIRED";
    }
  }

  // Get a new token if its expired or does not exist
  if (tokenStatus !== "READY") {
    try {
      authResponse = await rp({
        method: "POST",
        uri: "https://id.twitch.tv/oauth2/token",
        json: true,
        body: {
          client_id: IGDB_CLIENT_ID,
          client_secret: IGDB_CLIENT_SECRET,
          grant_type: IGDB_GRANT_TYPE,
        },
      });
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }

    if (authResponse) {
      accessToken = authResponse.access_token;

      try {
        await db
          .collection("configs")
          .doc("igdb")
          .set(
            {
              accessToken: authResponse.access_token,
              expiresIn: authResponse.expires_in,
              tokenType: authResponse.token_type,
              expireDateTime: admin.firestore.Timestamp.fromDate(
                new Date(
                  DateTime.local().plus({ seconds: authResponse.expires_in })
                )
              ),
            },
            { merge: true }
          );
      } catch (error) {
        console.log(error);
        return {
          success: false,
          error,
        };
      }
    }
  }

  if (!accessToken) {
    return { success: false, error: "Missing access token" };
  }

  try {
    igdbResponse = await rp({
      url: "https://api.igdb.com/v4/games",
      method: "POST",
      headers: {
        "Client-ID": IGDB_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: `fields name, cover.url, slug; search "${data.query}"; limit 10;`,
      transform: JSON.parse,
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }

  if (igdbResponse) {
    if (igdbResponse.length > 0) {
      try {
        await db
          .collection("game-queries")
          .doc(data.query)
          .set(
            {
              games: igdbResponse || [],
              queries: admin.firestore.FieldValue.increment(1),
            },
            { merge: true }
          );
      } catch (error) {
        console.log(error);
        return {
          success: false,
          error,
        };
      }
    }

    return {
      success: true,
      games: igdbResponse || [],
      query: data.query,
    };
  }

  return { success: false };
});
