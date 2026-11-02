import { DIRECTIONS } from './constants.js'

function bfs(start, goal, obstacles, size) {
  const queue = [{ x: start.x, z: start.z, path: [] }]
  const visited = new Set([`${start.x},${start.z}`])

  for (let i = 0; i < obstacles.length; i++) {
    visited.add(`${obstacles[i].x},${obstacles[i].z}`)
  }

  while (queue.length > 0) {
    const cur = queue.shift()
    if (cur.x === goal.x && cur.z === goal.z) {
      return cur.path
    }

    const neighbors = [
      { x: cur.x + 1, z: cur.z, d: 'RIGHT' },
      { x: cur.x - 1, z: cur.z, d: 'LEFT' },
      { x: cur.x, z: cur.z + 1, d: 'DOWN' },
      { x: cur.x, z: cur.z - 1, d: 'UP' }
    ]

    for (let n = 0; n < neighbors.length; n++) {
      const nb = neighbors[n]
      const key = `${nb.x},${nb.z}`
      if (nb.x >= 0 && nb.x < size && nb.z >= 0 && nb.z < size && !visited.has(key)) {
        visited.add(key)
        queue.push({ x: nb.x, z: nb.z, path: [...cur.path, nb.d] })
      }
    }
  }
  return null
}

function floodCount(start, obstacles, size) {
  let count = 0
  const queue = [start]
  const visited = new Set([`${start.x},${start.z}`])
  for (let i = 0; i < obstacles.length; i++) {
    visited.add(`${obstacles[i].x},${obstacles[i].z}`)
  }

  while (queue.length > 0) {
    const cur = queue.shift()
    count++
    const nbs = [
      { x: cur.x + 1, z: cur.z },
      { x: cur.x - 1, z: cur.z },
      { x: cur.x, z: cur.z + 1 },
      { x: cur.x, z: cur.z - 1 }
    ]
    for (let j = 0; j < nbs.length; j++) {
      const p = nbs[j]
      const k = `${p.x},${p.z}`
      if (p.x >= 0 && p.x < size && p.z >= 0 && p.z < size && !visited.has(k)) {
        visited.add(k)
        queue.push(p)
      }
    }
  }
  return count
}

export function computeNextMove(snake, food, currentDir, size) {
  const head = snake[0]
  const nextTickObstacles = snake.slice(0, snake.length - 1)
  const tail = snake[snake.length - 1]

  const bufferSegments = Math.min(2, Math.max(0, snake.length - 4))
  const phantomObstacles = bufferSegments > 0 ? snake.slice(0, snake.length) : nextTickObstacles

  const pathToFood = bfs(head, food, phantomObstacles, size) ||
                     bfs(head, food, nextTickObstacles, size)

  if (pathToFood && pathToFood.length > 0) {
    const simSnake = snake.map((s) => ({ ...s }))
    for (let step = 0; step < pathToFood.length; step++) {
      const dName = pathToFood[step]
      const dirOffset = DIRECTIONS[dName]
      const nHead = { x: simSnake[0].x + dirOffset.x, z: simSnake[0].z + dirOffset.z }
      simSnake.unshift(nHead)

      const eats = (nHead.x === food.x && nHead.z === food.z)
      if (!eats) {
        simSnake.pop()
      }
    }

    const simHead = simSnake[0]
    const targetTailIdx = Math.max(0, simSnake.length - 1 - bufferSegments)
    const simTargetTail = simSnake[targetTailIdx]
    const simObstacles = simSnake.slice(0, simSnake.length - 1)
    const escapeToTail = bfs(simHead, simTargetTail, simObstacles, size) ||
                         bfs(simHead, simSnake[simSnake.length - 1], simObstacles, size)
    const room = floodCount(simHead, simObstacles, size)

    if (escapeToTail || room >= Math.max(8, Math.floor(snake.length * 0.4))) {
      return pathToFood[0]
    }
  }

  const validMoves = Object.values(DIRECTIONS)
  let bestMove = null
  let maxSpace = -1

  for (let m = 0; m < validMoves.length; m++) {
    const vm = validMoves[m]
    if (vm.x === -currentDir.x && vm.z === -currentDir.z) continue

    const nextPos = { x: head.x + vm.x, z: head.z + vm.z }
    if (nextPos.x < 0 || nextPos.x >= size || nextPos.z < 0 || nextPos.z >= size) continue

    const willEat = (nextPos.x === food.x && nextPos.z === food.z)
    const collisionLimit = willEat ? snake.length : snake.length - 1
    let collision = false
    for (let b = 0; b < collisionLimit; b++) {
      if (snake[b].x === nextPos.x && snake[b].z === nextPos.z) {
        collision = true
        break
      }
    }
    if (collision) continue

    const openTiles = floodCount(nextPos, nextTickObstacles, size)
    const canSeeTail = bfs(nextPos, tail, nextTickObstacles, size) ? 50 : 0
    const distToTail = Math.abs(nextPos.x - tail.x) + Math.abs(nextPos.z - tail.z)
    let tailBufferBonus = (distToTail >= 2 && distToTail <= 5) ? 25 : 0
    if (distToTail <= 1 && openTiles > 10) {
      tailBufferBonus -= 20
    }

    const scoreWeight = openTiles + canSeeTail + tailBufferBonus
    if (scoreWeight > maxSpace) {
      maxSpace = scoreWeight
      bestMove = vm.name
    }
  }

  return bestMove || 'RIGHT'
}
