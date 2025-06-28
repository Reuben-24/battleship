import Game from "./game.js";

// DOmContentLoaded -> initUI
// initUI
// Tell user to drag ships into game board and press button when ready to play
// Add Event listener to ready button, on button click:
// Get selectedPositionsMap from UI
const game = new Game(selectedPositionsMap);

while (true) {
  // Players turn first - tell player to click square on opponents gameboard to take their turn
  // Valid square click will trigger
  // Get selectedPosition from UI
  playHumanTurn(selectedPosition);
  if (game.getWinner) {
    break;
    // Logic at the bottom to reset the game/UI logic
  }
}

// display winner function(game.getWinner)
// Include play again button - on click:
// Reset backend?
// Reset UI
// repeat initUI to start back at top
