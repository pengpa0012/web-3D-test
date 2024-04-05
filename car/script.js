import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 2000)
const loader = new GLTFLoader()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const light = new THREE.AmbientLight( 0xffffff, 20 )
scene.add( light )


const controls = new OrbitControls( camera, renderer.domElement )

camera.position.set( 10, 5, 10 )
controls.update()

document.body.appendChild(renderer.domElement)

function loadModel(path) {
	loader.load(
		`assets/${path}`,
		function ( gltf ) {
			scene.add( gltf.scene )
			gltf.animations // Array<THREE.AnimationClip>
			gltf.scene // THREE.Group
			gltf.scenes // Array<THREE.Group>
			gltf.cameras // Array<THREE.Camera>
			gltf.asset // Object

		},
		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
		},
		function ( error ) {
			console.log(error)
		}
	)
}


function animate() {
	requestAnimationFrame(animate)
	controls.update()
	renderer.render(scene, camera)
}

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

const loadBtn = document.querySelector(".load-btn")

loadBtn.addEventListener("click", () => {
	loadModel("car-3/scene.gltf")
	animate()
	loadBtn.classList.add("hidden")
})

