import { Player } from "./player.js";
import Ship from "./ship.js";
import { computerStrategy, humanStrategy } from "./strategies.js";

describe("Player constructor", () => {
  test("throws error if invalid strategy given", () => {
    expect(() => {
      new Player("alien");
    }).toThrow("Invalid player type provided to Player constructor");
  });

  test("correctly creates computer player", () => {
    const computerPlayer = new Player("computer");
    expect(computerPlayer.type).toBe("computer");
    expect(computerPlayer.strategy).toBe(computerStrategy);
    expect(typeof computerPlayer.gameboard).toBe("object");
  });

  test("correctly creates human player", () => {
    const humanPlayer = new Player("human");
    expect(humanPlayer.type).toBe("human");
    expect(humanPlayer.strategy).toBe(humanStrategy);
    expect(typeof humanPlayer.gameboard).toBe("object");
  });
});

describe("computerPlayer.placeShips", () => {
  let computerPlayer;
  let boardCells;

  beforeEach(() => {
    computerPlayer = new Player("computer");
    computerPlayer.placeShips();
    boardCells = computerPlayer.gameboard.board.flat();
  });

  test("Correct number of cells are occupied by ships", () => {
    // Get total nuymber of cells on board with ships
    const shipCells = boardCells.filter((cell) => cell.ship !== null);

    // Get total ship length from ship types
    const totalShipLength = Object.values(Ship.shipTypes).reduce(
      (sum, type) => sum + type.size,
      0,
    );

    expect(shipCells.length).toBe(totalShipLength);
  });

  test("Places one ship of each type on the gameboard", () => {
    // Collect unique ship instances types from the board
    const placedShipTypes = new Set();
    boardCells.forEach((cell) => {
      if (cell.ship) {
        placedShipTypes.add(cell.ship.type);
      }
    });

    // Get expected ship types form ship class
    const expectedShipTypes = new Set(Object.keys(Ship.shipTypes));

    expect(placedShipTypes).toEqual(expectedShipTypes);
  });

  test("No overlapping ships", () => {
    // Count how many times each Ship instance appears
    const shipInstanceCounts = new Map();

    boardCells.forEach((cell) => {
      if (cell.ship) {
        const ship = cell.ship;
        shipInstanceCounts.set(ship, (shipInstanceCounts.get(ship) || 0) + 1);
      }
    });

    // Each ship instance should appear exactly its size number of times
    for (const [ship, count] of shipInstanceCounts.entries()) {
      const expectedSize = Ship.shipTypes[ship.type].size;
      expect(count).toBe(expectedSize);
    }
  });

  test("All ships are placed contiguously in a straight line", () => {
    const shipToPositions = new Map();

    computerPlayer.gameboard.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.ship) {
          const ship = cell.ship;
          if (!shipToPositions.has(ship)) {
            shipToPositions.set(ship, []);
          }
          shipToPositions.get(ship).push([x, y]);
        }
      });
    });

    for (const [ship, positions] of shipToPositions.entries()) {
      // Check length
      const expectedSize = Ship.shipTypes[ship.type].size;
      expect(positions.length).toBe(expectedSize);

      // Extract X and Y values
      const xs = positions.map((p) => p[0]);
      const ys = positions.map((p) => p[1]);

      const allSameX = xs.every((x) => x === xs[0]);
      const allSameY = ys.every((y) => y === ys[0]);

      expect(allSameX || allSameY).toBe(true);

      const sorted = allSameX
        ? ys.slice().sort((a, b) => a - b)
        : xs.slice().sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]).toBe(sorted[i - 1] + 1);
      }
    }
  });
});

