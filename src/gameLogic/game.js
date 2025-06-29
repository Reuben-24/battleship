import Player from "./player.js";

export default class Game {
  constructor(selectedPositionsMap) {
    this.humanPlayer = new Player("human");
    this.computerPlayer = new Player("computer");
    this.humanPlayer.placeShips(selectedPositionsMap);
    this.computerPlayer.placeShips();
    this.winner = null;
  }

  playHumanTurn(selectedPosition) {
    const result = this.humanPlayer.takeTurn(
      this.computerPlayer,
      selectedPosition,
    );

    if (this.computerPlayer.gameboard.allShipsSunk()) {
      this.winner = this.humanPlayer;
    }

    return result;
  }

  playComputerTurn() {
    const result = this.computerPlayer.takeTurn(this.humanPlayer);

    if (this.humanPlayer.gameboard.allShipsSunk()) {
      this.winner = this.computerPlayer;
    }

    return result;
  }

  getWinner() {
    return this.winner;
  }
}
