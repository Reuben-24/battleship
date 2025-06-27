import { Player } from "./player.js";
import Ship from "./ship.js";
import { computerStrategy, humanStrategy } from "./strategies.js";

describe("Player constructor", () => {
  test("throws error if invalid strategy given", () => {
    expect(() => {
      new Player("alien");
    }).toThrow("Invalid strategy given in Player constructor");
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
    const shipCells = boardCells.filter(cell => cell.ship !== null);

    // Get total ship length from ship types
    const totalShipLength = Object.values(Ship.shipTypes)
      .reduce((sum, type) => sum + type.size, 0);

    expect(shipCells.length).toBe(totalShipLength);
  });

  test("Places one ship of each type on the gameboard", () => {
    // Collect unique ship instances types from the board
    const placedShipTypes = new Set();
    boardCells.forEach(cell => {
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

    boardCells.forEach(cell => {
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
      const xs = positions.map(p => p[0]);
      const ys = positions.map(p => p[1]);

      const allSameX = xs.every(x => x === xs[0]);
      const allSameY = ys.every(y => y === ys[0]);

      expect(allSameX || allSameY).toBe(true);

      const sorted = allSameX ? ys.slice().sort((a, b) => a - b) : xs.slice().sort((a, b) => a - b);
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
    computerOpponent.gameboard.board.forEach(row =>
      row.forEach(cell => {
        cell.isAttacked = true;
      })
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
    const attackedCells = computerOpponent.gameboard.board.flat().filter(c => c.isAttacked);
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