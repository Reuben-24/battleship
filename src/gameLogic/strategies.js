import Ship from "./ship.js";
import Gameboard from "./gameboard.js";
export { computerStrategy, humanStrategy };

const humanStrategy = {
  placeShips(playerGameboard, selectedPositionsMap) {
    // Example input: { destroyer: [[0,0],[0,1]], carrier: [[2,2],[2,3],[2,4],[2,5],[2,6]], ... }

    validateGameboard(playerGameboard);
    validateHumanShipPlacements(selectedPositionsMap);

    for (const [type, positions] of Object.entries(selectedPositionsMap)) {
      playerGameboard.placeShip(type, positions);
    }
  },

  takeTurn(opponentGameboard, selectedPosition) {
    validateGameboard(opponentGameboard);

    // Validate selected position
    if (!Gameboard.isValidPosition(selectedPosition)) {
      throw new Error("Invalid selected position");
    }

    // Attack selected position
    return opponentGameboard.receiveAttack(selectedPosition);
  },
};

const computerStrategy = {
  placeShips(playerGameboard) {
    validateGameboard(playerGameboard);

    for (const type in Ship.shipTypes) {
      // Get the size of the ship
      const size = Ship.shipTypes[type].size;

      // Get the maximum x and y positions on the board
      const maxX = playerGameboard.board[0].length - 1;
      const maxY = playerGameboard.board.length - 1;

      // Attempt to place ship until free spot is selected and then place
      let placed = false;
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

  takeTurn(opponentGameboard) {
    validateGameboard(opponentGameboard);

    // Get array of cells from opponents gameboard that have not been attacked
    const notAttackedCells = [];
    for (let [y, row] of opponentGameboard.board.entries()) {
      for (let [x, cell] of row.entries()) {
        if (!cell.isAttacked) {
          notAttackedCells.push([x, y]);
        }
      }
    }

    // Select random square to attack from opponents gameboard
    if (notAttackedCells.length === 0) {
      throw new Error("No available cells to attack");
    }
    const positionToAttack =
      notAttackedCells[getRandomInt(0, notAttackedCells.length - 1)];

    // Attack this square
    return opponentGameboard.receiveAttack(positionToAttack);
  },
};

function validateHumanShipPlacements(selectedPositionMaps) {
  if (
    typeof selectedPositionMaps !== "object" ||
    selectedPositionMaps === null
  ) {
    throw new Error("Invalid ship placements input");
  }

  const expectedTypes = Object.keys(Ship.shipTypes);
  const providedTypes = Object.keys(selectedPositionMaps);

  // Ensure all required ship types are present
  for (const type of expectedTypes) {
    if (!providedTypes.includes(type)) {
      throw new Error(`Missing ship type: ${type}`);
    }
  }

  // Ensure no extra types
  for (const type of providedTypes) {
    if (!expectedTypes.includes(type)) {
      throw new Error(`Unexpected ship type: ${type}`);
    }
  }

  for (const [type, positions] of Object.entries(selectedPositionMaps)) {
    const expectedSize = Ship.shipTypes[type].size;

    // Ensure correct number of positions
    if (!Array.isArray(positions) || positions.length !== expectedSize) {
      throw new Error(`Invalid number of positions for ${type}`);
    }

    // Ensure all positions are valid
    for (const pos of positions) {
      if (!Gameboard.isValidPosition(pos)) {
        throw new Error(`Invalid position for ${type}: [${pos}]`);
      }
    }

    // Ensure positions are contiguous and aligned
    if (!Gameboard.arePositionsContiguous(positions)) {
      throw new Error(`Positions for ${type} are not contiguous or aligned`);
    }
  }
}

function validateGameboard(gameboard) {
  if (!gameboard) {
    throw new Error("No gameboard provided");
  }

  if (!Array.isArray(gameboard.board) || gameboard.board.length !== 10) {
    throw new Error("Gameboard.board must be a 10x10 array");
  }
}

function getRandomInt(minInt, maxInt) {
  if (!Number.isInteger(minInt) || !Number.isInteger(maxInt)) {
    throw new Error("Both min and max must be integers");
  }
  if (maxInt < minInt) {
    throw new Error("max must be greater than or equal to min");
  }
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
