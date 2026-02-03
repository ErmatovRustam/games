import { useEffect, useMemo, useReducer } from 'react'
import './App.css'
import {
  createInitialState,
  GRID_SIZE,
  isOppositeDirection,
  moveSnake,
} from './snake/logic'

const SPEEDS = [
  { id: 'slow', label: 'Slow', ms: 200 },
  { id: 'normal', label: 'Normal', ms: 140 },
  { id: 'fast', label: 'Fast', ms: 90 },
]

function reducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      if (!state.running || state.gameOver) {
        return state
      }

      const result = moveSnake(state, GRID_SIZE, Math.random)
      if (result.gameOver) {
        return {
          ...state,
          ...result,
          running: false,
          gameOver: true,
        }
      }

      return {
        ...state,
        ...result,
        score: state.score + (result.didEat ? 1 : 0),
      }
    }
    case 'CHANGE_DIRECTION': {
      if (isOppositeDirection(state.direction, action.direction)) {
        return state
      }

      return {
        ...state,
        direction: action.direction,
      }
    }
    case 'TOGGLE_PAUSE': {
      if (state.gameOver) {
        return state
      }

      return {
        ...state,
        running: !state.running,
      }
    }
    case 'RESTART': {
      return createInitialState(GRID_SIZE, Math.random)
    }
    case 'SET_SPEED': {
      return {
        ...state,
        speedId: action.speedId,
      }
    }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(
    reducer,
    null,
    () => createInitialState(GRID_SIZE, Math.random),
  )

  const speedMs =
    SPEEDS.find((speed) => speed.id === state.speedId)?.ms ?? SPEEDS[1].ms

  useEffect(() => {
    if (!state.running || state.gameOver) {
      return undefined
    }

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, speedMs)

    return () => clearInterval(interval)
  }, [state.running, state.gameOver, speedMs])

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toLowerCase()
      if (
        key === 'arrowup' ||
        key === 'arrowdown' ||
        key === 'arrowleft' ||
        key === 'arrowright' ||
        key === 'w' ||
        key === 'a' ||
        key === 's' ||
        key === 'd' ||
        key === ' '
      ) {
        event.preventDefault()
      }

      if (key === ' ') {
        dispatch({ type: 'TOGGLE_PAUSE' })
        return
      }

      const directionByKey = {
        arrowup: 'UP',
        w: 'UP',
        arrowdown: 'DOWN',
        s: 'DOWN',
        arrowleft: 'LEFT',
        a: 'LEFT',
        arrowright: 'RIGHT',
        d: 'RIGHT',
      }

      const nextDirection = directionByKey[key]
      if (nextDirection) {
        dispatch({ type: 'CHANGE_DIRECTION', direction: nextDirection })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const snakeSet = useMemo(() => {
    const set = new Set()
    state.snake.forEach((segment) => {
      set.add(`${segment.x}-${segment.y}`)
    })
    return set
  }, [state.snake])

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Snake</h1>
          <p className="subtitle">Use arrow keys or WASD. Space to pause.</p>
        </div>
        <div className="score">
          <span>Score</span>
          <strong>{state.score}</strong>
        </div>
      </header>

      <div
        className="board"
        style={{ '--grid-size': GRID_SIZE }}
        aria-label="Snake board"
        role="grid"
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE
          const y = Math.floor(index / GRID_SIZE)
          const key = `${x}-${y}`
          const isSnake = snakeSet.has(key)
          const isHead =
            state.snake.length > 0 &&
            state.snake[0].x === x &&
            state.snake[0].y === y
          const isFood = state.food && state.food.x === x && state.food.y === y

          const className = [
            'cell',
            isSnake ? 'snake' : '',
            isHead ? 'head' : '',
            isFood ? 'food' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return <div key={key} className={className} role="gridcell" />
        })}
      </div>

      <div className="controls">
        <button onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}>
          {state.running ? 'Pause' : 'Resume'}
        </button>
        <button onClick={() => dispatch({ type: 'RESTART' })}>Restart</button>
        <div className="speed">
          <span>Speed</span>
          <div className="speed-buttons">
            {SPEEDS.map((speed) => (
              <button
                key={speed.id}
                className={state.speedId === speed.id ? 'active' : ''}
                onClick={() =>
                  dispatch({ type: 'SET_SPEED', speedId: speed.id })
                }
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.gameOver ? (
        <p className="status">
          {state.result === 'won' ? 'You win!' : 'Game over.'} Press Restart to
          play again.
        </p>
      ) : null}

      <div className="dpad" aria-label="On-screen controls">
        <span />
        <button
          onClick={() =>
            dispatch({ type: 'CHANGE_DIRECTION', direction: 'UP' })
          }
        >
          ▲
        </button>
        <span />
        <button
          onClick={() =>
            dispatch({ type: 'CHANGE_DIRECTION', direction: 'LEFT' })
          }
        >
          ◀
        </button>
        <button onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}>
          {state.running ? '⏸' : '▶'}
        </button>
        <button
          onClick={() =>
            dispatch({ type: 'CHANGE_DIRECTION', direction: 'RIGHT' })
          }
        >
          ▶
        </button>
        <span />
        <button
          onClick={() =>
            dispatch({ type: 'CHANGE_DIRECTION', direction: 'DOWN' })
          }
        >
          ▼
        </button>
        <span />
      </div>

      <div className="legend">
        <span className="legend-item">
          <span className="legend-box snake" />
          Snake
        </span>
        <span className="legend-item">
          <span className="legend-box food" />
          Food
        </span>
      </div>
    </div>
  )
}

export default App
