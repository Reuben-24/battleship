# 🚢 Battleship – A Browser-Based Strategy Game

> A modern twist on the classic Battleship board game. Built entirely with JavaScript, HTML, and CSS — no frameworks, no fluff — just pure front-end firepower.

![Battleship Screenshot](./assets/screenshot.png)

---

## 🎯 Features

- 🧠 **AI Opponent** – Play against a simple, logical bot  
- 🛠️ **Drag & Drop Ship Placement** – Intuitive and smooth UX  
- 🔥 **Hit/Miss Effects** – Visual feedback for every move  
- 📱 **Responsive Design** – Play on desktop or mobile  
- 🎨 **Custom CSS Grid Board** – Built from scratch  
- 🧪 **Modular JavaScript** – Organized, testable codebase  

---

## 📸 Preview

> Live demo (hosted on Vercel):  
👉 [https://battleship-top.vercel.app](https://battleship-top.vercel.app)

![Game Preview](https://image.thum.io/get/https://battleship-top.vercel.app)

---

## 📦 Tech Stack

| Tech         | Purpose                          |
|--------------|----------------------------------|
| JavaScript   | Game logic & DOM interaction     |
| HTML5        | Structure                        |
| CSS3         | Layout & styling (CSS Grid FTW)  |
| Vite         | Super-fast dev server & build    |

---

## 🧩 Game Mechanics

- Board size: `10x10`
- Ship types:
  - Carrier (5 cells)
  - Battleship (4 cells)
  - Cruiser (3 cells)
  - Submarine (3 cells)
  - Destroyer (2 cells)
- Player turn system with AI responses
- Victory detection logic

---

## 🧠 Behind the Scenes

```js
// Sample game state logic
const gameState = {
  playerBoard: createEmptyBoard(),
  aiBoard: generateAIBoard(),
  currentPlayer: "player",
  gameOver: false
};
```

- Ships are placed using JavaScript arrays  
- Hit detection and sunk status tracked via ship objects  
- DOM updates handled with targeted class changes  

---

## 🛠️ Installation

```bash
git clone https://github.com/Reuben-24/battleship.git
cd battleship
npm install
npm run dev
```

> Or just open `index.html` directly in your browser for a quick offline test.

---

## 🧪 Tests

- Manual unit testing in-browser  
- Edge-case handling for:
  - Repeated clicks
  - Boundary ship placement
  - Game reset behavior

---

## 🙋‍♂️ About the Author

Made with ❤️ by [Reuben Faltiska](https://github.com/Reuben-24)  
→ Front-end developer with a focus on interactivity and clean UI design.

---

## 📁 Project Structure

```
├── src/
│   ├── index.html
│   ├── styles/
│   │   └── main.css
│   ├── js/
│   │   ├── game.js
│   │   ├── board.js
│   │   └── ai.js
├── assets/
│   └── screenshot.png
└── README.md
```

---

## 🌊 Future Improvements

- 💬 Sound effects for hits/misses  
- 🤖 Smarter AI (randomness + strategy)  
- 📊 Scoreboard and game history  
- 🧑‍🤝‍🧑 2-player mode (local or online)  

---

## 📜 License

MIT © [Reuben-24](https://github.com/Reuben-24)

---

> *Ready, aim... FIRE!* 💥  
> Dive into the code, or play the game live now.
