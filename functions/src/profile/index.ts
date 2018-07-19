import * as functions from "firebase-functions";
import { Profile } from "./profile";
import Logger from "../logger";

export const createProfileFunc = (firestore: any) =>
  functions.https.onCall((username, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }
    Profile.create(firestore, username, context.auth.uid)
      .then(profile => {
        Logger.info("createProfile", `Updated profile ${context.auth.uid}`);
        return profile;
      })
      .catch(e => {
        Logger.error("create profile failed", e);
        throw new functions.https.HttpsError(
          "internal",
          "create profile failed"
        );
      });
  });
