import './style.styl'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
// import imageSource from 'C:/Users/serj/Downloads/Threejs Journey Ultimate Course/static/textures/door/color.jpg'

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/static/textures/door/color.jpg')
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.onload = () => {
//   texture.needsUpdate = true
// }
// image.src = '/static/textures/door/color.jpg'

const select = (e) => document.querySelector(e)

const gui = new dat.GUI()
// { closed: true }
gui.hide()
const canvas = select('canvas.ca')
let devicePixelRatio = Math.min(window.devicePixelRatio, 2)
const scene = new THREE.Scene()
let sizes = { width: window.innerWidth, height: window.innerHeight }

const geometry = new THREE.BoxGeometry(1, 1, 1)
// ----
// const points = []
// points.push(new THREE.Vector3(1, 0, 0))
// points.push(new THREE.Vector3(0, 1, 0))
// let geometry = new THREE.BufferGeometry().setFromPoints(points)
// -----
// let geometry = new THREE.BufferGeometry()
// const points = [
//   new THREE.Vector3(-1, 1, -1), //c
//   new THREE.Vector3(-1, -1, 1), //b
//   new THREE.Vector3(1, 1, 1), //a

//   new THREE.Vector3(1, 1, 1), //a
//   new THREE.Vector3(1, -1, -1), //d
//   new THREE.Vector3(-1, 1, -1), //c

//   new THREE.Vector3(-1, -1, 1), //b
//   new THREE.Vector3(1, -1, -1), //d
//   new THREE.Vector3(1, 1, 1), //a

//   new THREE.Vector3(-1, 1, -1), //c
//   new THREE.Vector3(1, -1, -1), //d
//   new THREE.Vector3(-1, -1, 1), //b
// ]

// geometry.setFromPoints(points)
// geometry.computeVertexNormals()
// ----
// const geometry = new THREE.BufferGeometry()
// const num = 500
// const positionArray = new Float32Array(num * 3 * 3)
// for (let i = 0; i < num * 3 * 3; i++) {
//   positionArray[i] = (Math.random() - 0.5) * 1
// }
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
// geometry.setAttribute('position', positionAttribute)

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
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: texture }))

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
  //   console.log(cursor.x.toFixed(2), cursor.y.toFixed(2))
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
