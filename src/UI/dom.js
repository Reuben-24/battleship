export {
  renderStartGameUI,
  getSelectedPositionsMap,
  renderPlayerTurnUI,
  renderHumanResultUI,
  renderComputerResultUI,
  renderGameOverUI,
};

function getSelectedPositionsMap() {
  const cells = document.querySelectorAll("#human-board-container .cell");

  const selectedPositionsMap = {
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: [],
  };

  cells.forEach((cell) => {
    const type = cell.dataset.ship;
    if (type in selectedPositionsMap) {
      selectedPositionsMap[type].push([
        parseInt(cell.dataset.x),
        parseInt(cell.dataset.y),
      ]);
    }
  });

  return selectedPositionsMap;
}

function renderGameOverUI(winningPlayer) {
  const topContentContainer = document.getElementById("top-content-container");

  // Clear out previous renderings
  topContentContainer.replaceChildren();
  // Render game over display
  renderGameOverDisplay(winningPlayer, topContentContainer);
}

function renderGameOverDisplay(winningPlayer, container) {
  // Create display
  const display = document.createElement("div");
  display.id = "game-over-display";

  if (winningPlayer.type === "human") {
    display.textContent = "You Win! Click 'Play Again' to start a new game";
  } else {
    display.textContent = "You Lose! Click 'Play Again' to start a new game";
  }

  // Create button
  const button = document.createElement("button");
  button.id = "play-again-button";
  button.textContent = "Play Again";

  // Append to container
  container.appendChild(display);
  container.appendChild(button);
}

function renderComputerResultUI(result, humanBoardState, computerBoardState) {
  const topContentContainer = document.getElementById("top-content-container");
  const bottomContentContainer = document.getElementById(
    "bottom-content-container",
  );

  // Clear out previous renderings
  topContentContainer.replaceChildren();
  bottomContentContainer.replaceChildren();

  // Render result display
  renderComputerResultDisplay(result, topContentContainer);

  // Re-render boards with new results
  renderBoard(
    bottomContentContainer,
    "computer",
    "Opponent Board",
    computerBoardState,
  );
  renderBoard(bottomContentContainer, "human", "Your Board", humanBoardState);
}

function renderComputerResultDisplay(result, container) {
  // Create display
  const display = document.createElement("div");
  display.id = "computer-result-display";
  display.textContent = `Opponent ${result}! Click continue button to continue`;

  // Create button
  const button = document.createElement("button");
  button.id = "continue-button";
  button.textContent = "Continue";

  // Append to container
  container.appendChild(display);
  container.appendChild(button);
}

function renderHumanResultUI(result, humanBoardState, computerBoardState) {
  const topContentContainer = document.getElementById("top-content-container");
  const bottomContentContainer = document.getElementById(
    "bottom-content-container",
  );

  // Clear out previous renderings
  topContentContainer.replaceChildren();
  bottomContentContainer.replaceChildren();

  // Render result display
  renderHumanResultDisplay(result, topContentContainer);

  // Re-render boards with new results
  renderBoard(
    bottomContentContainer,
    "computer",
    "Opponent Board",
    computerBoardState,
  );
  renderBoard(bottomContentContainer, "human", "Your Board", humanBoardState);
}

function renderHumanResultDisplay(result, container) {
  // Create display
  const display = document.createElement("div");
  display.id = "human-result-display";
  display.textContent = `${result.toUpperCase()}! Click continue button to continue`;

  // Create button
  const button = document.createElement("button");
  button.id = "continue-button";
  button.textContent = "Continue";

  // Append to container
  container.appendChild(display);
  container.appendChild(button);
}

function renderStartGameUI() {
  const topContentContainer = document.getElementById("top-content-container");
  const bottomContentContainer = document.getElementById(
    "bottom-content-container",
  );

  // Clear out previous renderings
  topContentContainer.replaceChildren();
  bottomContentContainer.replaceChildren();

  createStartGameDisplay(topContentContainer);
  renderBoard(bottomContentContainer, "human", "Your Board");
  createShipsContainer(bottomContentContainer);
}

