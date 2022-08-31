import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import particleVertexShader from './shaders/particleVertex.glsl'
import particleFragmentShader from './shaders/particleFragment.glsl'
import glowFragmentShader from './shaders/fragmentGlow.glsl'

/**
 * Debug
 */
// const gui = new dat.GUI({ width: 340 })
// gui.close()
const debugObject = {}

/**
 * Setup
 */
const scene = new THREE.Scene()

const parameters = {}
parameters.cameraX = -300
parameters.cameraY = 400
parameters.cameraZ = 330
parameters.count = 300000
parameters.size = 1.0

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(parameters.cameraX, parameters.cameraY, parameters.cameraZ)
camera.up.set(0, 1, 0)
camera.lookAt(-80, 0, -80)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

/**
 * Graphics
 */
let width = 1400
let height = 2000
let widthSegments = 400
let heightSegments = 800
let geometry = null
let sandGeometry = null
let glowMaterial = null
let sandMaterial = null
let glow = null
let sands = null

// Colors
debugObject.depthColor = '#a2dcc6'
debugObject.surfaceColor = '#ffbea4'

const generateObjects = () => {
    // Destroy old objects
    if(sands !== null) {
        sandGeometry.dispose()
        sandMaterial.dispose()
        scene.remove(sands)
    }

    if(glow !== null) {
        geometry.dispose()
        glowMaterial.dispose()
        scene.remove(glow)
    }

    geometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments)

    sandGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        positions[i3    ] = (Math.random() - 0.5) * width
        positions[i3 + 1] = (Math.random() - 0.5) * height
        positions[i3 + 2] = 0

        sandGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    }

    glowMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: glowFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: 0.5 },
            uMountainFrequency: { value: 300.0 },
            uMountainHeight: { value: 140.0 },
            uPallete: { type: 't', value: null },
            uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
            uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
            uColorOffset: { value: 0.8 },
            uColorMultiplier: { value: 0.9 },
        }
    })
    
    sandMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: 0.5 },
            uMountainFrequency: { value: 4.2 },
            uMountainHeight: { value: 100.0 },
            uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
            uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
            uColorOffset: { value: 0.8 },
            uColorMultiplier: { value: 0.9 },
            uSize: { value: parameters.size * renderer.getPixelRatio() }
        }
    })

    glow = new THREE.Mesh( geometry, glowMaterial)
    glow.position.z = -220
    glow.rotation.x = -Math.PI / 2
    scene.add( glow )

    sands = new THREE.Points( sandGeometry, sandMaterial )
    sands.position.z = -220
    sands.rotation.x = -Math.PI / 2
    scene.add( sands )

    // Resize
    window.addEventListener('resize', onWindowResize)
}

generateObjects()

/**
 * Animate
 */
const clock = new THREE.Clock()

function animate() {
    const elapsedTime = clock.getElapsedTime()

    glowMaterial.uniforms.uTime.value = elapsedTime
    sandMaterial.uniforms.uTime.value = elapsedTime

	requestAnimationFrame( animate )

	renderer.render( scene, camera )
}
animate()

/**
 * Handle Resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

    generateObjects()
}

/**
 * Add to debug
 */
// gui.add(glowMaterial.uniforms.uSpeed, 'value').min(0).max(4).step(0.001).name('speed')
// gui.add(glowMaterial.uniforms.uMountainFrequency, 'value').min(0).max(500).step(0.1).name('mountain freq')
// gui.add(glowMaterial.uniforms.uMountainHeight, 'value').min(0).max(300).step(0.1).name('mountain height')
// gui.add(parameters, 'cameraX').min(-1000).max(400).step(1.0).name('camera x').onFinishChange(generateObjects)
// gui.add(parameters, 'cameraY').min(-400).max(1000).step(1.0).name('camera y').onFinishChange(generateObjects)
// gui.add(parameters, 'cameraZ').min(-400).max(1000).step(1.0).name('camera z').onFinishChange(generateObjects)
// gui.addColor(debugObject, 'depthColor').onChange(() => { glowMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
// gui.addColor(debugObject, 'surfaceColor').onChange(() => { glowMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
// gui.add(glowMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
// gui.add(glowMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')