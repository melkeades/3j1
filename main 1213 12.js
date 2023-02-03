import './style.styl'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const loadingManager = new THREE.LoadingManager()

loadingManager.onLoad = () => {}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/static/textures/minecraft.png')
// const colorTexture = textureLoader.load('/static/textures/door/color.jpg')
// colorTexture.minFilter = THREE.NearestFilter
colorTexture.generateMipmaps = false
colorTexture.magFilter = THREE.NearestFilter
const alphaTexture = textureLoader.load('/static/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/static/textures/door/height.jpg')
const normalTexture = textureLoader.load('/static/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/static/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/static/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/static/textures/door/roughness.jpg')

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 5
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.offset.x = 0.1
// colorTexture.rotation = 1
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

const select = (e) => document.querySelector(e)

const gui = new dat.GUI()
// { closed: true }
gui.hide()
const canvas = select('canvas.ca')
let devicePixelRatio = Math.min(window.devicePixelRatio, 2)
const scene = new THREE.Scene()
let sizes = { width: window.innerWidth, height: window.innerHeight }

const geometry = new THREE.BoxGeometry(1, 1, 1)

const material = new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.position.x = 1
mesh.scale.set(1, 2, 1)
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25

const params = { color: 0x225522 }
const cube1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2, 0.8), new THREE.MeshBasicMaterial({ color: params.color }))
const box = new THREE.BoxGeometry(1, 1, 1)
const mat = new THREE.MeshBasicMaterial({ map: colorTexture })
const cube2 = new THREE.Mesh(box, mat)

const group = new THREE.Group()
scene.add(group)
group.add(cube1, cube2)
gui.add(group.position, 'x', -3, 3, 0.01)
gui.add(group.position, 'y').min(-3).max(3).step(0.01).name('gruu Y')
gui.add(group, 'visible')
gui.add(cube1.material, 'wireframe')
gui.addColor(params, 'color').onChange(() => {
  cube1.material.color.set(params.color)
})

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 200)
camera.position.z = 7
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

const axes = new THREE.AxesHelper()
scene.add(axes)

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(devicePixelRatio)

// gsap.to(mesh.rotation, { x: '+=0.5', yoyo: true, repeat: -1, duration: 3 })

const cursor = { x: 0, y: 0 }

canvas.addEventListener('mousemove', (e) => {
  cursor.x = e.offsetX / sizes.width - 0.5
  cursor.y = e.offsetY / sizes.height - 0.5
})

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})
