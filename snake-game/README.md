# Snake Game

Classic Snake built with React and Vite.

## Features

- Grid-based snake movement
- Food spawning and snake growth
- Score tracking
- Game-over detection for wall and self collisions
- Restart and pause controls
- Adjustable speed with `Slow`, `Normal`, and `Fast`
- Keyboard and on-screen controls

## Run

From the repo root:

```bash
npm install
npm run dev
```

Or run this workspace directly:

```bash
npm run dev -w snake-game
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173/`.

## Controls

- `Arrow keys` or `WASD`: move the snake
- `Space`: pause or resume
- `Restart`: start a new game
- `Speed`: switch between `Slow`, `Normal`, and `Fast`

## Project Files

- `src/App.jsx`: main game screen, controls, and reducer wiring
- `src/snake/logic.js`: pure snake game logic for movement, collisions, growth, and food placement
- `src/App.css`: game layout and component styles
- `src/index.css`: shared app-level styles

## Manual Verification

- Snake moves correctly in all four directions
- Reverse direction is blocked
- Food increases score and length
- Wall collisions end the game
- Self collisions end the game
- Pause and restart work as expected
- Speed changes affect tick timing immediately
