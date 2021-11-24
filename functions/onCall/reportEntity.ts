import { db, functions } from "../firebase";
import { COLLECTIONS } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// reportEntity
exports.reportEntity = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    return { error: { message: "Invalid request" } };
  }

  if (!context.auth || !context.auth.uid) {
    return { error: { message: "Not authorized" } };
  }

  const reportData = {
    reportingUser: {
      ref: db.collection(COLLECTIONS.USERS).doc(context.auth.uid),
      id: context.auth.uid,
    },
    reason: data.reason,
    metadata: data.metadata,
    entity: data.entity,
    reportedEntity: {},
    error: {
      message: "",
      trace: {},
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
    reportData.error.trace = error as FirestoreError;
  }

  if (reportedEntityDoc && reportedEntityDoc.exists) {
    reportData.reportedEntity = {
      ...reportedEntityDoc.data(),
      ref: reportedEntityDoc.ref,
    };
  } else {
    reportData.error.message = "Entity does not exist.";
  }

  try {
    await db.collection(COLLECTIONS.REPORTS).add(reportData);
  } catch (error) {
    return error;
  }

  return;
});
