import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let action, 
		mixer, 
		clock = new THREE.Clock(), 
		isMoving, 
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

camera.position.set(10, 5, 10)
controls.update()

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
		gltf.animations // Array<THREE.AnimationClip>
		gltf.scene // THREE.Group
		gltf.scenes // Array<THREE.Group>
		gltf.cameras // Array<THREE.Camera>
		gltf.asset // Object
	},
	function (xhr) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded')
	},
	function (error) {
		console.log(error)
	}
)

function animate() {
	requestAnimationFrame(animate)
	controls.update()
	let delta = clock.getDelta()
	if (mixer && isMoving) mixer.update(delta)
	renderer.render(scene, camera)
}

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener("keydown", e => {
	if(e.key == "w" || e.key == "a" || e.key == "s" || e.key == "d") {
		isMoving = true
	}

	if(e.key == "w") {
		character.position.z += 0.01
	}

	if(e.key == "s") {
		character.position.z -= 0.01
	}

	if(e.key == "a") {
		character.position.x += 0.01
	}

	if(e.key == "d") {
		character.position.x -= 0.01
	}
	
})

window.addEventListener("keyup", () => {
	isMoving = false
})

animate()
