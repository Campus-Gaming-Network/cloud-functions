const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const algoliasearch = require("algoliasearch");

const ALGOLIA_ID = functions.config().algolia.app;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search;
const ALGOLIA_SCHOOLS_COLLECTION = "prod_SCHOOLS";

const algoliaSearchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_SEARCH_KEY);
const algoliaSearchIndex = algoliaSearchClient.initIndex(
  ALGOLIA_SCHOOLS_COLLECTION
);

////////////////////////////////////////////////////////////////////////////////
// searchSchools
exports.searchSchools = functions.https.onCall(async (data) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Searches Algolia for schools matching search query.
  //
  // A school is added/removed/updated in Algolia whenever a document is
  // added/removed/updated in the schools collection.
  //
  //
  ////////////////////////////////////////////////////////////////////////////////

  const limit = data.limit > 100 ? 100 : data.limit < 0 ? 0 : data.limit;

  return await algoliaSearchIndex.search(data.query, {
    hitsPerPage: limit,
  });
});
