import { GRID_SIZE, TICK_MS, DIRECTIONS } from './constants.js'
import { computeNextMove } from './ai.js'
import { eventBus } from '../core/event-bus.js'
import { store } from '../core/store.js'

export class SimEngine {
  constructor() {
    this.size = GRID_SIZE
    this.snake = []
    this.previousSnake = []
    this.food = { x: 0, z: 0 }
    this.dir = DIRECTIONS.RIGHT
    this.lastTickTime = performance.now()
    this.timer = null

    this.init()
  }

  init() {
    const mid = Math.floor(this.size / 2)
    this.snake = [
      { x: mid, z: mid },
      { x: mid - 1, z: mid },
      { x: mid - 2, z: mid }
    ]
    this.previousSnake = this.snake.map((s) => ({ ...s }))
    this.dir = DIRECTIONS.RIGHT
    store.set('score', 0)

    this.spawnFood()
    this.lastTickTime = performance.now()
  }

  spawnFood() {
    const empty = []
    for (let z = 0; z < this.size; z++) {
      for (let x = 0; x < this.size; x++) {
        const occupied = this.snake.some((s) => s.x === x && s.z === z)
        if (!occupied) empty.push({ x, z })
      }
    }
    if (empty.length === 0) {
      this.init()
      return
    }
    this.food = empty[Math.floor(Math.random() * empty.length)]
  }

  start() {
    this.stop()
    this.timer = setInterval(() => this.step(), TICK_MS)
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  step() {
    this.previousSnake = this.snake.map((s) => ({ ...s }))
    const nextDirName = computeNextMove(this.snake, this.food, this.dir, this.size)
    this.dir = DIRECTIONS[nextDirName]

    const newHead = { x: this.snake[0].x + this.dir.x, z: this.snake[0].z + this.dir.z }

    // Collision check
    const willEat = (newHead.x === this.food.x && newHead.z === this.food.z)
    const outOfBounds = newHead.x < 0 || newHead.x >= this.size || newHead.z < 0 || newHead.z >= this.size
    const deathLimit = willEat ? this.snake.length : this.snake.length - 1
    let selfCollision = false

    for (let i = 0; i < deathLimit; i++) {
      if (this.snake[i].x === newHead.x && this.snake[i].z === newHead.z) {
        selfCollision = true
        break
      }
    }

    if (outOfBounds || selfCollision) {
      this.init()
      eventBus.emit('sim:restart')
      return
    }

    this.snake.unshift(newHead)

    if (willEat) {
      const score = store.get('score') + 10
      store.set('score', score)
      if (score > store.get('highScore')) {
        store.set('highScore', score)
      }
      eventBus.emit('sim:eat', { ...this.food })
      this.spawnFood()
    } else {
      this.snake.pop()
    }

    this.lastTickTime = performance.now()
    eventBus.emit('sim:tick')
  }

  getAlpha() {
    const elapsed = performance.now() - this.lastTickTime
    return Math.min(1.0, Math.max(0.0, elapsed / TICK_MS))
  }
}
