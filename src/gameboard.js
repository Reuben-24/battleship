import Ship from "./ship.js";

export default class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => new Array(10).fill(null));
  }

  placeShip(type, positions) {
    // Validate ship types
    if (!(type in Ship.shipTypes))
      throw new Error("Invalid ship type given as input to placeShip");

    // Validate implied ship size by positions array with ship type's expected size
    const expectedSize = Ship.shipTypes[type].size;
    if (positions.length !== expectedSize) {
      throw new Error("Type and positions are mismatched in placeShip input");
    }

    // Validate positions in positions array are contigous and aligned
    if (!Gameboard.arePositionsContiguous(positions)) {
      throw new Error("Ship positions must be contiguous and aligned");
    }

    for (let pos of positions) {
      // Validate positions input array
      if (!Gameboard.isValidPosition(pos)) {
        throw new Error("Invalid positions array given to placeShip function");
      }

      // Ensure positions are not already occupied
      if (this.isCellOccupied(pos)) {
        throw new Error(
          "Positions input to placeShip function are already occupied",
        );
      }
    }

    // Create new ship object
    const ship = new Ship(type);

    // Add ship to gameboard
    for (let pos of positions) {
      this.board[pos[1]][pos[0]] = ship;
    }
  }

  static arePositionsContiguous(positions) {
    const xs = positions.map(p => p[0]);
    const ys = positions.map(p => p[1]);

    const allSameX = xs.every(x => x === xs[0]);
    const allSameY = ys.every(y => y === ys[0]);

    if (!allSameX && !allSameY) return false;

    const sorted = allSameX ? ys.slice().sort((a, b) => a - b) : xs.slice().sort((a, b) => a - b);

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) return false;
    }

    return true;
  }

  isCellOccupied([x, y]) {
    return this.board[y][x] !== null;
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
