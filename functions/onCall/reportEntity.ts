import { db, functions } from "../firebase";
import { COLLECTIONS, FUNCTIONS_ERROR_CODES } from "../constants";

////////////////////////////////////////////////////////////////////////////////
// reportEntity
exports.reportEntity = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.INVALID_ARGUMENT, 'Invalid request');
  }

  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, 'Not authorized');
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
    status: "new",
  };

  let reportedEntityDoc;

  try {
    reportedEntityDoc = await db
      .collection(data.entity.type)
      .doc(data.entity.id)
      .get();
    } catch (error: any) {
      throw new functions.https.HttpsError(error.code, error.message);
    }

  if (reportedEntityDoc && reportedEntityDoc.exists) {
    reportData.reportedEntity = {
      ...reportedEntityDoc.data(),
      ref: reportedEntityDoc.ref,
    };
  }

  try {
    await db.collection(COLLECTIONS.REPORTS).add(reportData);
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  return;
});
