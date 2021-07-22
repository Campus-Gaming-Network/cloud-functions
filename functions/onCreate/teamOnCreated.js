const { db, functions } = require("../firebase");
const { COLLECTIONS, DOCUMENT_PATHS } = require("../constants");
const { nanoid } = require("../utils");

////////////////////////////////////////////////////////////////////////////////
// teamOnCreated
exports.teamOnCreated = functions.firestore
  .document(DOCUMENT_PATHS.TEAM)
  .onCreate((snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Create auth config for teams so that the leader of the team can update the 
    // team join password. The password is used for inviting people to join the team
    // so people cant join any team.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
        const teamData = snapshot.data();
        const teamRef = db.collection(COLLECTIONS.TEAMS).doc(context.params.teamId);
        const teamAuthData = {
            leader: {
                id: teamData.creator.id,
                ref: teamData.creator.ref,
            },
            team: {
                id: teamRef.id,
                ref: teamRef,   
            },
            password: nanoid(),
        };

        db.collection(COLLECTIONS.TEAMS_AUTH).add(teamAuthData).catch((err) => {
            console.log(err);
            return false;
        });
    }

    return null;
  });
