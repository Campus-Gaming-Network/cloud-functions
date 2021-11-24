import * as admin from 'firebase-admin';

try {
  admin.initializeApp();
} catch (error) {
  // Do nothing
}

////////////////////////////////////////////////////////////////////////////////
// onCall
import { searchGames } from "./onCall/searchGames";
import { searchSchools } from "./onCall/searchSchools";
import { searchUsers } from "./onCall/searchUsers";
import { reportEntity } from "./onCall/reportEntity";
import { createTeam } from "./onCall/createTeam";
import { editTeam } from "./onCall/editTeam";
import { joinTeam } from "./onCall/joinTeam";
import { leaveTeam } from "./onCall/leaveTeam";
import { promoteTeammate } from "./onCall/promoteTeammate";
import { demoteTeammate } from "./onCall/demoteTeammate";
import { kickTeammate } from "./onCall/kickTeammate";
import { createTournament } from "./onCall/createTournament";

////////////////////////////////////////////////////////////////////////////////
// onWrite
import { trackCreatedUpdated } from "./onWrite/trackCreatedUpdated";

////////////////////////////////////////////////////////////////////////////////
// onUpdate
import { updateAlgoliaIndex } from "./onUpdate/updateAlgoliaIndex";
import { updateEventResponsesOnEventUpdate } from "./onUpdate/updateEventResponsesOnEventUpdate";
import { updateEventResponsesOnSchoolUpdate } from "./onUpdate/updateEventResponsesOnSchoolUpdate";
import { updateEventResponsesOnUserUpdate } from "./onUpdate/updateEventResponsesOnUserUpdate";
import { updateTeammatesOnUserUpdate } from "./onUpdate/updateTeammatesOnUserUpdate";
import { updateTeammatesOnTeamUpdate } from "./onUpdate/updateTeammatesOnTeamUpdate";
import { eventResponsesOnUpdated } from "./onUpdate/eventResponsesOnUpdated";
import { updateSchoolUserCountOnUserUpdate } from "./onUpdate/updateSchoolUserCountOnUserUpdate";

////////////////////////////////////////////////////////////////////////////////
// onCreate
import { addAlgoliaIndex } from "./onCreate/addAlgoliaIndex";
import { eventResponsesOnCreated } from "./onCreate/eventResponsesOnCreated";
import { userOnCreated } from "./onCreate/userOnCreated";
import { authUserOnCreated } from "./onCreate/authUserOnCreated";
import { teammateOnCreated } from "./onCreate/teammateOnCreated";

////////////////////////////////////////////////////////////////////////////////
// onDelete
import { removeAlgoliaIndex } from "./onDelete/removeAlgoliaIndex";
import { eventOnDelete } from "./onDelete/eventOnDelete";
import { userOnDelete } from "./onDelete/userOnDelete";
import { eventResponsesOnDelete } from "./onDelete/eventResponsesOnDelete";
import { teamOnDelete } from './onDelete/teamOnDelete';
import { teammateOnDelete } from "./onDelete/teammateOnDelete";

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
