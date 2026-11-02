import { store } from './core/store.js'
import { SimEngine } from './sim/engine.js'
import { DioramaScene } from './view/scene.js'
import { DioramaCamera } from './view/camera.js'
import { DioramaPedestal } from './view/diorama.js'
import { SnakeMesh } from './view/snake-mesh.js'
import { FoodMesh } from './view/food-mesh.js'

function bootstrap() {
  const container = document.getElementById('canvas-container')
  if (!container) return

  // HUD elements
  const scoreVal = document.getElementById('score-val')
  const bestVal = document.getElementById('best-val')
  const gridVal = document.getElementById('grid-val')
  const turntableBtn = document.getElementById('btn-turntable')

  store.subscribe('score', (val) => {
    if (scoreVal) scoreVal.textContent = String(val).padStart(5, '0')
  })
  store.subscribe('highScore', (val) => {
    if (bestVal) bestVal.textContent = String(val).padStart(5, '0')
  })
  store.subscribe('gridSize', (val) => {
    if (gridVal) gridVal.textContent = `${val}x${val}`
  })

  turntableBtn?.addEventListener('click', () => {
    const nextState = !store.get('turntableActive')
    store.set('turntableActive', nextState)
    turntableBtn.textContent = nextState ? 'PAUSE ORBIT' : 'RESUME ORBIT'
  })

  // 3D Scene and Simulation
  const scene = new DioramaScene(container)
  const camera = new DioramaCamera(container)
  new DioramaPedestal(scene.scene)
  const snakeMesh = new SnakeMesh(scene.scene)
  const foodMesh = new FoodMesh(scene.scene)
  const engine = new SimEngine()

  engine.start()

  let lastTime = performance.now()

  function animate(now) {
    requestAnimationFrame(animate)
    const delta = Math.min((now - lastTime) / 1000, 0.1)
    lastTime = now

    camera.update(delta)

    const alpha = engine.getAlpha()
    snakeMesh.update(engine.snake, engine.previousSnake, alpha, engine.dir)
    foodMesh.update(engine.food, delta)

    scene.render(camera.camera)
  }

  requestAnimationFrame(animate)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap)
} else {
  bootstrap()
}
