const { functions } = require("./firebase");

// Firestore
const COLLECTIONS = {
    SCHOOLS: "schools",
    USERS: "users",
    EVENTS: "events",
    EVENT_RESPONSES: "event-responses",
    GAME_QUERIES: "game-queries",
    CONFIGS: "configs",
    REPORTS: "reports",
};

// ALGOLIA
const ALGOLIA_ID = functions.config().algolia.app;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search;
const ALGOLIA_SCHOOLS_COLLECTION = "prod_SCHOOLS";

// IGDB
const IGDB_CLIENT_ID = functions.config().igdb.client_id;
const IGDB_CLIENT_SECRET = functions.config().igdb.client_secret;
const IGDB_GRANT_TYPE = "client_credentials";

module.exports = {
    COLLECTIONS,
    ALGOLIA_ID,
    ALGOLIA_ADMIN_KEY,
    ALGOLIA_SEARCH_KEY,
    ALGOLIA_SCHOOLS_COLLECTION,
    IGDB_CLIENT_ID,
    IGDB_CLIENT_SECRET,
    IGDB_GRANT_TYPE,
};
