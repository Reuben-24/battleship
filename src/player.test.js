import Ship from "./ship.js";
import { computerStrategy, Player } from "./player.js";

describe("computerStrategy.placeShips", () => {
  let boardMock;
  let placeShipSpy;

  beforeEach(() => {
    // Mock a simplified board with isCellOccupied always false for this test
    boardMock = {
      board: Array.from({ length: 10 }, () => Array(10).fill(null)),
      isCellOccupied: jest.fn(() => false),
      placeShip: jest.fn(),
    };

    placeShipSpy = boardMock.placeShip;
  });

  test("places a ship for every type in Ship.shipTypes", () => {
    computerStrategy.placeShips(boardMock);

    // Must call placeShip for each ship type exactly once
    expect(placeShipSpy).toHaveBeenCalledTimes(Object.keys(Ship.shipTypes).length);

    Object.keys(Ship.shipTypes).forEach((type) => {
      expect(placeShipSpy).toHaveBeenCalledWith(
        expect.stringContaining(type), // type argument
        expect.any(Array) // positions array
      );
    });
  });

  test("places ships without overlapping positions", () => {
    // This requires a real-ish board or enhanced mock.
    // We'll spy on placeShip and simulate that overlapping throws error
    const occupiedPositions = new Set();

    placeShipSpy.mockImplementation((type, positions) => {
      positions.forEach((pos) => {
        const key = pos.join(",");
        if (occupiedPositions.has(key)) {
          throw new Error("Occupied position");
        }
        occupiedPositions.add(key);
      });
    });

    computerStrategy.placeShips(boardMock);

    // Verify no duplicate positions
    expect(occupiedPositions.size).toBe(
      Object.values(Ship.shipTypes).reduce((sum, s) => sum + s.size, 0)
    );
  });

  test("places ships only within board boundaries", () => {
    // Spy and check if any position is out of range
    placeShipSpy.mockImplementation((type, positions) => {
      positions.forEach(([x, y]) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(9);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(9);
      });
    });

    computerStrategy.placeShips(boardMock);
  });

  test("retries placement if placeShip throws error", () => {
    // Setup placeShip to throw first 2 times then succeed
    const callCounts = {};

    placeShipSpy.mockImplementation((type, positions) => {
      callCounts[type] = (callCounts[type] || 0) + 1;
      if (callCounts[type] < 3) {
        throw new Error("Simulated placement error");
      }
      return true;
    });

    computerStrategy.placeShips(boardMock);

    // Each ship placed exactly once
    Object.keys(Ship.shipTypes).forEach((type) => {
      expect(callCounts[type]).toBeGreaterThanOrEqual(3);
      expect(callCounts[type]).toBeLessThanOrEqual(10); // sanity upper bound
    });
  });
});
