import { ALGOLIA_ID, ALGOLIA_SEARCH_KEY, ALGOLIA_ADMIN_KEY, ALGOLIA_SCHOOLS_COLLECTION } from "./constants";

import algoliasearch from "algoliasearch";

export const algoliaSearchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_SEARCH_KEY);
export const algoliaSearchIndex = algoliaSearchClient.initIndex(
  ALGOLIA_SCHOOLS_COLLECTION
);

export const algoliaAdminClient = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
export const algoliaAdminIndex = algoliaAdminClient.initIndex(
  ALGOLIA_SCHOOLS_COLLECTION
);

