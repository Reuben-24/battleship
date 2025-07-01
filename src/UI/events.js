import { getSelectedPositionsMap } from "./dom.js";
import { validateHumanShipPlacements } from "../gameLogic/strategies.js";
export { initStartGameListener };

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