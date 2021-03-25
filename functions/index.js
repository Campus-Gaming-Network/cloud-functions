const admin = require("firebase-admin");

try {
  admin.initializeApp();
} catch (error) {
  // Do nothing
}

////////////////////////////////////////////////////////////////////////////////
// onCall
const searchGames = require("./onCall/searchGames");
const searchSchools = require("./onCall/searchSchools");
const searchUsers = require("./onCall/searchUsers");
const reportEntity = require("./onCall/reportEntity");

////////////////////////////////////////////////////////////////////////////////
// onWrite
const trackCreatedUpdated = require("./onWrite/trackCreatedUpdated");

////////////////////////////////////////////////////////////////////////////////
// onUpdate
const updateAlgoliaIndex = require("./onUpdate/updateAlgoliaIndex");
const updateEventResponsesOnEventUpdate = require("./onUpdate/updateEventResponsesOnEventUpdate");
const updateEventResponsesOnSchoolUpdate = require("./onUpdate/updateEventResponsesOnSchoolUpdate");
const updateEventResponsesOnUserUpdate = require("./onUpdate/updateEventResponsesOnUserUpdate");
const eventResponsesOnUpdated = require("./onUpdate/eventResponsesOnUpdated");

////////////////////////////////////////////////////////////////////////////////
// onCreate
const addAlgoliaIndex = require("./onCreate/addAlgoliaIndex");
const eventResponsesOnCreated = require("./onCreate/eventResponsesOnCreated");

////////////////////////////////////////////////////////////////////////////////
// onDelete
const removeAlgoliaIndex = require("./onDelete/removeAlgoliaIndex");
const eventOnDelete = require("./onDelete/eventOnDelete");
const userOnDelete = require("./onDelete/userOnDelete");
const eventResponsesOnDelete = require("./onDelete/eventResponsesOnDelete");

exports.searchGames = searchGames.searchGames;
exports.searchSchools = searchSchools.searchSchools;
exports.searchUsers = searchUsers.searchUsers;
exports.reportEntity = reportEntity.reportEntity;
exports.trackCreatedUpdated = trackCreatedUpdated.trackCreatedUpdated;
exports.updateAlgoliaIndex = updateAlgoliaIndex.updateAlgoliaIndex;
exports.updateEventResponsesOnEventUpdate =
  updateEventResponsesOnEventUpdate.updateEventResponsesOnEventUpdate;
exports.updateEventResponsesOnSchoolUpdate =
  updateEventResponsesOnSchoolUpdate.updateEventResponsesOnSchoolUpdate;
exports.updateEventResponsesOnUserUpdate =
  updateEventResponsesOnUserUpdate.updateEventResponsesOnUserUpdate;
exports.eventResponsesOnUpdated =
  eventResponsesOnUpdated.eventResponsesOnUpdated;
exports.addAlgoliaIndex = addAlgoliaIndex.addAlgoliaIndex;
exports.eventResponsesOnCreated =
  eventResponsesOnCreated.eventResponsesOnCreated;
exports.removeAlgoliaIndex = removeAlgoliaIndex.removeAlgoliaIndex;
exports.eventOnDelete = eventOnDelete.eventOnDelete;
exports.userOnDelete = userOnDelete.userOnDelete;
exports.eventResponsesOnDelete = eventResponsesOnDelete.eventResponsesOnDelete;
