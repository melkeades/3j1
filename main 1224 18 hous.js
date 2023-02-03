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
const sceneColor = 0x330077
// Scene
const fog = new THREE.Fog(sceneColor, 2, 20)
scene.fog = fog

// Materials
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager).setPath('/static/textures/')
const doorColorTexture = textureLoader.load('door/color.jpg')
const doorAlphaTexture = textureLoader.load('door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('door/ambientocclusion.jpg')
const doorHeightTexture = textureLoader.load('door/height.jpg')
const doorNormalTexture = textureLoader.load('door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('door/roughness.jpg')
const doorMetalnessTexture = textureLoader.load('door/metalness.jpg')

const bricksColorTexture = textureLoader.load('/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/grass/roughness.jpg')

grassColorTexture.repeat.set(16, 16)
grassAmbientOcclusionTexture.repeat.set(16, 16)
grassNormalTexture.repeat.set(16, 16)
grassRoughnessTexture.repeat.set(16, 16)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const standartMaterial = new THREE.MeshStandardMaterial()
standartMaterial.roughness = 0.2
standartMaterial.metalness = 0.2

// MESH

// House
const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 2),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
)

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))

walls.position.y = 0.5
house.add(walls)
const roof = new THREE.Mesh(new THREE.ConeGeometry(1.7, 1, 4), new THREE.MeshStandardMaterial({ color: 0x333300 }))
roof.position.y = 1.5
roof.rotation.y = Math.PI / 4
house.add(roof)
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(0.9, 0.9, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    // wireframe: true,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    // metalness: doorMetalnessTexture,
    roughness: doorRoughnessTexture,
  })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.set(0, 0.4, 1.001)
house.add(door)

// Bush
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x55aa55 })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.2, 0.2, 0.2)
bush1.position.set(0.7, 0.2, 1.3)
bush2.scale.set(0.1, 0.1, 0.1)
bush2.position.set(-0.5, 0.1, 1.3)
house.add(bush1, bush2)

// Graves
const graves = new THREE.Group()
const graveGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.1)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 2.5 + Math.random() * 5
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.19, z)
  grave.rotation.y = (Math.random() - 0.5) / 3
  grave.rotation.z = (Math.random() - 0.5) / 5
  grave.castShadow = true
  graves.add(grave)
}
scene.add(graves)
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

floor.rotation.x = -Math.PI / 2
scene.add(floor)

// Light
const ambientLight = new THREE.AmbientLight(0x4444ff, 0.8)
const directionLight = new THREE.DirectionalLight(0x3333ff, 0.8)
directionLight.position.set(2, 2, 2)
const doorLight = new THREE.PointLight(0xaa3300, 2, 10)
doorLight.position.set(0, 1.1, 1.5)
scene.add(ambientLight, directionLight, doorLight)

// Ghosts
const ghost1 = new THREE.PointLight(0xff0000, 2, 3)
const ghost2 = new THREE.PointLight(0x0000ff, 2, 3)
const ghost3 = new THREE.PointLight(0x00ff00, 2, 3)
scene.add(ghost1, ghost2, ghost3)

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
renderer.setClearColor(sceneColor)
// Controls
const gui = new dat.GUI()
gui.hide()
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const clock = new THREE.Clock()
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
