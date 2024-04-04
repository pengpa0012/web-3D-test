import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const light = new THREE.AmbientLight( 0xffffff, 20 )
scene.add( light )


const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

camera.position.z = 8
document.body.appendChild(renderer.domElement)



const loader = new GLTFLoader()
loader.load(
	'assets/car-1/scene.gltf',
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

function animate() {
	requestAnimationFrame(animate)
	controls.update()
	renderer.render(scene, camera)
}

animate()