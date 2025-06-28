import Game from "./game.js";
import Player from "./player.js";
import Ship from "./ship.js";

const validShipMap = {
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

describe("Game constructor", () => {
  test("initializes players and places ships", () => {
    const game = new Game(validShipMap);

    expect(game.humanPlayer).toBeInstanceOf(Player);
    expect(game.humanPlayer.type).toBe("human");

    expect(game.computerPlayer).toBeInstanceOf(Player);
    expect(game.computerPlayer.type).toBe("computer");

    const humanShips = game.humanPlayer.gameboard.board
      .flat()
      .filter((c) => c.ship).length;
    const computerShips = game.computerPlayer.gameboard.board
      .flat()
      .filter((c) => c.ship).length;

    const expectedShips = Object.values(Ship.shipTypes).reduce(
      (sum, ship) => sum + ship.size,
      0,
    );

    expect(humanShips).toBe(expectedShips);
    expect(computerShips).toBe(expectedShips);
  });
});

describe("playHumanTurn", () => {
  test("correctly attacks a valid position", () => {
    const game = new Game(validShipMap);
    const target = [0, 0];

    const result = game.playHumanTurn(target);

    expect(["hit", "miss"]).toContain(result);
    expect(game.computerPlayer.gameboard.board[0][0].isAttacked).toBe(true);
  });

  test("correctly delegates human win", () => {
    const game = new Game(validShipMap);

    expect(game.getWinner()).toBe(null);

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        game.playHumanTurn([i, j]);
      }
    }
    expect(game.getWinner()).toBe(game.humanPlayer);
  });
});

describe("playComputerTurn", () => {
  test("correctly attacks a valid position", () => {
    const game = new Game(validShipMap);

    let attackedCells = game.humanPlayer.gameboard.board
      .flat()
      .filter((cell) => cell.isAttacked);
    expect(attackedCells.length).toBe(0);

    let result = game.playComputerTurn();

    expect(["hit", "miss"]).toContain(result);

    attackedCells = game.humanPlayer.gameboard.board
      .flat()
      .filter((cell) => cell.isAttacked);
    expect(attackedCells.length).toBe(1);

    result = game.playComputerTurn();

    expect(["hit", "miss"]).toContain(result);

    attackedCells = game.humanPlayer.gameboard.board
      .flat()
      .filter((cell) => cell.isAttacked);
    expect(attackedCells.length).toBe(2);
  });

  test("correctly delegates computer win", () => {
    const game = new Game(validShipMap);

    expect(game.getWinner()).toBe(null);

    for (let i = 0; i < 100; i++) {
      game.playComputerTurn();
    }
    expect(game.getWinner()).toBe(game.computerPlayer);
  });
});
