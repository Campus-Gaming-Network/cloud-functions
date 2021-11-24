import { admin, functions } from "../firebase";
import { COLLECTIONS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// trackCreatedUpdated
exports.trackCreatedUpdated = functions.firestore
  .document("{colId}/{docId}")
  .onWrite(async (change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Source: https://stackoverflow.com/a/60963531
    //
    // Updates firestore documents whenever they are updated or created with the current timestamp.
    //
    // Only specific collections documents are being tracked.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const setCols = [
      COLLECTIONS.SCHOOLS,
      COLLECTIONS.USERS,
      COLLECTIONS.EVENTS,
      COLLECTIONS.EVENT_RESPONSES,
      COLLECTIONS.GAME_QUERIES,
      COLLECTIONS.CONFIGS,
      COLLECTIONS.REPORTS,
      COLLECTIONS.TEAMS,
      COLLECTIONS.TEAMS_AUTH,
    ];

    if (setCols.indexOf(context.params.colId) === -1) {
      return null;
    }

    const createDoc = change.after.exists && !change.before.exists;
    const updateDoc = change.before.exists && change.after.exists;
    const deleteDoc = change.before.exists && !change.after.exists;

    if (deleteDoc) {
      return null;
    }

    const after: any = change.after.exists ? change.after.data() : null;
    const before: any = change.before.exists ? change.before.data() : null;

    const canUpdate = () => {
      if (before.updatedAt && after.updatedAt) {
        if (after.updatedAt._seconds !== before.updatedAt._seconds) {
          return false;
        }
      }

      if (!before.createdAt && after.createdAt) {
        return false;
      }

      return true;
    };

    if (createDoc) {
      return change.after.ref
        .set(
          {
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    if (updateDoc && canUpdate()) {
      return change.after.ref
        .set(
          { updatedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });
