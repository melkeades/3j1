import './style.styl'

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

// Materials
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager).setPath('/static/textures/environmentMaps/0/')
const bakedShadow = textureLoader.load('/static/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/static/textures/simpleShadow.jpg')
console.log(simpleShadow)
const standartMaterial = new THREE.MeshStandardMaterial()
standartMaterial.roughness = 0.2
standartMaterial.metalness = 0.2
const matcapTexture = textureLoader.load('/static/textures/matcaps/1.png')
const environmentTexture = cubeTextureLoader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

// Mesh
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), standartMaterial)
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), standartMaterial)
sphere.position.set(1.4, 0, 0)
sphere.castShadow = true
cube.castShadow = true
scene.add(cube, sphere)
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 1, 1),
  standartMaterial
  // new THREE.MeshBasicMaterial({
  //   map: bakedShadow,
  // })
)
plane.rotation.x = -Math.PI / 2
plane.position.y = -1
// plane.receiveShadow = true
scene.add(plane)

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
)
sphereShadow.rotation.x = -Math.PI / 2
sphereShadow.position.y = plane.position.y + 0.001
scene.add(sphereShadow)

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

const hemiLight = new THREE.HemisphereLight(0x00ff00, 0x0000ff, 0.3)
// const pointLight = new THREE.PointLight(0xffffff, 1)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(4, 4, 10)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 10
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.right = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = -3
// directionalLight.shadow.radius = 5
const pointLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(hemiLight)

const spotLight = new THREE.SpotLight(0xffffff, 0.8, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// Controls
const gui = new dat.GUI()
gui.hide()
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Updated
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  cube.position.x = Math.sin(elapsedTime)
  cube.position.z = Math.cos(elapsedTime)
  cube.position.y = Math.abs(Math.cos(elapsedTime * 2))
  sphereShadow.position.x = cube.position.x
  sphereShadow.position.z = cube.position.z
  sphereShadow.material.opacity = (1 - cube.position.y / 2) * 0.9

  cube.rotation.x += 0.005
  cube.rotation.y += 0.005
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
