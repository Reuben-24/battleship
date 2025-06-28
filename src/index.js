import "./styles/styles.css";
import { createBoard, createShipElements } from "./dom.js";
import { initDragDrop } from "./placeShipsUI";

const humanBoard = document.getElementById("human-board");
const shipContainer = document.querySelector(".ships-container");

createBoard(humanBoard);
createShipElements(shipContainer);
initDragDrop();
