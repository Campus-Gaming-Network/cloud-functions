const { functions } = require("../firebase");
const { algoliaSearchIndex } = require("../algolia");

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
