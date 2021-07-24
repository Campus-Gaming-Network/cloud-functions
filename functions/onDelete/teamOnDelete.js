const { db, functions } = require("../firebase");
const { COLLECTIONS } = require("../constants");

////////////////////////////////////////////////////////////////////////////////
// teamOnDelete
exports.teamOnDelete = functions.firestore
  .document("teams/{teamId}")
  .onDelete(async (snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a user deletes a team, find all the team-auths tied to the team and
    // delete those too.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const teamDocRef = db.collection(COLLECTIONS.TEAMS).doc(context.params.teamId);
    const teamsAuthResponsesQuery = db
      .collection(COLLECTIONS.TEAMS_AUTH)
      .where("team.ref", "==", teamDocRef);
    const teammatesResponsesQuery = db
      .collection(COLLECTIONS.TEAMMATES)
      .where("team.ref", "==", teamDocRef);

    const teamsAuthSnapshot = await teamsAuthResponsesQuery.get();
    const teammatesSnapshot = await teammatesResponsesQuery.get();

    if (teamsAuthSnapshot && !teamsAuthSnapshot.empty) {
        let batch = db.batch();

        teamsAuthSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        batch.commit();
    }

    if (teammatesSnapshot && !teammatesSnapshot.empty) {
        let batch = db.batch();

        teammatesSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        batch.commit();
    }
  });
