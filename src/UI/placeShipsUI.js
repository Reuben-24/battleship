export { initDragDrop };

function initDragDrop() {
  // Add drag event listener for each ship to store ship data
  const ships = document.querySelectorAll(".ship");

  ships.forEach((ship) => {
    ship.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("type", ship.dataset.type);
      event.dataTransfer.setData("size", ship.dataset.size);
      event.dataTransfer.setData("orientation", ship.dataset.orientation);
    });
  });

  // Handle drag events over each cell on the gameboard
  const cells = document.querySelectorAll("#human-board-container .cell");

  cells.forEach((cell) => {
    // Prevent default dragover behaviour to allow drop
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    cell.addEventListener("drop", (e) => {
      // Again prevent default drop behaviour to allow drop
      e.preventDefault();

      // Store variables for all data
      const type = e.dataTransfer.getData("type");
      const size = parseInt(e.dataTransfer.getData("size"));
      const startX = parseInt(cell.dataset.x);
      const startY = parseInt(cell.dataset.y);
      const orientation = e.dataTransfer.getData("orientation");

      // Visually place the ship on the board
      placeShipOnBoard(type, size, startX, startY, orientation);

      // Visually remove ship from ship container (handled in css)
      removeShipFromShipContainer(type);
    });
  });
}

function removeShipFromShipContainer(type) {
  const shipToRemove = document.getElementById(type);
  shipToRemove.dataset.isplaced = "true";
  console.log("Removing ship:", type);
  console.log("Found ship element:", shipToRemove);
}

function placeShipOnBoard(type, size, startX, startY, orientation) {
  // For each cell that the ship will occupy
  for (let i = 0; i < size; i++) {
    // Get the coordinates of the cell to display the ship
    const targetX = orientation === "horizontal" ? startX + i : startX;
    const targetY = orientation === "vertical" ? startY + i : startY;

    // Select this cell
    const cell = document.querySelector(
      `.cell[data-x="${targetX}"][data-y="${targetY}"]`,
    );

    // Adjust data value to allow styling
    if (cell) {
      cell.dataset.shipType = type;
    } else {
      console.error("Invalid drop position");
    }
  }
}