function renderPlayerTurnUI(humanBoardState, computerBoardState) {
  const topContentContainer = document.getElementById("top-content-container");
  const bottomContentContainer = document.getElementById(
    "bottom-content-container",
  );

  // Clear out previous renderings
  topContentContainer.replaceChildren();
  bottomContentContainer.replaceChildren();

  // Render display
  renderPlayerTurnDisplay(topContentContainer);

  // Render computer board
  renderBoard(
    bottomContentContainer,
    "computer",
    "Opponent Board",
    computerBoardState,
  );

  // Render human board
  renderBoard(bottomContentContainer, "human", "Your Board", humanBoardState);

  // Add class to unattacked computer board cells to make them clickable in css
  const computerBoardCells = document.querySelectorAll(
    "#computer-board-container .cell",
  );
  computerBoardCells.forEach((cell) => {
    if (cell.dataset.wasHit === "false" && cell.dataset.wasMissed === "false") {
      cell.classList.add("clickable");
    }
  });
}

function renderPlayerTurnDisplay(container) {
  // Create display
  const display = document.createElement("div");
  display.id = "player-turn-display";
  display.textContent = "Click a square on the opponents board to attack.";

  // Append to container
  container.appendChild(display);
}

function createStartGameDisplay(container) {
  // Create display
  const display = document.createElement("div");
  display.id = "start-game-display";
  display.textContent =
    "Drag and drop ships into the gameboard. Click a ship to rotate if there is space. Refresh the page to reset the board. Press 'Start Game' when you are ready to begin.";

  // Create button
  const button = document.createElement("button");
  button.id = "start-game-button";
  button.textContent = "Start Game";

  // Append to container
  container.appendChild(display);
  container.appendChild(button);
}

function renderBoard(
  container,
  type,
  headingText,
  boardState = null,
  size = 10,
) {
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board-container");
  boardContainer.id = `${type}-board-container`;

  const board = document.createElement("div");
  board.classList.add("board");

  const heading = document.createElement("h2");
  heading.classList.add("board-heading");
  heading.textContent = headingText;
  boardContainer.appendChild(heading);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cellState = boardState ? boardState[y][x] : {};

      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (cellState.ship && type === "human") {
        cell.dataset.ship = cellState.ship.type;
      }

      cell.dataset.wasHit = cellState.wasHit ? "true" : "false";
      cell.dataset.wasMissed =
        cellState.isAttacked && !cellState.wasHit ? "true" : "false";

      board.appendChild(cell);
    }
  }
  boardContainer.appendChild(board);
  container.appendChild(boardContainer);
}

const shipTypes = [
  { type: "carrier", size: 5 },
  { type: "battleship", size: 4 },
  { type: "cruiser", size: 3 },
  { type: "submarine", size: 3 },
  { type: "destroyer", size: 2 },
];

function createShipsContainer(container) {
  const shipsContainer = document.createElement("div");
  shipsContainer.id = "ships-container";

  const heading = document.createElement("h2");
  heading.id = "ships-container-heading";
  heading.textContent = "Your Ships";
  shipsContainer.appendChild(heading);

  shipTypes.forEach(({ type, size }) => {
    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("ship-wrapper");

    // Ship label
    const label = document.createElement("div");
    label.classList.add("ship-label");
    label.textContent = type.charAt(0).toUpperCase() + type.slice(1);

    // Ship div
    const ship = document.createElement("div");
    ship.classList.add("ship");
    ship.setAttribute("data-type", type);
    ship.setAttribute("data-size", size);
    ship.setAttribute("data-orientation", "horizontal");
    ship.setAttribute("id", type);
    ship.setAttribute("draggable", "true");

    // Append to wrapper and container
    wrapper.appendChild(label);
    wrapper.appendChild(ship);
    shipsContainer.appendChild(wrapper);
    container.appendChild(shipsContainer);
  });
}
