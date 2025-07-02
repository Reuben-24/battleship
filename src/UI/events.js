import { renderStartGameUI, renderGameOverUI, getSelectedPositionsMap, renderHumanResultUI, renderComputerResultUI, renderPlayerTurnUI } from "./dom.js";
import { validateHumanShipPlacements } from "../gameLogic/strategies.js";
import { initDragDrop } from "./placeShipsUI.js";
import Game from "../gameLogic/game.js";
export { initStartGameListener, addAttackListeners };

function initStartGameListener(onStart) {
  const startGameButton = document.getElementById("start-game-button");

  startGameButton.addEventListener("click", () => {
    const selectedPositionsMap = getSelectedPositionsMap();

    try {
      validateHumanShipPlacements(selectedPositionsMap);
      onStart(selectedPositionsMap);
    } catch {
      console.log(selectedPositionsMap);
      alert("All ships must be placed on the board");
    }
  });
}

function addAttackListeners(game) {
  const cells = document.querySelectorAll("#computer-board-container .cell")
  cells.forEach(cell => {
    if (cell.dataset.wasHit === "false" && cell.dataset.wasMissed === "false") {
      cell.addEventListener("click", event => {
        handleHumanAttack(event, game);
      });
    }
  })
}

function handleHumanAttack(event, game) {
  // Get attacked cell
  const cell = event.currentTarget;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  const selectedPosition = [x, y];

  const result = game.playHumanTurn(selectedPosition);

  renderHumanResultUI(result, game.humanPlayer.gameboard.getBoardState(), game.computerPlayer.gameboard.getBoardState());

  addHumanAttackContinueListener(game);

}

function addHumanAttackContinueListener(game) {
  const continueButton = document.getElementById("continue-button");

  continueButton.addEventListener("click", () => {
    // Check if winner
    if (game.getWinner()) {
      renderGameOverUI(game.getWinner());
      addPlayAgainListener();
      return;
    }
    handleHumanAttackContinue(game);
  }, { once: true });
}

function handleHumanAttackContinue(game) {
  const result = game.playComputerTurn();

  renderComputerResultUI(result, game.humanPlayer.gameboard.getBoardState(), game.computerPlayer.gameboard.getBoardState());

  addComputerAttackContinueListener(game);
}

function addComputerAttackContinueListener(game) {
  const continueButton = document.getElementById("continue-button");

  continueButton.addEventListener("click", () => {
    // Check if winner
    if (game.getWinner()) {
      renderGameOverUI(game.getWinner());
      addPlayAgainListener();
      return;
    }
    handleComputerAttackContinue(game);
  }, { once: true });
}

function handleComputerAttackContinue(game) {
  renderPlayerTurnUI(game.humanPlayer.gameboard.getBoardState(), game.computerPlayer.gameboard.getBoardState())
  addAttackListeners(game);
}

function addPlayAgainListener() {
  const playAgainButton = document.getElementById("play-again-button");

  playAgainButton.addEventListener("click", () => {
    renderStartGameUI();
    initDragDrop();
    initStartGameListener((selectedPositionsMap) => {
      const game = new Game(selectedPositionsMap);
      renderPlayerTurnUI(game.humanPlayer.gameboard.getBoardState(), game.computerPlayer.gameboard.getBoardState())
      addAttackListeners(game);
    });
  })
}