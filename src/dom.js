export { createBoard, createShipElements };

function createBoard(boardElement, size = 10) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.occupied = "false";
      cell.dataset.isAttacked = "false";
      boardElement.appendChild(cell);
    }
  }
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

    // Optionally: Add visual cells inside each ship
    for (let i = 0; i < size; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      ship.appendChild(cell);
    }

    // Append to wrapper and container
    wrapper.appendChild(label);
    wrapper.appendChild(ship);
    container.appendChild(wrapper);
  });
}