describe("computerPlayer.takeTurn", () => {
  let computerPlayer;
  let computerOpponent;

  beforeEach(() => {
    computerPlayer = new Player("computer");
    computerOpponent = new Player("computer");
    computerPlayer.placeShips();
    computerOpponent.placeShips();
  });

  test("throws error if opponent gameboard is null or invalid", () => {
    const invalidOpponents = [
      null,
      {},
      { gameboard: null },
      { gameboard: { board: null } },
      { gameboard: { board: [] } },
      { gameboard: { board: Array(9).fill([]) } },
    ];

    invalidOpponents.forEach((invalidOpponent) => {
      expect(() => {
        computerPlayer.takeTurn(invalidOpponent);
      }).toThrow(/gameboard/i);
    });
  });

  test("throws error if opponent has no available cells to attack", () => {
    // Mark all opponent board cells as attacked
    computerOpponent.gameboard.board.forEach((row) =>
      row.forEach((cell) => {
        cell.isAttacked = true;
      }),
    );

    expect(() => {
      computerPlayer.takeTurn(computerOpponent);
    }).toThrow("No available cells to attack");
  });

  test("returns 'hit' or 'miss' after attacking opponent's board", () => {
    const result = computerPlayer.takeTurn(computerOpponent);

    // Result must be 'hit' or 'miss'
    expect(["hit", "miss"]).toContain(result);
  });

  test("only marks one cells status to attacked", () => {
    computerPlayer.takeTurn(computerOpponent);

    // Ensure exactly one new cell is marked as attacked on opponent board
    const attackedCells = computerOpponent.gameboard.board
      .flat()
      .filter((c) => c.isAttacked);
    expect(attackedCells.length).toBe(1);
  });

  test("each turn attacks a different unattacked cell", () => {
    const attackedPositions = [];
    const numAttacks = 20;

    // Perform multiple turns
    for (let i = 0; i < numAttacks; i++) {
      computerPlayer.takeTurn(computerOpponent);
    }

    // Collect all attacked positions
    computerOpponent.gameboard.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.isAttacked) attackedPositions.push([x, y]);
      });
    });

    // Confirm no duplicate attacks, attackedPositions size equals attacked cells count
    const uniqueAttacks = new Set(attackedPositions);
    expect(uniqueAttacks.size).toBe(numAttacks);
  });
});

describe("humanPlayer.placeShips", () => {
  let humanPlayer;

  beforeEach(() => {
    humanPlayer = new Player("human");
  });

  test("throws if ship map is missing required ship types", () => {
    const partialMap = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      destroyer: [
        [1, 0],
        [1, 1],
      ],
      // Missing others like submarine, battleship, patrol boat
    };

    expect(() => {
      humanPlayer.placeShips(partialMap);
    }).toThrow(/Missing ship type/);
  });

  test("throws if ship map has incorrect array lengths", () => {
    const incorrectMap = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      battleship: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      cruiser: [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      submarine: [
        [3, 0],
        [3, 1],
        [3, 2],
      ],
      destroyer: [[4, 0]],
      // Off by one positon for destroyer
    };

    expect(() => {
      humanPlayer.placeShips(incorrectMap);
    }).toThrow("Invalid number of positions for destroyer");
  });

  test("throws if ship map has diagonal position array", () => {
    const incorrectMap = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      battleship: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      cruiser: [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      submarine: [
        [3, 0],
        [3, 1],
        [3, 2],
      ],
      destroyer: [
        [4, 0],
        [5, 1],
      ],
      // Destroyer is on diagonal
    };

    expect(() => {
      humanPlayer.placeShips(incorrectMap);
    }).toThrow("Positions for destroyer are not contiguous or aligned");
  });

  test("throws if ship map has space in position array", () => {
    const incorrectMap = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      battleship: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      cruiser: [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      submarine: [
        [3, 0],
        [3, 1],
        [3, 2],
      ],
      destroyer: [
        [4, 0],
        [4, 2],
      ],
      // Destroyer has space
    };

    expect(() => {
      humanPlayer.placeShips(incorrectMap);
    }).toThrow("Positions for destroyer are not contiguous or aligned");
  });

  test("throws if ship map duplicates position", () => {
    const incorrectMap = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      battleship: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      cruiser: [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      submarine: [
        [3, 0],
        [3, 1],
        [3, 2],
      ],
      destroyer: [
        [0, 0],
        [0, 1],
      ],
      // Destroyer duplicates carrrier positions
    };

    expect(() => {
      humanPlayer.placeShips(incorrectMap);
    }).toThrow(
      "Occupied position in positions array given to placeShip function",
    );
  });

  test("throws if any position is out of bounds", () => {
    const invalidMap = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 10],
      ], // invalid y = 10
      battleship: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      cruiser: [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      submarine: [
        [3, 0],
        [3, 1],
        [3, 2],
      ],
      destroyer: [
        [4, 0],
        [4, 1],
      ],
    };

    expect(() => {
      humanPlayer.placeShips(invalidMap);
    }).toThrow("Invalid position for carrier");
  });

  test("places all ships correctly with valid input", () => {
    const validMap = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      battleship: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      cruiser: [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      submarine: [
        [3, 0],
        [3, 1],
        [3, 2],
      ],
      destroyer: [
        [4, 0],
        [4, 1],
      ],
    };

    humanPlayer.placeShips(validMap);

    const flatBoard = humanPlayer.gameboard.board.flat();
    const cellsWithShips = flatBoard.filter((cell) => cell.ship !== null);

    const expectedTotalCells = Object.values(Ship.shipTypes).reduce(
      (sum, type) => sum + type.size,
      0,
    );

    expect(cellsWithShips.length).toBe(expectedTotalCells);

    const placedTypes = new Set(cellsWithShips.map((cell) => cell.ship.type));
    expect(placedTypes).toEqual(new Set(Object.keys(Ship.shipTypes)));
  });
});
