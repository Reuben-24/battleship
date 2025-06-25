import Gameboard from "./gameboard";

describe("placeShip function", () => {
  test("exists and is a function", () => {
    const board = new Gameboard();
    expect(typeof board.placeShip).toBe("function");
  });

  test("throws error for invalid ship type", () => {
    const board = new Gameboard();
    expect(() =>
      board.placeShip("canoe", [
        [0, 0],
        [1, 0],
      ]),
    ).toThrow("Invalid ship type given as input to placeShip");
  });

  test("throws error for invalid input positions array length", () => {
    const board = new Gameboard();
    expect(() =>
      board.placeShip("destroyer", [
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toThrow("Type and positions are mismatched in placeShip input");
  });

  test("throws error for positions that aren't contiguous or aligned", () => {
    const board = new Gameboard();
    expect(() =>
      board.placeShip("destroyer", [
        [0, 0],
        [2, 0],
      ]),
    ).toThrow("Ship positions must be contiguous and aligned");
    expect(() =>
      board.placeShip("cruiser", [
        [0, 0],
        [0, 1],
        [1, 0],
      ]),
    ).toThrow("Ship positions must be contiguous and aligned");
  });

  test("throws error for invalid positions in positions array", () => {
    const board = new Gameboard();
    expect(() =>
      board.placeShip("destroyer", [
        [10, 0],
        [10, 1],
      ]),
    ).toThrow("Invalid positions array given to placeShip function");
    expect(() =>
      board.placeShip("carrier", [
        [0, -1],
        [0, -2],
        [0, -3],
        [0, -4],
        [0, -5]
      ]),
    ).toThrow("Invalid positions array given to placeShip function");
  });
});
