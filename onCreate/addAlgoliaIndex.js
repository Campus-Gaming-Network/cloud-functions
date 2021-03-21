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
// addAlgoliaIndex
exports.addAlgoliaIndex = functions.firestore
  .document("schools/{schoolId}")
  .onCreate((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Adds school to the Algolia collection whenever a school document is added to the
    // schools collection so we can query for it.
    //
    // Schools dont get added often, except for when we initially upload all the schools.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const { createdAt, updatedAt, ...data } = snapshot.data();
      const objectID = snapshot.id;

      return algoliaAdminIndex.saveObject({ ...data, objectID });
    }
  });
