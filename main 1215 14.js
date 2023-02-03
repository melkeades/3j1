import './style.styl'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'dat.gui'

const select = (e) => document.querySelector(e)

// Settings
const canvas = select('canvas.ca')
let devicePixelRatio = Math.min(window.devicePixelRatio, 2)
const scene = new THREE.Scene()
let sizes = { width: window.innerWidth, height: window.innerHeight }

// Fonts
const fontLoader = new FontLoader()
fontLoader.load('/static/fonts/helvetiker_regular.typeface.json', (font) => {
  console.log('lo')
  const textGeometry = new TextGeometry('jopa', {
    font: font,
    size: 0.5,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  })
  const textMaterial = new THREE.MeshStandardMaterial()
  const text = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(text)
})

// Materials
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager).setPath('/static/textures/door/')
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager).setPath('/static/textures/environmentMaps/0/')
const colorTexture = textureLoader.load('color.jpg')
const heightTexture = textureLoader.load('height.jpg')
const AOTexture = textureLoader.load('ambientOcclusion.jpg')
const normalTexture = textureLoader.load('normal.jpg')
const metalnessTexture = textureLoader.load('metalness.jpg')
const roughnessTexture = textureLoader.load('roughness.jpg')
const alphaTexture = textureLoader.load('alpha.jpg')
const environmentTexture = cubeTextureLoader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

const material = new THREE.MeshStandardMaterial()
material.side = THREE.DoubleSide
// material.metalness = 0
// material.roughness = 1
material.map = colorTexture
material.aoMap = AOTexture
material.aoMapIntensity = 10
material.displacementMap = heightTexture
material.displacementScale = 0.1
material.normalMap = normalTexture
material.roughness = roughnessTexture
material.transparent = true
material.transparent = alphaTexture
// material.
// { wireframe: true }

// Mesh
const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 128, 128), material)
plane.geometry.setAttribute = ('uv2', new THREE.BufferAttribute())
scene.add(plane)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshStandardMaterial({ envMap: environmentTexture, metalness: 0.5, roughness: 0.1 }))
sphere.position.set(1, 1, 0)
scene.add(sphere)

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 200)
camera.position.z = 4
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialiasing: true, canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(devicePixelRatio)

// Controls
const gui = new dat.GUI()
gui.hide()
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
