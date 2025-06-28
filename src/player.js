import Gameboard from "./gameboard.js";
import { computerStrategy, humanStrategy } from "./strategies.js";

export default class Player {
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

  takeTurn(opponentPlayer, selectedPosition = undefined) {
    return this.strategy.takeTurn(opponentPlayer.gameboard, selectedPosition);
  }

  static types = {
    computer: computerStrategy,
    human: humanStrategy,
  };
}
