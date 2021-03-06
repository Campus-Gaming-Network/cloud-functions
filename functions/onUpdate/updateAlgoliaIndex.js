const { functions } = require("../firebase");
const { algoliaAdminIndex } = require("../algolia");

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
