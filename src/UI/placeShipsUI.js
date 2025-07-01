export { initDragDrop };

function initDragDrop() {
  // Add drag event listener for each ship to store ship data
  const ships = document.querySelectorAll(".ship");

  ships.forEach((ship) => {
    ship.addEventListener("dragstart", (event) => {
      if (ship.style.visibility === "hidden") return;
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

      // Check if the ship can be placed
      if (canPlaceShip(size, startX, startY, orientation)) {
        placeShipOnBoard(type, size, startX, startY, orientation);
        hideShipInShipContainer(type);
      } else {
        console.warn("Cannot place ship: space is occupied or out of bounds.");
        // Optionally provide user feedback
      }
    });
  });
}


function rotationHandlerFactory(type, size, startX, startY, orientation) {
  return function rotationHandler() {
    const newOrientation = orientation === "horizontal" ? "vertical" : "horizontal";

    // Temporarily remove the ship before checking new orientation
    removeShipFromBoard(size, startX, startY, orientation);

    // Check if ship fits with new orientation
    if (!canPlaceShip(size, startX, startY, newOrientation)) {
      // If not, re-place it in original orientation
      placeShipOnBoard(type, size, startX, startY, orientation);
      return;
    }

    // Place ship in new orientation
    placeShipOnBoard(type, size, startX, startY, newOrientation);
  };
}


function removeShipFromBoard(size, startX, startY, orientation) {
  for (let i = 0; i < size; i++) {
    // Get the coordinates of current cell
    const targetX = orientation === "horizontal" ? startX + i : startX;
    const targetY = orientation === "vertical" ? startY + i : startY;

    // Select this cell
    const cell = document.querySelector(
      `.cell[data-x="${targetX}"][data-y="${targetY}"]`,
    );

    // Remove shipType data value (removes styling)
    if (cell) {
      // ❗ Remove the click listener if it exists
      if (cell.rotationHandler) {
        cell.removeEventListener("click", cell.rotationHandler);
        delete cell.rotationHandler;
      }

      // Remove shipType data
      cell.removeAttribute("data-ship");
    } else {
      console.warn(`Cell at (${targetX}, ${targetY}) not found.`);
    }
  }
}


function placeShipOnBoard(type, size, startX, startY, orientation) {
  for (let i = 0; i < size; i++) {
    // Get the coordinates of current cell
    const targetX = orientation === "horizontal" ? startX + i : startX;
    const targetY = orientation === "vertical" ? startY + i : startY;

    // Select this cell
    const cell = document.querySelector(
      `.cell[data-x="${targetX}"][data-y="${targetY}"]`,
    );

    if (cell) {
      // Remove previous listener if exists
      if (cell.rotationHandler) {
        cell.removeEventListener("click", cell.rotationHandler);
      }

      // Create and add new listener
      const handler = rotationHandlerFactory(type, size, startX, startY, orientation);
      cell.addEventListener("click", handler);

      // Store handler ref for future removal
      cell.rotationHandler = handler;

      cell.dataset.ship = type;
    }
  }
}


function hideShipInShipContainer(type) {
  // Change visibility to hidden to hide in display
  const shipToRemove = document.getElementById(type);
  shipToRemove.style.visibility = "hidden";
}


function canPlaceShip(size, startX, startY, orientation) {
  const boardSize = 10;

  for (let i = 0; i < size; i++) {
    const targetX = orientation === "horizontal" ? startX + i : startX;
    const targetY = orientation === "vertical" ? startY + i : startY;

    if (targetX < 0 || targetX >= boardSize || targetY < 0 || targetY >= boardSize) {
      return false;
    }

    const cell = document.querySelector(
      `.cell[data-x="${targetX}"][data-y="${targetY}"]`
    );

    // Check cell existence and occupancy
    if (!cell || cell.dataset.ship) {
      return false;
    }
  }
  return true;
}