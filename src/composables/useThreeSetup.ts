import * as THREE from 'three'
import { onBeforeUnmount, ref } from 'vue'
import { colors } from '../utils/colorsHelper'

export interface ThreeSetup {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock
  initThree: (container: HTMLElement) => void
  handleResize: () => void
  cleanupThree: () => void
  animationFrameId: number | null
}

export function useThreeSetup() {
  // # Three.js Refs
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const clock = ref<THREE.Clock | null>(null)
  const container = ref<HTMLElement | null>(null)
  const animationFrameId = ref<number | null>(null)
  // ? DEBUG --------------------------------------------------
  const isInitialized = ref<boolean>(false)

  // ** Resizing Handler (callback)
  const handleResize = () => {
    if (!container.value || !camera.value || !renderer.value) {
      console.warn('Impossible de redimensionner, certains objets ne sont pas initialisés')
      return
    }

    const width = container.value!.clientWidth
    const height = container.value!.clientHeight

    camera.value!.aspect = width / height
    camera.value!.updateProjectionMatrix()
    renderer.value!.setSize(width, height)
  }

  // # Three.js Init
  const initThree = (containerElement: HTMLElement) => {
    console.warn('=== Beginning Threejs Init... ===')
    container.value = containerElement

    // ** Dimensions
    const width = containerElement.clientWidth
    const height = containerElement.clientHeight

    // ** Scene
    scene.value = new THREE.Scene()
    scene.value.background = new THREE.Color(colors.pureBlack)
    console.warn('=== Scene created. ===')

    // ** Camera
    camera.value = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000) // ? (fov, aspectRatio, near, far)
    camera.value.position.set(0, 30, 80) // ? (x, y, z)
    camera.value.lookAt(0, 0, 0) // ? (x, y, z)
    console.warn('=== Camera created. ===')

    // ** Renderer
    renderer.value = new THREE.WebGLRenderer({ antialias: true })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(window.devicePixelRatio)
    containerElement.appendChild(renderer.value.domElement)
    console.warn('=== Renderer created. ===')

    // ** Clock
    clock.value = new THREE.Clock()
    console.warn('=== Clock created. ===')

    // ** Resizing Handler (event)
    window.addEventListener('resize', handleResize)

    isInitialized.value = true
    console.warn('=== Threejs initialized successfully ! ===')
  }

  // # Clean-up (avoid memry leaks)
  console.warn('=== Threejs cleaning start... ===')
  const cleanupThree = () => {
    // Cancel animation
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }
    // Delete event listener
    window.removeEventListener('resize', handleResize)

    // Clean renderer
    if (container.value && renderer.value) {
      container.value.removeChild(renderer.value.domElement)
      renderer.value.dispose()
      renderer.value = null
    }
    // Clean scene
    if (scene.value) {
      scene.value.clear()
      scene.value = null
    }
    // Reinit other refs
    camera.value = null
    clock.value = null
    container.value = null
    isInitialized.value = false
    console.warn('=== Threejs cleaning over ===')
  }

  // # Cleaning Automation
  onBeforeUnmount(() => {
    cleanupThree()
  })

  return {
    get scene() {
      if (!scene.value) {
        console.warn('=== Trying to access non-initialized scene ! ===')
      }
      return scene.value // as THREE.Scene
    },
    get camera() {
      if (!camera.value) {
        console.warn('=== Trying to access non-initialized camera ! ===')
      }
      return camera.value // as THREE.PerspectiveCamera
    },
    get renderer() {
      if (!renderer.value) {
        console.warn('=== Trying to access non-initialized renderer ! ===')
      }
      return renderer.value // as THREE.WebGLRenderer
    },
    get clock() {
      if (!clock.value) {
        console.warn('=== Trying to access non-initialized clock ! ===')
        return null
      }
      return clock.value // as THREE.Clock
    },
    get animationFrameId() {
      return animationFrameId.value
    },
    set animationFrameId(id: number | null) {
      animationFrameId.value = id
    },
    get isInitialized() {
      return isInitialized.value
    },
    initThree,
    handleResize,
    cleanupThree,
  }
}
