import Gameboard from "./gameboard";
import Ship from "./ship.js";

describe("Gameboard constructor", () => {
  test("initializes a 10x10 board with correct default cells", () => {
    const board = new Gameboard();
    expect(board.board).toHaveLength(10);
    expect(board.board[0]).toHaveLength(10);
    expect(board.board[0][0]).toEqual({
      ship: null,
      isAttacked: false,
    });
  });

  test("initializes ships array as empty", () => {
    const board = new Gameboard();
    expect(Array.isArray(board.ships)).toBe(true);
    expect(board.ships.length).toBe(0);
  });
});

describe("Gameboard.getBoardState", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  test("returns 10x10 array with default cell values", () => {
    const state = board.getBoardState();
    expect(state).toHaveLength(10);
    expect(state[0]).toHaveLength(10);
    expect(state[0][0]).toEqual({
      hasShip: false,
      isAttacked: false,
      wasHit: false,
    });
  });

  test("reflects a missed attack in board state", () => {
    board.receiveAttack([1, 1]);
    const state = board.getBoardState();
    expect(state[1][1]).toEqual({
      hasShip: false,
      isAttacked: true,
      wasHit: false,
    });
  });

  test("reflects a hit attack in board state", () => {
    board.placeShip("destroyer", [[2, 2], [2, 3]]);
    board.receiveAttack([2, 2]);
    const state = board.getBoardState();
    expect(state[2][2]).toEqual({
      hasShip: true,
      isAttacked: true,
      wasHit: true,
    });
  });

  test("reflects an unattacked ship cell in board state", () => {
    board.placeShip("destroyer", [[4, 4], [4, 5]]);
    const state = board.getBoardState();
    expect(state[4][4]).toEqual({
      hasShip: true,
      isAttacked: false,
      wasHit: false,
    });
  });
});


describe("Gameboard.allShipsSunk", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  test("returns true when no ships are placed", () => {
    expect(board.allShipsSunk()).toBe(true);
  });

  test("returns false when at least one ship is not sunk", () => {
    board.placeShip("destroyer", [[0, 0], [0, 1]]);
    expect(board.allShipsSunk()).toBe(false);
  });

  test("returns true when all ships are sunk", () => {
    board.placeShip("destroyer", [[0, 0], [0, 1]]);
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    expect(board.allShipsSunk()).toBe(true);
  });

  test("returns false when some ships are sunk but others are not", () => {
    board.placeShip("destroyer", [[0, 0], [0, 1]]);
    board.placeShip("submarine", [[2, 2], [2, 3], [2, 4]]);
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    board.receiveAttack([2, 2]);
    expect(board.allShipsSunk()).toBe(false);
  });
});


describe("Gameboard.receiveAttack", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  test("throws error on invalid position", () => {
    expect(() => board.receiveAttack([-1, 5])).toThrow(
      "Invalid position given to receiveAttack function",
    );
    expect(() => board.receiveAttack([10, 0])).toThrow(
      "Invalid position given to receiveAttack function",
    );
    expect(() => board.receiveAttack([5])).toThrow(
      "Invalid position given to receiveAttack function",
    );
    expect(() => board.receiveAttack(null)).toThrow(
      "Invalid position given to receiveAttack function",
    );
  });

  test("throws error if position already attacked", () => {
    board.receiveAttack([0, 0]);
    expect(() => board.receiveAttack([0, 0])).toThrow(
      "Position given to receiveAttack function has already been attacked",
    );
  });

  test("returns 'miss' when attacking empty cell", () => {
    expect(board.receiveAttack([1, 1])).toBe("miss");
    expect(board.board[1][1].isAttacked).toBe(true);
    expect(board.board[1][1].ship).toBeNull();
  });

  test("returns 'hit' when attacking cell with ship and calls ship.hit()", () => {
    // Mock Ship and spy on hit method
    const ship = new Ship("destroyer");
    jest.spyOn(ship, "hit");

    // Place ship manually on board at [2,3]
    board.board[3][2].ship = ship;

    const result = board.receiveAttack([2, 3]);
    expect(result).toBe("hit");
    expect(board.board[3][2].isAttacked).toBe(true);
    expect(ship.hit).toHaveBeenCalled();
  });
});

