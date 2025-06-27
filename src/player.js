import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
export { Player, computerStrategy }


function getRandomInt(minInt, maxInt) {
  if (!Number.isInteger(minInt) || !Number.isInteger(maxInt)) {
    throw new Error("Both min and max must be integers");
  }
  if (maxInt < minInt) {
    throw new Error("max must be greater than or equal to min");
  }
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

const computerStrategy = {
  placeShips(playerGameboard) {
    for (const type in Ship.shipTypes) {
      // Get the size of the ship
      const size = Ship.shipTypes[type].size;

      // Get the maximum x and y positions on the board
      const maxX = playerGameboard.board[0].length - 1;
      const maxY = playerGameboard.board.length - 1;

      // Attempt to place ship until free spot is selected and then place
      let placed = false
      while (!placed) {
        // Randomnly pick an orientation (horizontal=true/vertical=false)
        const horizontal = Math.random() < 0.5;

        // Get the range of possible starting positions based on ship orientation and size
        const maxStartingX = horizontal ? maxX - size + 1 : maxX;
        const maxStartingY = horizontal ? maxY : maxY - size + 1;

        // Randomnly select a valid starting position
        const startingX = getRandomInt(0, maxStartingX);
        const startingY = getRandomInt(0, maxStartingY);

        // Get full hypothetical positions array based on coordinates
        const positions = [];
        for (let i = 0; i < size; i++) {
          if (horizontal) {
            positions.push([startingX + i, startingY]);
          } else {
            positions.push([startingX, startingY + i]);
          }
        }

        // Try to placeShip
        try {
          playerGameboard.placeShip(type, positions);
          placed = true;
        } catch {
          placed = false;      
        }
      }
    }
  },


  takeTurn(board, opponentBoard) { /* AI attack logic */ }
};


const humanStrategy = {
  placeShips(board) { /* UI code */ },
  takeTurn(board, opponentBoard) { /* UI input */ }
};

class Player {
  constructor(strategy) {
    if (!Player.strategies.includes(strategy)) {
      throw new Error("Invalid strategy given in Player constructor");
    }
    this.gameboard = new Gameboard();
    this.strategy = strategy;
  }
  placeShips() {
    return this.strategy.placeShips(this.gameboard);
  }
  takeTurn(opponent) {
    return this.strategy.takeTurn(this.gameboard, opponent.gameboard);
  }
  // ...other methods

  static strategies = [
    humanStrategy,
    computerStrategy
  ];
}