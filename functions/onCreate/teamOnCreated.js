const { db, functions, admin } = require("../firebase");
const { COLLECTIONS, DOCUMENT_PATHS } = require("../constants");
const { nanoid, isAuthenticated } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// teamOnCreated
exports.teamOnCreated = functions.firestore
  .document(DOCUMENT_PATHS.TEAM)
  .onCreate(async (snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Create auth config for teams so that the leader of the team can update the 
    // team join password. The password is used for inviting people to join the team
    // so people cant join any team.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
        const teamData = snapshot.data();
        const userRef = db.collection(COLLECTIONS.USERS).doc(teamData.creator.id);
        const teamRef = db.collection(COLLECTIONS.TEAMS).doc(context.params.teamId);
        const teamsAuthData = {
            leader: {
                id: teamData.creator.id,
                ref: userRef,
            },
            team: {
                id: context.params.teamId,
                ref: teamRef,
            },
            password: nanoid(),
        };

        try {
            await db.collection(COLLECTIONS.TEAMS_AUTH).add(teamsAuthData);  
        } catch (error) {
            return { error };
        }

        try {
            await teamRef.update({
                creator: admin.firestore.FieldValue.delete(),
            });            
        } catch (error) {
            return { error };
        }
    }

    return;
  });
