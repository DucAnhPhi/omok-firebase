import * as functions from "firebase-functions";
import { Profile } from "./profile";

export const updateProfileFunc = (firestore: any) =>
  functions.https.onCall((data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }
    Profile.update(firestore, data, context.auth.uid)
      .then(updated => updated)
      .catch(e => {
        throw new functions.https.HttpsError(
          "internal",
          "internal server error"
        );
      });
  });
