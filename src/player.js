import Gameboard from "./gameboard.js";
import { computerStrategy, humanStrategy } from "./strategies.js";
export { Player };

class Player {
  constructor(type) {
    if (!(type in Player.types)) {
      throw new Error("Invalid player type provided to Player constructor");
    }
    this.gameboard = new Gameboard();
    this.type = type;
    this.strategy = Player.types[type];
  }

  placeShips(selectedPositionsMap = undefined) {
    return this.strategy.placeShips(this.gameboard, selectedPositionsMap);
  }

  takeTurn(opponent) {
    return this.strategy.takeTurn(opponent.gameboard);
  }

  static types = {
    computer: computerStrategy,
    human: humanStrategy,
  };
}
