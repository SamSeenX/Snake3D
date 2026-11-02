import * as THREE from 'three'
import { GRID_SIZE, CELL_UNIT } from '../sim/constants.js'
import { createDragonHead, createDragonTailTuft } from './dragon-parts.js'

export class SnakeMesh {
  constructor(scene) {
    this.scene = scene
    this.offset = (GRID_SIZE * CELL_UNIT) / 2 - (CELL_UNIT / 2)
    this.currentRotationY = 0
    this.dummy = new THREE.Object3D()

    this.createBodyTube()
    this.createDorsalSpikes()

    this.headGroup = createDragonHead()
    this.scene.add(this.headGroup)

    this.tailGroup = createDragonTailTuft()
    this.scene.add(this.tailGroup)
  }

  createBodyTube() {
    this.bodyMat = new THREE.MeshStandardMaterial({
      color: 0x52b788,
      roughness: 0.35,
      metalness: 0.08
    })
    this.tubeMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.bodyMat)
    this.tubeMesh.castShadow = true
    this.tubeMesh.receiveShadow = true
    this.scene.add(this.tubeMesh)
  }

  createDorsalSpikes() {
    // Sharp white dorsal spikes with base offset to rest on tube surface
    // Slanted backward along spine towards tail
    const spikeGeo = new THREE.ConeGeometry(0.14, 0.44, 6)
    spikeGeo.translate(0, 0.22, 0)
    spikeGeo.rotateX(0.38)
    const spikeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05
    })
    this.maxSpikes = GRID_SIZE * GRID_SIZE * 2
    this.spikeMesh = new THREE.InstancedMesh(spikeGeo, spikeMat, this.maxSpikes)
    this.spikeMesh.castShadow = true
    this.spikeMesh.receiveShadow = true
    this.spikeMesh.count = 0
    this.scene.add(this.spikeMesh)
  }

  toWorld(gridX, gridZ) {
    return {
      x: gridX * CELL_UNIT - this.offset,
      z: gridZ * CELL_UNIT - this.offset
    }
  }

  update(currentSnake, prevSnake, alpha, dir) {
    if (!currentSnake || currentSnake.length < 2) return

    // 1. Build interpolated points for the continuous Catmull-Rom spline
    const points = []
    for (let i = 0; i < currentSnake.length; i++) {
      const cur = currentSnake[i]
      const prv = prevSnake && prevSnake[i] ? prevSnake[i] : cur
      const c1 = this.toWorld(prv.x, prv.z)
      const c2 = this.toWorld(cur.x, cur.z)

      const x = THREE.MathUtils.lerp(c1.x, c2.x, alpha)
      const z = THREE.MathUtils.lerp(c1.z, c2.z, alpha)
      const undulation = Math.sin(alpha * Math.PI * 2 + i * 0.4) * 0.04
      points.push(new THREE.Vector3(x, 0.42 + undulation, z))
    }

    // 2. Generate smooth continuous dragon tube
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
    const tubularSegments = Math.max(20, points.length * 4)
    const newGeo = new THREE.TubeGeometry(curve, tubularSegments, 0.36, 10, false)

    if (this.tubeMesh.geometry) {
      this.tubeMesh.geometry.dispose()
    }
    this.tubeMesh.geometry = newGeo

    // 3. Update prominent dorsal spikes along the spine
    const numSpikes = Math.max(4, (points.length - 1) * 2)
    this.spikeMesh.count = Math.min(numSpikes, this.maxSpikes)

    for (let s = 0; s < this.spikeMesh.count; s++) {
      const u = 0.06 + (s / Math.max(1, this.spikeMesh.count - 1)) * 0.86
      const p = curve.getPointAt(u)
      const tangent = curve.getTangentAt(u)

      // Sit visibly on top of the 0.36 radius tube with smooth tailward slant
      const progress = s / Math.max(1, this.spikeMesh.count - 1)
      const scale = THREE.MathUtils.lerp(1.35, 0.28, progress)

      this.dummy.position.set(p.x, p.y + 0.33 * Math.min(1, scale * 0.75 + 0.25), p.z)
      const angleY = Math.atan2(tangent.x, tangent.z)
      this.dummy.rotation.set(0, angleY, 0)

      this.dummy.scale.set(scale, scale, scale)
      this.dummy.updateMatrix()

      this.spikeMesh.setMatrixAt(s, this.dummy.matrix)
    }
    this.spikeMesh.instanceMatrix.needsUpdate = true

    // 4. Orient Dragon Head forward away from the body
    const headPos = points[0]
    this.headGroup.position.copy(headPos)

    if (points.length >= 2) {
      const forwardX = points[0].x - points[1].x
      const forwardZ = points[0].z - points[1].z
      if (Math.abs(forwardX) > 0.0001 || Math.abs(forwardZ) > 0.0001) {
        const targetAngle = Math.atan2(forwardX, forwardZ)
        let diff = targetAngle - this.currentRotationY
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        this.currentRotationY += diff * 0.35
        this.headGroup.rotation.y = this.currentRotationY
      }
    }

    // 5. Orient Tail Tuft extending outward from end of spline
    const tailPos = points[points.length - 1]
    const preTailPos = points[points.length - 2]
    this.tailGroup.position.copy(tailPos)
    this.tailGroup.lookAt(
      tailPos.x + (tailPos.x - preTailPos.x),
      tailPos.y,
      tailPos.z + (tailPos.z - preTailPos.z)
    )
  }
}
