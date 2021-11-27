import { functions } from "./firebase";
import { FUNCTIONS_ERROR_CODES } from "./constants";

export class InvalidRequestError extends functions.https.HttpsError {
  constructor() {
    super(FUNCTIONS_ERROR_CODES.INVALID_ARGUMENT, "Invalid request");
  }
}

export class NotAuthorizedError extends functions.https.HttpsError {
  constructor() {
    super(FUNCTIONS_ERROR_CODES.PERMISSION_DENIED, "Not authorized");
  }
}

export class EmailVerificationEror extends functions.https.HttpsError {
  constructor() {
    super(
      FUNCTIONS_ERROR_CODES.PERMISSION_DENIED,
      "Email verification required"
    );
  }
}
