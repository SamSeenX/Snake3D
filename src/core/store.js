import { eventBus } from './event-bus.js'

class Store {
  constructor() {
    let savedHi = 0
    try {
      savedHi = parseInt(localStorage.getItem('snake3d_hi_score') || '0', 10)
    } catch {
      savedHi = 0
    }

    this.state = {
      score: 0,
      highScore: savedHi,
      gridSize: 16,
      turntableActive: true
    }
    this.subscribers = new Map()
  }

  get(key) {
    return this.state[key]
  }

  set(key, value) {
    if (this.state[key] === value) return
    this.state[key] = value

    if (key === 'highScore') {
      try {
        localStorage.setItem('snake3d_hi_score', String(value))
      } catch {
        // Safe localStorage degradation
      }
    }

    const callbacks = this.subscribers.get(key)
    if (callbacks) callbacks.forEach((fn) => fn(value))
    eventBus.emit(`state:${key}`, value)
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key).add(callback)
    callback(this.state[key])
    return () => this.subscribers.get(key)?.delete(callback)
  }
}

export const store = new Store()
