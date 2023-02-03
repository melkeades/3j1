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

// Particles
const particlesGeometry = new THREE.BufferGeometry()
const count = 50000
const position = new Float32Array(count * 3)
const color = new Float32Array(count * 3)
for (var i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 5
  color[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particleTexture,
  // color: [color, 3],
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: AdditiveBlending,
  vertexColors: true,
})
// scene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()))
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
const gui = new dat.GUI()
gui.hide()
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const clock = new THREE.Clock()
// Updated
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // update particles
  // particles.position.y = -elapsedTime * 0.02
  for (var i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particlesGeometry.attributes.position.array[i3]
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }
  particlesGeometry.attributes.position.needsUpdate = true
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
