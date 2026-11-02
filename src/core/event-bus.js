class EventBus {
  constructor() {
    this.listeners = new Map()
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.delete(callback)
      if (handlers.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  emit(event, data) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach((callback) => callback(data))
    }
  }
}

export const eventBus = new EventBus()
