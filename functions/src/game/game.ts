import Base from "../base";

export interface IGame {
  moves: {
    [key: string]: boolean;
  };
  playerIds: string[];
  available: boolean;
  playerWhite: string;
  winner: string;
}

export class Game extends Base {
  static create(currentPlayerId: string): Promise<any> {
    const newGame: IGame = {
      moves: {},
      playerIds: [currentPlayerId],
      available: true,
      playerWhite: currentPlayerId,
      winner: null
    };

    return this.firestore
      .collection("games")
      .doc(currentPlayerId)
      .set(newGame);
  }

  static async match(currentPlayerId: string, gameId: string): Promise<void> {
    const gameRef = this.firestore.collection("games").doc(gameId);
    return this.firestore.runTransaction(transaction => {
      return transaction.get(gameRef).then(gameDoc => {
        if (!gameDoc.exists) {
          throw new Error("Game does not exist");
        }
        const game = gameDoc.data();
        if (game.playerIds.length > 1 || !game.available) {
          throw new Error("Game already occupied");
        }
        transaction.update(gameRef, {
          playerIds: [...game.playerIds, currentPlayerId],
          available: false
        });
      });
    });
  }

  static async move(
    currentPlayerId: string,
    gameId: string,
    position: { x: number; y: number }
  ): Promise<any> {
    const gameRef = this.firestore.collection("games").doc(gameId);
    const gameDoc = await gameRef.get();
    if (!gameDoc.exists) {
      throw new Error("Game does not exist");
    }
    const game = gameDoc.data();
    const turnWhite = Object.keys(game.moves).length % 2 === 0;
    const isPlayerWhite = game.playerWhite === currentPlayerId;
    if (!(turnWhite === isPlayerWhite)) {
      throw new Error("Not players turn");
    }
    const positionString = JSON.stringify(position);
    if (game.moves[positionString] !== undefined) {
      throw new Error("Field already occupied");
    }
    // TODO: check for victory before updating
    return gameRef.update({
      moves: {
        ...game.moves,
        [positionString]: isPlayerWhite
      }
    });
  }
}
