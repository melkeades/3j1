import './style.styl'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'dat.gui'
import { AdditiveBlending } from 'three'

const select = (e) => document.querySelector(e)

// Settings
const canvas = select('canvas.ca')
let devicePixelRatio = Math.min(window.devicePixelRatio, 2)
const scene = new THREE.Scene()
let sizes = { width: window.innerWidth, height: window.innerHeight }

// Materials
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager).setPath('/static/textures/')
const particleTexture = textureLoader.load('particles/2.png')
// MESH
const params = {
  count: 10000,
  size: 0.1,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 2,
  randomnessPow: 2,
  inColor: '#ff7777',
  outColor: '#7777ff',
}
const gui = new dat.GUI({ width: 400 })
let galaxyGeometry = null
let galaxyPoints = null
let galaxyMaterial = null
const generateGalaxy = () => {
  if (galaxyPoints !== null) {
    galaxyGeometry.dispose()
    galaxyMaterial.dispose()
    scene.remove(galaxyPoints)
  }
  galaxyGeometry = new THREE.BufferGeometry()
  const position = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  const colorIn = new THREE.Color(params.inColor)
  const colorOut = new THREE.Color(params.outColor)

  console.log(colorIn)
  for (let i = 0; i < params.count * 3; i++) {
    const i3 = i * 3
    const radius = Math.random() * params.radius
    const spinAgnle = radius * params.spin
    const branchesAngle = ((i % params.branches) / params.branches) * Math.PI * 2
    function ranPow(math) {
      return Math.pow(math, params.randomnessPow) * (Math.random() > 0.5 ? 1 : -1)
    }

    const randomX = ranPow(Math.random())
    const randomY = ranPow(Math.random())
    const randomZ = ranPow(Math.random())
    position[i3 + 0] = Math.cos(branchesAngle + spinAgnle) * radius + randomX
    position[i3 + 1] = randomY
    position[i3 + 2] = Math.sin(branchesAngle + spinAgnle) * radius + randomZ

    const mixColor = colorIn.clone()
    mixColor.lerp(colorOut, radius / params.radius)

    colors[i3] = mixColor.r
    colors[i3 + 1] = mixColor.g
    colors[i3 + 2] = mixColor.b
    if (i < 20) {
      console.log(i, mixColor)
    }
  }
  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  galaxyMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: params.size,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  })
  galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial)
  scene.add(galaxyPoints)
}
generateGalaxy()
gui.add(params, 'count').min(10).max(100000).step(10).onFinishChange(generateGalaxy)
gui.add(params, 'size').min(0.001).max(1).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, 'radius').min(0.001).max(20).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(params, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomnessPow').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(params, 'inColor').onFinishChange(generateGalaxy)
gui.addColor(params, 'outColor').onFinishChange(generateGalaxy)

// const g1 = generateGalaxy()
// scene.add(g1)
// Light

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 200)
camera.position.z = 4
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(devicePixelRatio)
// Controls
// gui.hide()
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Updated
const tick = () => {
  controls.update()
  requestAnimationFrame(tick)
  renderer.render(scene, camera)
}

tick()

window.addEventListener('resize', () => {
  const updatedPR = Math.min(window.devicePixelRatio, 2)
  if (devicePixelRatio != updatedPR) {
    devicePixelRatio = updatedPR
    renderer.setPixelRatio(devicePixelRatio)
  }
  sizes = { width: window.innerWidth, height: window.innerHeight }
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})
