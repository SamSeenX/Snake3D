import * as THREE from 'three'

export class DioramaScene {
  constructor(container) {
    this.container = container
    this.scene = new THREE.Scene()
    this.bgColor = 0xd6e8dd
    this.scene.background = new THREE.Color(this.bgColor)
    this.scene.fog = new THREE.FogExp2(this.bgColor, 0.02)

    this.initRenderer()
    this.initLights()
    this.bindResize()
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.container.appendChild(this.renderer.domElement)
  }

  initLights() {
    // Soft sky and ground hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xe4f0fc, 0xd0e2cd, 1.8)
    this.scene.add(hemiLight)

    // Warm golden sunlight
    const sunLight = new THREE.DirectionalLight(0xfff6e4, 2.4)
    sunLight.position.set(15, 24, 12)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    sunLight.shadow.bias = -0.0005
    sunLight.shadow.camera.near = 1
    sunLight.shadow.camera.far = 60
    sunLight.shadow.camera.left = -16
    sunLight.shadow.camera.right = 16
    sunLight.shadow.camera.top = 16
    sunLight.shadow.camera.bottom = -16
    this.scene.add(sunLight)

    // Gentle peach rim light
    const peachRim = new THREE.DirectionalLight(0xffdec7, 0.9)
    peachRim.position.set(-12, 14, -14)
    this.scene.add(peachRim)
  }

  bindResize() {
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth
      const h = this.container.clientHeight
      this.renderer.setSize(w, h)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }

  render(camera) {
    this.renderer.render(this.scene, camera)
  }
}
