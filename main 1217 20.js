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
let text
const fontLoader = new FontLoader()
fontLoader.load('/static/fonts/helvetiker_regular.typeface.json', (font) => {
  console.log('lo')
  const textGeometry = new TextGeometry('jopa', {
    font: font,
    size: 0.9,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 10,
  })
  textGeometry.center()
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  text = new THREE.Mesh(textGeometry, material)
  scene.add(text)
  const mr = (e) => {
    return (e - 0.5) * 10
  }
  const dg = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
  console.time()
  for (let i = 0; i < 100; i++) {
    const d = new THREE.Mesh(dg, material)
    d.position.set(mr(Math.random()), mr(Math.random()), mr(Math.random()))
    d.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    const scale = Math.random()
    d.scale.set(scale, scale, scale)
    scene.add(d)
  }

  console.timeEnd()
})

// Materials
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager).setPath('/static/textures/environmentMaps/0/')

const matcapTexture = textureLoader.load('/static/textures/matcaps/1.png')
const environmentTexture = cubeTextureLoader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

// Mesh

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
