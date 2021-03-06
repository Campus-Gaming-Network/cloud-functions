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
const createTeam = require("./onCall/createTeam");
const editTeam = require("./onCall/editTeam");
const joinTeam = require("./onCall/joinTeam");
const leaveTeam = require("./onCall/leaveTeam");
const promoteTeammate = require("./onCall/promoteTeammate");
const demoteTeammate = require("./onCall/demoteTeammate");
const kickTeammate = require("./onCall/kickTeammate");
const createTournament = require("./onCall/createTournament");

////////////////////////////////////////////////////////////////////////////////
// onWrite
const trackCreatedUpdated = require("./onWrite/trackCreatedUpdated");

////////////////////////////////////////////////////////////////////////////////
// onUpdate
const updateAlgoliaIndex = require("./onUpdate/updateAlgoliaIndex");
const updateEventResponsesOnEventUpdate = require("./onUpdate/updateEventResponsesOnEventUpdate");
const updateEventResponsesOnSchoolUpdate = require("./onUpdate/updateEventResponsesOnSchoolUpdate");
const updateEventResponsesOnUserUpdate = require("./onUpdate/updateEventResponsesOnUserUpdate");
const updateTeammatesOnUserUpdate = require("./onUpdate/updateTeammatesOnUserUpdate");
const updateTeammatesOnTeamUpdate = require("./onUpdate/updateTeammatesOnTeamUpdate");
const eventResponsesOnUpdated = require("./onUpdate/eventResponsesOnUpdated");
const updateSchoolUserCountOnUserUpdate = require("./onUpdate/updateSchoolUserCountOnUserUpdate");

////////////////////////////////////////////////////////////////////////////////
// onCreate
const addAlgoliaIndex = require("./onCreate/addAlgoliaIndex");
const eventResponsesOnCreated = require("./onCreate/eventResponsesOnCreated");
const userOnCreated = require("./onCreate/userOnCreated");
const authUserOnCreated = require("./onCreate/authUserOnCreated");
const teammateOnCreated = require("./onCreate/teammateOnCreated");

////////////////////////////////////////////////////////////////////////////////
// onDelete
const removeAlgoliaIndex = require("./onDelete/removeAlgoliaIndex");
const eventOnDelete = require("./onDelete/eventOnDelete");
const userOnDelete = require("./onDelete/userOnDelete");
const eventResponsesOnDelete = require("./onDelete/eventResponsesOnDelete");
const teamOnDelete = require('./onDelete/teamOnDelete');
const teammateOnDelete = require("./onDelete/teammateOnDelete");

exports.searchGames = searchGames.searchGames;
exports.searchSchools = searchSchools.searchSchools;
exports.searchUsers = searchUsers.searchUsers;
exports.reportEntity = reportEntity.reportEntity;
exports.createTeam = createTeam.createTeam;
exports.editTeam = editTeam.editTeam;
exports.joinTeam = joinTeam.joinTeam;
exports.leaveTeam = leaveTeam.leaveTeam;
exports.promoteTeammate = promoteTeammate.promoteTeammate;
exports.demoteTeammate = demoteTeammate.demoteTeammate;
exports.kickTeammate = kickTeammate.kickTeammate;
exports.createTournament = createTournament.createTournament;
exports.trackCreatedUpdated = trackCreatedUpdated.trackCreatedUpdated;
exports.updateAlgoliaIndex = updateAlgoliaIndex.updateAlgoliaIndex;
exports.updateEventResponsesOnEventUpdate =
  updateEventResponsesOnEventUpdate.updateEventResponsesOnEventUpdate;
exports.updateEventResponsesOnSchoolUpdate =
  updateEventResponsesOnSchoolUpdate.updateEventResponsesOnSchoolUpdate;
exports.updateEventResponsesOnUserUpdate =
  updateEventResponsesOnUserUpdate.updateEventResponsesOnUserUpdate;
exports.updateTeammatesOnUserUpdate = updateTeammatesOnUserUpdate.updateTeammatesOnUserUpdate;
exports.updateTeammatesOnTeamUpdate = updateTeammatesOnTeamUpdate.updateTeammatesOnTeamUpdate;
exports.eventResponsesOnUpdated =
  eventResponsesOnUpdated.eventResponsesOnUpdated;
exports.updateSchoolUserCountOnUserUpdate = updateSchoolUserCountOnUserUpdate.updateSchoolUserCountOnUserUpdate;
exports.addAlgoliaIndex = addAlgoliaIndex.addAlgoliaIndex;
exports.eventResponsesOnCreated =
  eventResponsesOnCreated.eventResponsesOnCreated;
exports.userOnCreated = userOnCreated.userOnCreated;
exports.authUserOnCreated = authUserOnCreated.authUserOnCreated;
exports.teammateOnCreated = teammateOnCreated.teammateOnCreated;
exports.teammateOnDelete = teammateOnDelete.teammateOnDelete;
exports.removeAlgoliaIndex = removeAlgoliaIndex.removeAlgoliaIndex;
exports.eventOnDelete = eventOnDelete.eventOnDelete;
exports.userOnDelete = userOnDelete.userOnDelete;
exports.eventResponsesOnDelete = eventResponsesOnDelete.eventResponsesOnDelete;
exports.teamOnDelete = teamOnDelete.teamOnDelete;
