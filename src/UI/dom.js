export { renderStartGameUI, getSelectedPositionsMap };

function getSelectedPositionsMap() {
  const cells = document.querySelectorAll("#human-board-container .cell");

  const selectedPositionsMap = {
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: [],
  };

  cells.forEach(cell => {
    const type = cell.dataset.shipType;
    if (type in selectedPositionsMap) {
      selectedPositionsMap[type].push([
        parseInt(cell.dataset.x),
        parseInt(cell.dataset.y),
      ]);
    }
  });

  return selectedPositionsMap;
}

function renderStartGameUI() {
  const humanBoardContainer = document.getElementById("human-board-container");
  const shipsContainer = document.getElementById("ships-container");
  const topContentContainer = document.getElementById("top-content-container");

  createStartGameDisplay(topContentContainer);
  createBoard(humanBoardContainer, "Your Board");
  createShipElements(shipsContainer);
}

function createStartGameDisplay(container) {
  // Create display
  const display = document.createElement("div");
  display.id = "start-game-display";
  display.textContent = "Drag and drop ships into the gameboard and press 'Start Game' when you are ready to begin.";

  // Create button
  const button = document.createElement("button");
  button.id = "start-game-button";
  button.textContent = "Start Game";

  // Append to container
  container.appendChild(display);
  container.appendChild(button);
}

function createBoard(container, headingText, size = 10) {
  const board = document.createElement("div");
  board.classList.add("board");
  const heading = document.createElement("h2");
  heading.classList.add("board-heading")
  heading.textContent = headingText;
  container.appendChild(heading);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.occupied = "false";
      cell.dataset.isAttacked = "false";
      board.appendChild(cell);
    }
  }
  container.appendChild(board);
}

const shipTypes = [
  { type: "carrier", size: 5 },
  { type: "battleship", size: 4 },
  { type: "cruiser", size: 3 },
  { type: "submarine", size: 3 },
  { type: "destroyer", size: 2 },
];

function createShipElements(container) {
  // Clear existing content
  container.innerHTML = "";

  const heading = document.createElement("h2");
  heading.id = "ships-container-heading";
  heading.textContent = "Your Ships";
  container.appendChild(heading);

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
    ship.setAttribute("data-isplaced", "false");
    ship.setAttribute("id", type);
    ship.setAttribute("draggable", "true");

    // Append to wrapper and container
    wrapper.appendChild(label);
    wrapper.appendChild(ship);
    container.appendChild(wrapper);
  });
}
