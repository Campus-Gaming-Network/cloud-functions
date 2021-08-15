const { functions } = require("./firebase");

const PRODUCTION_GCLOUD_PROJECT = "campusgamingnetwork-b2128";

// Firestore
const COLLECTIONS = {
    SCHOOLS: "schools",
    USERS: "users",
    EVENTS: "events",
    EVENT_RESPONSES: "event-responses",
    GAME_QUERIES: "game-queries",
    CONFIGS: "configs",
    REPORTS: "reports",
    TEAMS: "teams",
    TEAMS_AUTH: "teams-auth",
    TEAMMATES: "teammates",
};
const DOCUMENT_PATHS = {
    USER: "users/{userId}",
    SCHOOL: "schools/{schoolId}",
    EVENT_RESPONSES: "event-responses/{eventResponseId}",
    TEAM: "teams/{teamId}",
    TEAMMATES: "teammates/{teammatesId}",
};

// Algolia
const ALGOLIA_ID = functions.config().algolia.app;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search;
const ALGOLIA_SCHOOLS_COLLECTION = process.env.GCLOUD_PROJECT === PRODUCTION_GCLOUD_PROJECT ? "prod_SCHOOLS" : "test_SCHOOLS";

// IGDB
const IGDB_CLIENT_ID = functions.config().igdb.client_id;
const IGDB_CLIENT_SECRET = functions.config().igdb.client_secret;
const IGDB_GRANT_TYPE = "client_credentials";

// Discord
const DISCORD_WEBHOOK_URL = functions.config().discord.webhook_url;

// Nanoid
const NANO_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const NANO_ID_LENGTH = 10;

// Bcrypt
const SALT_ROUNDS = 10;

module.exports = {
    COLLECTIONS,
    DOCUMENT_PATHS,
    ALGOLIA_ID,
    ALGOLIA_ADMIN_KEY,
    ALGOLIA_SEARCH_KEY,
    ALGOLIA_SCHOOLS_COLLECTION,
    IGDB_CLIENT_ID,
    IGDB_CLIENT_SECRET,
    IGDB_GRANT_TYPE,
    DISCORD_WEBHOOK_URL,
    NANO_ALPHABET,
    NANO_ID_LENGTH,
    SALT_ROUNDS,
};
