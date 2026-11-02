import * as THREE from 'three'

export function createDragonHead() {
  const headGroup = new THREE.Group()

  // Dragon head base
  const headGeo = new THREE.SphereGeometry(0.48, 16, 14)
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x40916c,
    roughness: 0.35
  })
  const headMesh = new THREE.Mesh(headGeo, headMat)
  headMesh.castShadow = true
  headGroup.add(headMesh)

  // Cute rounded snout
  const snoutGeo = new THREE.BoxGeometry(0.46, 0.28, 0.38)
  const snout = new THREE.Mesh(snoutGeo, headMat)
  snout.position.set(0, -0.08, 0.32)
  headGroup.add(snout)

  // Anime eyes with reflection glints
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1f1914, roughness: 0.1 })
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const eyeGeo = new THREE.SphereGeometry(0.11, 12, 10)
  const glintGeo = new THREE.SphereGeometry(0.04, 8, 8)

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
  leftEye.position.set(-0.25, 0.15, 0.28)
  const leftGlint = new THREE.Mesh(glintGeo, glintMat)
  leftGlint.position.set(-0.02, 0.04, 0.09)
  leftEye.add(leftGlint)

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
  rightEye.position.set(0.25, 0.15, 0.28)
  const rightGlint = new THREE.Mesh(glintGeo, glintMat)
  rightGlint.position.set(-0.02, 0.04, 0.09)
  rightEye.add(rightGlint)

  headGroup.add(leftEye)
  headGroup.add(rightEye)

  // Rosy blush circles
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xff8fa3 })
  const blushGeo = new THREE.CircleGeometry(0.08, 12)
  const leftBlush = new THREE.Mesh(blushGeo, blushMat)
  leftBlush.position.set(-0.35, -0.03, 0.25)
  leftBlush.rotation.y = -Math.PI * 0.3
  const rightBlush = new THREE.Mesh(blushGeo, blushMat)
  rightBlush.position.set(0.35, -0.03, 0.25)
  rightBlush.rotation.y = Math.PI * 0.3
  headGroup.add(leftBlush)
  headGroup.add(rightBlush)

  // Cute cream dragon antlers
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xfdf0d5, roughness: 0.4 })
  const hornGeo = new THREE.CylinderGeometry(0.03, 0.075, 0.38, 8)

  const leftHorn = new THREE.Mesh(hornGeo, hornMat)
  leftHorn.position.set(-0.22, 0.48, -0.08)
  leftHorn.rotation.x = -0.45
  leftHorn.rotation.z = -0.25

  const rightHorn = new THREE.Mesh(hornGeo, hornMat)
  rightHorn.position.set(0.22, 0.48, -0.08)
  rightHorn.rotation.x = -0.45
  rightHorn.rotation.z = 0.25

  headGroup.add(leftHorn)
  headGroup.add(rightHorn)

  // Flowing dragon whiskers
  const whiskerMat = new THREE.MeshStandardMaterial({ color: 0xfdf0d5, roughness: 0.5 })
  const whiskerGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.4, 6)

  const leftWhisker = new THREE.Mesh(whiskerGeo, whiskerMat)
  leftWhisker.position.set(-0.32, -0.14, 0.4)
  leftWhisker.rotation.z = Math.PI * 0.4
  leftWhisker.rotation.y = -0.2

  const rightWhisker = new THREE.Mesh(whiskerGeo, whiskerMat)
  rightWhisker.position.set(0.32, -0.14, 0.4)
  rightWhisker.rotation.z = -Math.PI * 0.4
  rightWhisker.rotation.y = 0.2

  headGroup.add(leftWhisker)
  headGroup.add(rightWhisker)

  return headGroup
}

export function createDragonTailTuft() {
  const tailGroup = new THREE.Group()
  const tuftMat = new THREE.MeshStandardMaterial({ color: 0xfdf0d5, roughness: 0.5 })

  const puffGeo1 = new THREE.SphereGeometry(0.24, 10, 8)
  const puffGeo2 = new THREE.SphereGeometry(0.18, 10, 8)

  const p1 = new THREE.Mesh(puffGeo1, tuftMat)
  const p2 = new THREE.Mesh(puffGeo2, tuftMat)
  p2.position.set(0, 0.12, -0.15)

  tailGroup.add(p1)
  tailGroup.add(p2)
  tailGroup.castShadow = true

  return tailGroup
}
