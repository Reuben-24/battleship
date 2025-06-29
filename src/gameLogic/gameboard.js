import Ship from "./ship.js";

export default class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        ship: null,
        isAttacked: false,
      })),
    );
    this.ships = [];
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  getBoardState() {
    return this.board.map((row) =>
      row.map((cell) => ({
        hasShip: cell.ship !== null,
        isAttacked: cell.isAttacked,
        wasHit: cell.isAttacked && cell.ship !== null,
      })),
    );
  }

  receiveAttack(position) {
    // Validate input position
    if (!Gameboard.isValidPosition(position)) {
      throw new Error("Invalid position given to receiveAttack function");
    }

    const [x, y] = position;
    const cell = this.board[y][x];

    // Validate that square has not already been attacked
    if (cell.isAttacked) {
      throw new Error(
        "Position given to receiveAttack function has already been attacked",
      );
    }

    // Change isAttacked status to true
    cell.isAttacked = true;

    if (cell.ship) {
      cell.ship.hit();
      return "hit";
    } else {
      return "miss";
    }
  }

  placeShip(type, positions) {
    // Validate ship types
    if (!(type in Ship.shipTypes)) {
      throw new Error("Invalid ship type given as input to placeShip");
    }

    // Validate implied ship size by positions array with ship type's expected size
    const expectedSize = Ship.shipTypes[type].size;
    if (positions.length !== expectedSize) {
      throw new Error("Type and positions are mismatched in placeShip input");
    }

    // Validate positions in positions array are contiguous and aligned
    if (!Gameboard.arePositionsContiguous(positions)) {
      throw new Error(
        "Ship positions are not contiguous and aligned in placeShip input",
      );
    }

    for (let pos of positions) {
      // Validate positions input array
      if (!Gameboard.isValidPosition(pos)) {
        throw new Error(
          "Invalid positions in positions array given to placeShip function",
        );
      }
      // Ensure cells are not occupied
      if (this.isCellOccupied(pos)) {
        throw new Error(
          "Occupied position in positions array given to placeShip function",
        );
      }
    }

    // Create new ship object
    const ship = new Ship(type);

    // Add ship to gameboard
    for (let pos of positions) {
      const [x, y] = pos;
      this.board[y][x].ship = ship;
    }

    this.ships.push(ship);
  }

  isCellOccupied(position) {
    const [x, y] = position;
    const cell = this.board[y][x];
    return cell.ship !== null;
  }

  static arePositionsContiguous(positions) {
    const xs = positions.map((p) => p[0]);
    const ys = positions.map((p) => p[1]);

    const allSameX = xs.every((x) => x === xs[0]);
    const allSameY = ys.every((y) => y === ys[0]);

    if (!allSameX && !allSameY) return false;

    const sorted = allSameX
      ? ys.slice().sort((a, b) => a - b)
      : xs.slice().sort((a, b) => a - b);

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) return false;
    }

    return true;
  }

  static isValidIndex(n) {
    return Number.isInteger(n) && n >= 0 && n <= 9;
  }

  static isValidPosition(position) {
    return (
      Array.isArray(position) &&
      position.length === 2 &&
      Gameboard.isValidIndex(position[0]) &&
      Gameboard.isValidIndex(position[1])
    );
  }
}
