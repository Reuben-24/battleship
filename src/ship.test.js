import Ship from "./ship.js";

describe("Ship class", () => {
  test("throws error for invalid ship type", () => {
    expect(() => new Ship("canoe")).toThrow("Invalid shipType given in Ship object constructor");
  });

  test("creates each valid ship type with correct size and initial hits", () => {
    const types = {
      carrier: 5,
      battleship: 4,
      cruiser: 3,
      submarine: 3,
      destroyer: 2,
    };

    for (const [type, size] of Object.entries(types)) {
      const ship = new Ship(type);
      expect(ship.type).toBe(type);
      expect(ship.size).toBe(size);
      expect(ship.hits).toBe(0);
    }
  });

  test("throws error if trying to hit a sunk ship", () => {
    const ship = new Ship("destroyer");
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
    expect(() => ship.hit()).toThrow("Hit method being called on ship that is already sunk");
  });

  test("correctly increments hit count", () => {
    const ship = new Ship("destroyer");
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test("isSunk() returns false when not sunk", () => {
    const ship = new Ship("submarine");
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk() returns true when sunk", () => {
    const ship = new Ship("submarine");
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});