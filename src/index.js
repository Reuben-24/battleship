import "./styles.css";
import { renderStartGameUI } from "./UI/dom.js";
import { initDragDrop } from "./UI/placeShipsUI.js";
import { initStartGameListener } from "./UI/events.js";

renderStartGameUI();
initDragDrop();
initStartGameListener();
