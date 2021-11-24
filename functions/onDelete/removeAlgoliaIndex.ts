import { functions } from "../firebase";
import { algoliaAdminIndex } from "../algolia";

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

    return;
  });
