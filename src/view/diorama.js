import * as THREE from 'three'
import { GRID_SIZE, CELL_UNIT } from '../sim/constants.js'

export class DioramaPedestal {
  constructor(scene) {
    this.scene = scene
    this.size = GRID_SIZE * CELL_UNIT
    this.half = this.size / 2

    this.createWoodTray()
    this.createGardenFloor()
    this.createCornerPegs()
  }

  createWoodTray() {
    // Warm natural cedar wood planter base
    const baseGeo = new THREE.BoxGeometry(this.size + 1.6, 1.8, this.size + 1.6)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x936639,
      roughness: 0.8,
      metalness: 0.05
    })
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.y = -0.9
    base.receiveShadow = true
    base.castShadow = true
    this.scene.add(base)

    // Beveled rim border
    const rimGeo = new THREE.BoxGeometry(this.size + 1.8, 0.25, this.size + 1.8)
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x7f4f24,
      roughness: 0.65,
      metalness: 0.05
    })
    const rim = new THREE.Mesh(rimGeo, rimMat)
    rim.position.y = -0.05
    rim.receiveShadow = true
    this.scene.add(rim)
  }

  createGardenFloor() {
    // Matcha garden checkerboard tiles
    const tileGroup = new THREE.Group()
    const tileGeo = new THREE.BoxGeometry(CELL_UNIT * 0.94, 0.1, CELL_UNIT * 0.94)

    const matLight = new THREE.MeshStandardMaterial({
      color: 0x8cb369,
      roughness: 0.9,
      metalness: 0.02
    })
    const matDark = new THREE.MeshStandardMaterial({
      color: 0x7a9a5b,
      roughness: 0.9,
      metalness: 0.02
    })

    const offset = this.half - CELL_UNIT / 2

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isAlternate = (x + z) % 2 === 0
        const tile = new THREE.Mesh(tileGeo, isAlternate ? matLight : matDark)
        tile.position.set(x * CELL_UNIT - offset, 0.05, z * CELL_UNIT - offset)
        tile.receiveShadow = true
        tileGroup.add(tile)
      }
    }

    this.scene.add(tileGroup)
  }

  createCornerPegs() {
    // Cute rounded wooden corner pegs
    const pegGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.45, 16)
    const pegMat = new THREE.MeshStandardMaterial({
      color: 0x6f4518,
      roughness: 0.7
    })

    const pad = this.half + 0.6
    const corners = [
      { x: -pad, z: -pad },
      { x: pad, z: -pad },
      { x: -pad, z: pad },
      { x: pad, z: pad }
    ]

    corners.forEach((c) => {
      const peg = new THREE.Mesh(pegGeo, pegMat)
      peg.position.set(c.x, 0.2, c.z)
      peg.castShadow = true
      peg.receiveShadow = true
      this.scene.add(peg)
    })
  }
}
