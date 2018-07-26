import * as functions from "firebase-functions";
import { Game } from "./game";
import Logger from "../logger";

export const createGameFunc = functions.https.onCall((data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  return Game.create(context.auth.uid)
    .then(() => {
      Logger.info("game created", "");
    })
    .catch(e => {
      Logger.error("no game created", e);
      throw new functions.https.HttpsError("internal", "no game created");
    });
});

export const matchGameFunc = functions.https.onCall(
  (data: { gameId: string }, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    return Game.match(context.auth.uid, data.gameId)
      .then(gameId => {
        Logger.info("game matched", gameId);
        return gameId;
      })
      .catch(e => {
        Logger.error("game matching failed", e);
        throw new functions.https.HttpsError(
          "internal",
          "game matching failed"
        );
      });
  }
);

export const makeMoveFunc = functions.https.onCall(
  (
    data: {
      gameId: string;
      position: { x: number; y: number };
    },
    context
  ) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    return Game.move(context.auth.uid, data.gameId, data.position)
      .then(() => {
        Logger.info("successful move", "");
      })
      .catch(e => {
        Logger.info("move failed", e);
        throw new functions.https.HttpsError("internal", "move failed");
      });
  }
);
