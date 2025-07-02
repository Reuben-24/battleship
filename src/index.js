import "./styles.css";
import { renderStartGameUI, renderPlayerTurnUI } from "./UI/dom.js";
import { initDragDrop } from "./UI/placeShipsUI.js";
import { initStartGameListener, addAttackListeners } from "./UI/events.js";
import Game from "./gameLogic/game.js";

renderStartGameUI();
initDragDrop();
initStartGameListener((selectedPositionsMap) => {
  const game = new Game(selectedPositionsMap);
  renderPlayerTurnUI(game.humanPlayer.gameboard.getBoardState(), game.computerPlayer.gameboard.getBoardState())
  addAttackListeners(game);
});



  // Players turn first - tell player to click square on opponents gameboard to take their turn
  // Valid square click will trigger
  // Get selectedPosition from UI
  //playHumanTurn(selectedPosition);
  //if (game.getWinner) {
    //break;
    // Logic at the bottom to reset the game/UI logic
  //}
//}

// display winner function(game.getWinner)
// Include play again button - on click:
// Reset backend?
// Reset UI
// repeat initUI to start back at top


