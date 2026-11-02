export const GRID_SIZE = 16
export const TICK_MS = 100
export const CELL_UNIT = 1.0

export const DIRECTIONS = {
  UP: { name: 'UP', x: 0, z: -1, angle: Math.PI },
  DOWN: { name: 'DOWN', x: 0, z: 1, angle: 0 },
  LEFT: { name: 'LEFT', x: -1, z: 0, angle: -Math.PI * 0.5 },
  RIGHT: { name: 'RIGHT', x: 1, z: 0, angle: Math.PI * 0.5 }
}
