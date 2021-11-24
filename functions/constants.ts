import { FunctionsErrorCode } from "firebase-functions/v1/https";
import { functions } from "./firebase";

export const PRODUCTION_GCLOUD_PROJECT: string = "campusgamingnetwork-b2128";

// Firestore
export const COLLECTIONS: { [key: string]: string } = {
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
    TOURNAMENTS: "tournaments",
    TOURNAMENT_USER: "tournament-user",
};
export const DOCUMENT_PATHS: { [key: string]: string } = {
    USER: "users/{userId}",
    SCHOOL: "schools/{schoolId}",
    EVENT_RESPONSES: "event-responses/{eventResponseId}",
    TEAM: "teams/{teamId}",
    TEAMMATES: "teammates/{teammatesId}",
    TOURNAMENTS: "tournaments/{tournamentId}",
    TOURNAMENT_USER: "tournament-user/{tournamentUserId}",
};

// Algolia
export const ALGOLIA_ID: string = functions.config().algolia.app;
export const ALGOLIA_ADMIN_KEY: string = functions.config().algolia.key;
export const ALGOLIA_SEARCH_KEY: string = functions.config().algolia.search;
export const ALGOLIA_SCHOOLS_COLLECTION: string = process.env.GCLOUD_PROJECT === PRODUCTION_GCLOUD_PROJECT ? "prod_SCHOOLS" : "test_SCHOOLS";

// IGDB
export const IGDB_CLIENT_ID: string = functions.config().igdb.client_id;
export const IGDB_CLIENT_SECRET: string = functions.config().igdb.client_secret;
export const IGDB_GRANT_TYPE: string = "client_credentials";

// Challonge
export const CHALLONGE_API_KEY: string = functions.config().challonge.api_key;

// Discord
export const DISCORD_WEBHOOK_URL: string = functions.config().discord.webhook_url;

// Nanoid
export const NANO_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const NANO_ID_LENGTH: number = 10;

// Bcrypt
export const SALT_ROUNDS: number = 10;

// Other
export const TEAM_ROLE_TYPES: { [key: string]: string } = {
    LEADER: "leader",
    OFFICER: "officer",
};
export const TEAM_ROLES: string[] = Object.values(TEAM_ROLE_TYPES);

export const FUNCTIONS_ERROR_CODES: { [key: string]: FunctionsErrorCode } = {
    OK: "ok",
    CANCELLED: "cancelled",
    UNKNOWN: "unknown",
    INVALID_ARGUMENT: "invalid-argument",
    DEADLINE_EXCEEDED: "deadline-exceeded",
    NOT_FOUND: "not-found",
    ALREADY_EXISTS: "already-exists",
    PERMISSION_DENIED: "permission-denied",
    RESOURCE_EXHAUSTED: "resource-exhausted",
    FAILED_PRECONDITION: "failed-precondition",
    ABORTED: "aborted",
    OUT_OF_RANGE: "out-of-range",
    UNIMPLEMENTED: "unimplemented",
    INTERNAL: "internal",
    UNAVAILABLE: "unavailable",
    DATA_LOSS: "data-loss",
    UNAUTHENTICATED: "unauthenticated",
};
