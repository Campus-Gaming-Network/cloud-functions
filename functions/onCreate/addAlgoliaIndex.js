const { functions } = require("../firebase");
const { algoliaAdminIndex } = require("../algolia");

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