describe("Gameboard.placeShip", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  test("exists and is a function", () => {
    expect(typeof board.placeShip).toBe("function");
  });

  test("throws error for invalid ship type", () => {
    expect(() =>
      board.placeShip("canoe", [
        [0, 0],
        [1, 0],
      ]),
    ).toThrow("Invalid ship type given as input to placeShip");
  });

  test("throws error for mismatched ship size and positions length", () => {
    expect(() =>
      board.placeShip("destroyer", [
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toThrow("Type and positions are mismatched in placeShip input");
  });

  test("throws error for positions that aren't contiguous and aligned", () => {
    expect(() =>
      board.placeShip("destroyer", [
        [0, 0],
        [2, 0],
      ]),
    ).toThrow(
      "Ship positions are not contiguous and aligned in placeShip input",
    );

    expect(() =>
      board.placeShip("cruiser", [
        [0, 0],
        [0, 1],
        [1, 0],
      ]),
    ).toThrow(
      "Ship positions are not contiguous and aligned in placeShip input",
    );

    expect(() =>
      board.placeShip("destroyer", [
        [1, 1],
        [2, 2],
      ]),
    ).toThrow(
      "Ship positions are not contiguous and aligned in placeShip input",
    );
  });

  test("throws error for invalid positions in positions array", () => {
    expect(() =>
      board.placeShip("destroyer", [
        [10, 0],
        [10, 1],
      ]),
    ).toThrow(
      "Invalid positions in positions array given to placeShip function",
    );

    expect(() =>
      board.placeShip("carrier", [
        [0, -1],
        [0, -2],
        [0, -3],
        [0, -4],
        [0, -5],
      ]),
    ).toThrow(
      "Invalid positions in positions array given to placeShip function",
    );
  });

  test("throws error for occupied positions", () => {
    board.placeShip("destroyer", [
      [0, 0],
      [0, 1],
    ]);
    expect(() =>
      board.placeShip("destroyer", [
        [0, 0],
        [0, 1],
      ]),
    ).toThrow(
      "Occupied position in positions array given to placeShip function",
    );
  });

  test("places a ship successfully on valid input", () => {
    board.placeShip("destroyer", [
      [1, 1],
      [1, 2],
    ]);
    const ship = board.board[1][1].ship
      ? board.board[1][1].ship
      : board.board[1][1];
    expect(ship).toBeInstanceOf(Ship);
    // Check the same ship instance is at all positions
    expect(
      board.board[2][1].ship ? board.board[2][1].ship : board.board[2][1],
    ).toBe(ship);
  });

  test("places the same Ship instance in all specified positions", () => {
    const positions = [
      [3, 3],
      [3, 4],
    ];
    board.placeShip("destroyer", positions);
    const ship = board.board[3][3].ship
      ? board.board[3][3].ship
      : board.board[3][3];
    expect(ship).toBe(
      board.board[4][3].ship ? board.board[4][3].ship : board.board[4][3],
    );
  });

  test("places ship successfully at edge of board", () => {
    board.placeShip("destroyer", [
      [9, 8],
      [9, 9],
    ]);
    expect(
      board.board[8][9].ship ? board.board[8][9].ship : board.board[8][9],
    ).toBeInstanceOf(Ship);
    expect(
      board.board[9][9].ship ? board.board[9][9].ship : board.board[9][9],
    ).toBeInstanceOf(Ship);
  });

  test("allows placing multiple different ships on non-overlapping positions", () => {
    board.placeShip("destroyer", [
      [0, 0],
      [0, 1],
    ]);
    board.placeShip("submarine", [
      [2, 2],
      [2, 3],
      [2, 4],
    ]);
    expect(
      board.board[0][0].ship ? board.board[0][0].ship : board.board[0][0],
    ).toBeInstanceOf(Ship);
    expect(
      board.board[2][2].ship ? board.board[2][2].ship : board.board[2][2],
    ).toBeInstanceOf(Ship);
  });
});
