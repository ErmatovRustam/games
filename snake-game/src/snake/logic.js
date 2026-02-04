export const GRID_SIZE = 20

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

const OPPOSITE = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

export function isOppositeDirection(current, next) {
  return OPPOSITE[current] === next
}

export function createInitialState(gridSize = GRID_SIZE, random = Math.random) {
  const center = Math.floor(gridSize / 2)
  const snake = [
    { x: center + 1, y: center },
    { x: center, y: center },
    { x: center - 1, y: center },
  ]

  return {
    snake,
    direction: 'RIGHT',
    food: placeFood(snake, gridSize, random),
    score: 0,
    running: true,
    gameOver: false,
    result: 'playing',
    speedId: 'normal',
  }
}

export function placeFood(snake, gridSize, random = Math.random) {
  const maxCells = gridSize * gridSize
  if (snake.length >= maxCells) {
    return null
  }

  const occupied = new Set()
  snake.forEach((segment) => {
    occupied.add(`${segment.x}-${segment.y}`)
  })

  const maxAttempts = maxCells * 2
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const x = Math.floor(random() * gridSize)
    const y = Math.floor(random() * gridSize)
    const key = `${x}-${y}`
    if (!occupied.has(key)) {
      return { x, y }
    }
  }

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x}-${y}`
      if (!occupied.has(key)) {
        return { x, y }
      }
    }
  }

  return null
}

export function moveSnake(state, gridSize, random = Math.random) {
  const vector = DIRECTIONS[state.direction]
  const head = state.snake[0]
  const nextHead = {
    x: head.x + vector.x,
    y: head.y + vector.y,
  }

  const hitWall =
    nextHead.x < 0 ||
    nextHead.x >= gridSize ||
    nextHead.y < 0 ||
    nextHead.y >= gridSize

  if (hitWall) {
    return {
      snake: state.snake,
      food: state.food,
      didEat: false,
      gameOver: true,
      result: 'lost',
    }
  }

  const willEat =
    state.food && nextHead.x === state.food.x && nextHead.y === state.food.y

  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1)
  const hitSelf = bodyToCheck.some(
    (segment) => segment.x === nextHead.x && segment.y === nextHead.y,
  )

  if (hitSelf) {
    return {
      snake: state.snake,
      food: state.food,
      didEat: false,
      gameOver: true,
      result: 'lost',
    }
  }

  const nextSnake = [nextHead, ...state.snake]
  if (!willEat) {
    nextSnake.pop()
  }

  const nextFood = willEat
    ? placeFood(nextSnake, gridSize, random)
    : state.food

  if (willEat && nextFood === null) {
    return {
      snake: nextSnake,
      food: null,
      didEat: true,
      gameOver: true,
      result: 'won',
    }
  }

  return {
    snake: nextSnake,
    food: nextFood,
    didEat: willEat,
    gameOver: false,
    result: 'playing',
  }
}
