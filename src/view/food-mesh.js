import * as THREE from 'three'
import { GRID_SIZE, CELL_UNIT } from '../sim/constants.js'
import { eventBus } from '../core/event-bus.js'

export class FoodMesh {
  constructor(scene) {
    this.scene = scene
    this.offset = (GRID_SIZE * CELL_UNIT) / 2 - (CELL_UNIT / 2)
    this.elapsed = 0

    this.createApple()
    this.createSparkles()
    this.bindEvents()
  }

  createApple() {
    this.appleGroup = new THREE.Group()

    // Smooth spherical glossy apple
    const appleGeo = new THREE.SphereGeometry(0.38, 32, 28)
    const appleMat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      emissive: 0x33000d,
      roughness: 0.18,
      metalness: 0.15
    })
    const apple = new THREE.Mesh(appleGeo, appleMat)
    apple.castShadow = true
    this.appleGroup.add(apple)

    // Little brown stem
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.16, 8)
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x582f0e, roughness: 0.7 })
    const stem = new THREE.Mesh(stemGeo, stemMat)
    stem.position.y = 0.38
    stem.rotation.z = 0.15
    this.appleGroup.add(stem)

    // Cute green apple leaf
    const leafGeo = new THREE.SphereGeometry(0.09, 12, 10)
    leafGeo.scale(1.4, 0.3, 0.7)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x588157, roughness: 0.5 })
    const leaf = new THREE.Mesh(leafGeo, leafMat)
    leaf.position.set(0.08, 0.42, 0.02)
    leaf.rotation.z = -0.3
    this.appleGroup.add(leaf)

    this.scene.add(this.appleGroup)
  }

  createSparkles() {
    const pCount = 24
    const pGeo = new THREE.BufferGeometry()
    const pos = new Float32Array(pCount * 3)
    this.velocities = []

    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = 0
      pos[i * 3 + 1] = -100
      pos[i * 3 + 2] = 0
      this.velocities.push({ x: 0, y: 0, z: 0, life: 0 })
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 0.25,
      transparent: true,
      opacity: 0.95
    })
    this.sparkleSystem = new THREE.Points(pGeo, pMat)
    this.scene.add(this.sparkleSystem)
  }

  bindEvents() {
    eventBus.on('sim:eat', (pos) => this.triggerBurst(pos))
  }

  triggerBurst(pos) {
    const wx = pos.x * CELL_UNIT - this.offset
    const wz = pos.z * CELL_UNIT - this.offset
    const arr = this.sparkleSystem.geometry.attributes.position.array

    for (let i = 0; i < this.velocities.length; i++) {
      arr[i * 3] = wx
      arr[i * 3 + 1] = 0.6
      arr[i * 3 + 2] = wz
      this.velocities[i] = {
        x: (Math.random() - 0.5) * 3.5,
        y: Math.random() * 2.8 + 1.2,
        z: (Math.random() - 0.5) * 3.5,
        life: 1.0
      }
    }
    this.sparkleSystem.geometry.attributes.position.needsUpdate = true
  }

  update(food, delta) {
    this.elapsed += delta
    const wx = food.x * CELL_UNIT - this.offset
    const wz = food.z * CELL_UNIT - this.offset

    // Gentle floating bob and slow spin
    const bob = Math.sin(this.elapsed * 3.5) * 0.1
    this.appleGroup.position.set(wx, 0.52 + bob, wz)
    this.appleGroup.rotation.y += delta * 1.5

    // Sparkle physics
    const arr = this.sparkleSystem.geometry.attributes.position.array
    for (let i = 0; i < this.velocities.length; i++) {
      const v = this.velocities[i]
      if (v.life > 0) {
        v.life -= delta * 1.8
        v.y -= delta * 3.5
        arr[i * 3] += v.x * delta
        arr[i * 3 + 1] += v.y * delta
        arr[i * 3 + 2] += v.z * delta
      } else {
        arr[i * 3 + 1] = -100
      }
    }
    this.sparkleSystem.geometry.attributes.position.needsUpdate = true
  }
}
