import * as admin from "firebase-admin";

try {
  admin.initializeApp();
} catch (error) {
  // Do nothing
}

////////////////////////////////////////////////////////////////////////////////
// onCall
import * as searchGames from "./onCall/searchGames";
import * as searchSchools from "./onCall/searchSchools";
import * as searchUsers from "./onCall/searchUsers";
import * as reportEntity from "./onCall/reportEntity";
import * as createTeam from "./onCall/createTeam";
import * as editTeam from "./onCall/editTeam";
import * as joinTeam from "./onCall/joinTeam";
import * as leaveTeam from "./onCall/leaveTeam";
import * as promoteTeammate from "./onCall/promoteTeammate";
import * as demoteTeammate from "./onCall/demoteTeammate";
import * as kickTeammate from "./onCall/kickTeammate";
import * as createTournament from "./onCall/createTournament";

////////////////////////////////////////////////////////////////////////////////
// onWrite
import * as trackCreatedUpdated from "./onWrite/trackCreatedUpdated";

////////////////////////////////////////////////////////////////////////////////
// onUpdate
import * as updateAlgoliaIndex from "./onUpdate/updateAlgoliaIndex";
import * as updateEventResponsesOnEventUpdate from "./onUpdate/updateEventResponsesOnEventUpdate";
import * as updateEventResponsesOnSchoolUpdate from "./onUpdate/updateEventResponsesOnSchoolUpdate";
import * as updateEventResponsesOnUserUpdate from "./onUpdate/updateEventResponsesOnUserUpdate";
import * as updateTeammatesOnUserUpdate from "./onUpdate/updateTeammatesOnUserUpdate";
import * as updateTeammatesOnTeamUpdate from "./onUpdate/updateTeammatesOnTeamUpdate";
import * as eventResponsesOnUpdated from "./onUpdate/eventResponsesOnUpdated";
import * as updateSchoolUserCountOnUserUpdate from "./onUpdate/updateSchoolUserCountOnUserUpdate";

////////////////////////////////////////////////////////////////////////////////
// onCreate
import * as addAlgoliaIndex from "./onCreate/addAlgoliaIndex";
import * as eventResponsesOnCreated from "./onCreate/eventResponsesOnCreated";
import * as userOnCreated from "./onCreate/userOnCreated";
import * as authUserOnCreated from "./onCreate/authUserOnCreated";
import * as teammateOnCreated from "./onCreate/teammateOnCreated";

////////////////////////////////////////////////////////////////////////////////
// onDelete
import * as removeAlgoliaIndex from "./onDelete/removeAlgoliaIndex";
import * as eventOnDelete from "./onDelete/eventOnDelete";
import * as userOnDelete from "./onDelete/userOnDelete";
import * as eventResponsesOnDelete from "./onDelete/eventResponsesOnDelete";
import * as teamOnDelete from "./onDelete/teamOnDelete";
import * as teammateOnDelete from "./onDelete/teammateOnDelete";

exports.searchGames = searchGames;
exports.searchSchools = searchSchools;
exports.searchUsers = searchUsers;
exports.reportEntity = reportEntity;
exports.createTeam = createTeam;
exports.editTeam = editTeam;
exports.joinTeam = joinTeam;
exports.leaveTeam = leaveTeam;
exports.promoteTeammate = promoteTeammate;
exports.demoteTeammate = demoteTeammate;
exports.kickTeammate = kickTeammate;
exports.createTournament = createTournament;
exports.trackCreatedUpdated = trackCreatedUpdated;
exports.updateAlgoliaIndex = updateAlgoliaIndex;
exports.updateEventResponsesOnEventUpdate = updateEventResponsesOnEventUpdate;
exports.updateEventResponsesOnSchoolUpdate = updateEventResponsesOnSchoolUpdate;
exports.updateEventResponsesOnUserUpdate = updateEventResponsesOnUserUpdate;
exports.updateTeammatesOnUserUpdate = updateTeammatesOnUserUpdate;
exports.updateTeammatesOnTeamUpdate = updateTeammatesOnTeamUpdate;
exports.eventResponsesOnUpdated = eventResponsesOnUpdated;
exports.updateSchoolUserCountOnUserUpdate = updateSchoolUserCountOnUserUpdate;
exports.addAlgoliaIndex = addAlgoliaIndex;
exports.eventResponsesOnCreated = eventResponsesOnCreated;
exports.userOnCreated = userOnCreated;
exports.authUserOnCreated = authUserOnCreated;
exports.teammateOnCreated = teammateOnCreated;
exports.teammateOnDelete = teammateOnDelete;
exports.removeAlgoliaIndex = removeAlgoliaIndex;
exports.eventOnDelete = eventOnDelete;
exports.userOnDelete = userOnDelete;
exports.eventResponsesOnDelete = eventResponsesOnDelete;
exports.teamOnDelete = teamOnDelete;
