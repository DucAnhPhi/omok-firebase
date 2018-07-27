import Base from "../base";

export interface IGame {
  moves: {
    [key: string]: boolean;
  };
  playerIds: string[];
  available: boolean;
  playerWhite: string;
  winner: string;
  draw: boolean;
}

export class Game extends Base {
  static create(currentPlayerId: string): Promise<any> {
    const newGame: IGame = {
      moves: {},
      playerIds: [currentPlayerId],
      available: true,
      playerWhite: currentPlayerId,
      winner: null,
      draw: false
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

  private static convertToPositions(moves: { [key: string]: boolean }) {
    const boardPositions = [...Array(15)].map(() => [...Array(15)]);
    Object.keys(moves).map(move => {
      const position = JSON.parse(move); // { x: number, y: number}
      boardPositions[position.y][position.x] = moves[move];
    });
    return boardPositions;
  }

  private static checkRow(row, col, positions, currentToken) {
    let inALine = 0;
    for (let colOffset = 1; colOffset < 5; colOffset++) {
      if (positions[row][col + colOffset] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  private static checkColumn(row, col, positions, currentToken) {
    let inALine = 0;
    for (let rowOffset = 1; rowOffset < 5; rowOffset++) {
      if (positions[row + rowOffset][col] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  private static checkDiagonalRight(row, col, positions, currentToken) {
    let inALine = 0;
    for (let offset = 1; offset < 5; offset++) {
      if (positions[row + offset][col + offset] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  private static checkDiagonalLeft(row, col, positions, currentToken) {
    let inALine = 0;
    for (let offset = 1; offset < 5; offset++) {
      if (positions[row + offset][col - offset] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  private static checkVictory(token: boolean, positions: any[][]) {
    for (let row = 0; row < positions.length; row++) {
      for (let col = 0; col < positions[row].length; col++) {
        const currentToken = positions[row][col];
        if (currentToken === undefined) {
          continue;
        }
        const overBottomLimit = row + 4 > 14;
        const overRightLimit = col + 4 > 14;
        const overLeftLimit = col - 4 < 0;
        // lookup the next 4 same tokens on the right if col + 4 <15
        if (!overRightLimit) {
          if (this.checkRow(row, col, positions, currentToken)) {
            return true;
          }
        }
        // lookup the next 4 same tokens south if row + 4 <15
        if (!overBottomLimit) {
          if (this.checkColumn(row, col, positions, currentToken)) {
            return true;
          }
        }
        // lookup the next 4 same tokens diagonally right if col+4<15 && row+4<15
        if (!overRightLimit && !overBottomLimit) {
          if (this.checkDiagonalRight(row, col, positions, currentToken)) {
            return true;
          }
        }
        // lookup the next 4 same tokens diagonally left if col-4 >=0 && row+4<15
        if (!overLeftLimit && !overBottomLimit) {
          if (this.checkDiagonalLeft(row, col, positions, currentToken)) {
            return true;
          }
        }
      }
    }
    return false;
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
    if (game.winner || game.draw) {
      throw new Error("Game already terminated");
    }
    const movesAmount = Object.keys(game.moves).length;
    const turnWhite = movesAmount % 2 === 0;
    const isPlayerWhite = game.playerWhite === currentPlayerId;
    if (!(turnWhite === isPlayerWhite)) {
      throw new Error("Not players turn");
    }
    const positionString = JSON.stringify(position);
    if (game.moves[positionString] !== undefined) {
      throw new Error("Field already occupied");
    }
    const updatedMoves = { ...game.moves, [positionString]: isPlayerWhite };
    const boardPositions = this.convertToPositions(updatedMoves);
    let isVictory = false;
    if (movesAmount + 1 > 8) {
      // check for victory after 9 moves
      isVictory = this.checkVictory(isPlayerWhite, boardPositions);
    }
    // TODO: update player stats on victory
    return gameRef.update({
      moves: updatedMoves,
      winner: isVictory ? currentPlayerId : null
    });
  }
}
