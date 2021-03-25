const { ALGOLIA_ID, ALGOLIA_SEARCH_KEY, ALGOLIA_ADMIN_KEY, ALGOLIA_SCHOOLS_COLLECTION } = require("./constants");

const algoliasearch = require("algoliasearch");

const algoliaSearchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_SEARCH_KEY);
const algoliaSearchIndex = algoliaSearchClient.initIndex(
  ALGOLIA_SCHOOLS_COLLECTION
);

const algoliaAdminClient = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const algoliaAdminIndex = algoliaAdminClient.initIndex(
  ALGOLIA_SCHOOLS_COLLECTION
);

module.exports = {
    algoliaSearchIndex,
    algoliaAdminIndex,
};
