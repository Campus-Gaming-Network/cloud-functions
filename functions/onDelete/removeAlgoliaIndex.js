const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const algoliasearch = require("algoliasearch");

const ALGOLIA_ID = functions.config().algolia.app;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.key;
const ALGOLIA_SCHOOLS_COLLECTION = "prod_SCHOOLS";

const algoliaAdminClient = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const algoliaAdminIndex = algoliaAdminClient.initIndex(
  ALGOLIA_SCHOOLS_COLLECTION
);

////////////////////////////////////////////////////////////////////////////////
// removeAlgoliaIndex
exports.removeAlgoliaIndex = functions.firestore
  .document("schools/{schoolId}")
  .onDelete((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a school document is deleted, remove the document from Algolia so that it can no
    // longer be queried.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      return algoliaAdminIndex.deleteObject(snapshot.id);
    }
  });
