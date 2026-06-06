# Games

This repository is organized as an `npm` workspace so multiple small games can live in one place without duplicating dependencies.

## Structure

- `snake-game/`: React + Vite implementation of the classic Snake game.
- `node_modules/`: Shared workspace dependencies installed once at the repo root.

## Getting Started

Install dependencies from the repo root:

```bash
npm install
```

Start the Snake game in development mode:

```bash
npm run dev
```

The root scripts forward to the `snake-game` workspace, so you can also run:

```bash
npm run build
npm run lint
npm run preview
```

## Workspace Notes

- New games can be added as sibling folders beside `snake-game/`.
- Each game can have its own `package.json` while still sharing the root `node_modules`.
- To run a specific workspace directly, use `npm run <script> -w <workspace-name>`.

Example:

```bash
npm run dev -w snake-game
```
