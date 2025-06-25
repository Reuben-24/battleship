export default class Ship {
  static shipTypes = {
    carrier: {
      size: 5,
    },
    battleship: {
      size: 4,
    },
    cruiser: {
      size: 3,
    },
    submarine: {
      size: 3,
    },
    destroyer: {
      size: 2,
    },
  };

  constructor(type) {
    if (!(type in Ship.shipTypes)) {
      throw new Error("Invalid shipType given in Ship object constructor");
    }
    this.type = type;
    this.size = Ship.shipTypes[type].size;
    this.hits = 0;
  }

  hit() {
    if (this.isSunk()) {
      throw new Error("Hit method being called on ship that is already sunk");
    }
    this.hits++;
  }

  isSunk() {
    return this.hits === this.size;
  }
}
