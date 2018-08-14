import * as functions from "firebase-functions";
import { Profile } from "./profile";

export const createProfileFunc = functions.https.onCall(
  (data: { username: string }, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    // return profile asynchronously after it has been created
    return Profile.create(data.username, context.auth.uid)
      .then(profile => {
        console.log("createProfile", profile);
        return profile;
      })
      .catch(e => {
        console.log("create profile failed", e);
        throw new functions.https.HttpsError(
          "internal",
          "create profile failed"
        );
      });
  }
);
