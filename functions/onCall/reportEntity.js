const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

////////////////////////////////////////////////////////////////////////////////
// reportEntity
exports.reportEntity = functions.https.onCall(async (data, context) => {
  if (!Boolean(context.auth.uid)) {
    return;
  }

  const reportData = {
    reportingUser: {
      ref: db.collection("users").doc(context.auth.uid),
      id: context.auth.uid,
    },
    reason: data.reason,
    metadata: data.metadata,
    entity: data.entity,
    reportedEntity: null,
    error: {
      message: null,
      trace: null,
    },
    status: "new",
  };

  let reportedEntityDoc;

  try {
    reportedEntityDoc = await db
      .collection(data.entity.type)
      .doc(data.entity.id)
      .get();
  } catch (error) {
    reportData.error.message = "Error getting entity.";
    reportData.error.trace = error;
  }

  if (reportedEntityDoc.exists) {
    reportData.reportedEntity = {
      ref: reportedEntityDoc.ref,
      ...reportedEntityDoc.data(),
    };
  } else {
    reportData.error.message = "Entity does not exist.";
  }

  try {
    await db.collection("reports").add(reportData);
  } catch (error) {
    return error;
  }

  return;
});
