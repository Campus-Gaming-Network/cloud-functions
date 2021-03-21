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
// updateAlgoliaIndex
exports.updateAlgoliaIndex = functions.firestore
  .document("schools/{schoolId}")
  .onUpdate((change) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Updates the school in Algolia whenever the school gets updated in firestore.
    //
    // A school can be updated manually by admins or via the edit school page by school admins.
    //
    ////////////////////////////////////////////////////////////////////////////////
    const { createdAt, updatedAt, ...newData } = change.after.data();
    const objectID = change.after.id;

    return algoliaAdminIndex.saveObject({ ...newData, objectID });
  });
