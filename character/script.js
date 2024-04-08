import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let action, 
    mixer, 
    clock = new THREE.Clock(), 
    isMoving = { w: false, a: false, s: false, d: false }, 
    animations,
    character

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 2000)
const loader = new GLTFLoader()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const light = new THREE.AmbientLight(0xffffff, 5)
scene.add(light)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(10, 10, 0)
controls.update()

const geometry = new THREE.PlaneGeometry(50, 50)
const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide})
const plane = new THREE.Mesh(geometry, material)
plane.rotation.x = Math.PI / 2
scene.add(plane)

document.body.appendChild(renderer.domElement)

loader.load(
	`assets/scene.gltf`,
	function (gltf) {
		const clip = THREE.AnimationClip.findByName(gltf.animations, 'Walk')
		mixer = new THREE.AnimationMixer(gltf.scene)
		action = mixer.clipAction(clip)
		action.play()
		animations = gltf.animations
		character = gltf.scene
		scene.add(gltf.scene)
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded')
	},
	function (error) {
		console.log(error)
	}
)

const movementSpeed = 0.75
const movementVector = new THREE.Vector3()

function animate() {
	requestAnimationFrame(animate)
	controls.update()
	let delta = clock.getDelta()
	if (mixer && (isMoving.w || isMoving.a || isMoving.s || isMoving.d)) {
			mixer.update(delta)
			updateCharacterPosition(delta)
	}
	renderer.render(scene, camera)
}

function updateCharacterPosition(delta) {
	movementVector.set(0, 0, 0)

	if (isMoving.w) movementVector.z += movementSpeed
	if (isMoving.s) movementVector.z -= movementSpeed
	if (isMoving.a) movementVector.x += movementSpeed
	if (isMoving.d) movementVector.x -= movementSpeed

	if (movementVector.lengthSq() > 0) {
		character.lookAt(character.position.clone().add(movementVector))
	}

	movementVector.normalize().multiplyScalar(movementSpeed * delta)
	character.position.add(movementVector)
}

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener("keydown", e => {
	if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
		isMoving[e.key] = true
	}
})

window.addEventListener("keyup", e => {
	if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
		isMoving[e.key] = false
	}
})

animate()
