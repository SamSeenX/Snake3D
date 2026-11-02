import * as THREE from 'three'
import { store } from '../core/store.js'

export class DioramaCamera {
  constructor(container) {
    this.container = container
    this.camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )

    this.radius = 26
    this.theta = Math.PI * 0.25
    this.phi = Math.PI * 0.33
    this.isDragging = false
    this.prevPointer = { x: 0, y: 0 }

    this.updatePosition()
    this.bindEvents()
  }

  updatePosition() {
    this.camera.position.x = this.radius * Math.sin(this.phi) * Math.sin(this.theta)
    this.camera.position.y = this.radius * Math.cos(this.phi)
    this.camera.position.z = this.radius * Math.sin(this.phi) * Math.cos(this.theta)
    this.camera.lookAt(0, 0, 0)
  }

  update(delta) {
    if (store.get('turntableActive') && !this.isDragging) {
      this.theta += delta * 0.12
      this.updatePosition()
    }
  }

  bindEvents() {
    const el = this.container

    el.addEventListener('pointerdown', (e) => {
      this.isDragging = true
      this.prevPointer = { x: e.clientX, y: e.clientY }
    })

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return
      const dx = e.clientX - this.prevPointer.x
      const dy = e.clientY - this.prevPointer.y
      this.prevPointer = { x: e.clientX, y: e.clientY }

      this.theta -= dx * 0.008
      this.phi = Math.max(0.15, Math.min(Math.PI * 0.48, this.phi - dy * 0.008))
      this.updatePosition()
    })

    window.addEventListener('pointerup', () => {
      this.isDragging = false
    })

    el.addEventListener('wheel', (e) => {
      e.preventDefault()
      this.radius = Math.max(16, Math.min(45, this.radius + e.deltaY * 0.03))
      this.updatePosition()
    }, { passive: false })

    window.addEventListener('resize', () => {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight
      this.camera.updateProjectionMatrix()
    })
  }
}
