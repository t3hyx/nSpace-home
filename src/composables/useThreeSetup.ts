import * as THREE from 'three'
import { onBeforeUnmount, ref } from 'vue'
import { colorCollection } from '../utils/colors'

export function useThreeSetup() {
  // * Three.js refs
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const clock = ref<THREE.Clock | null>(null)
  const container = ref<HTMLElement | null>(null)
  const animationFrameId = ref<number | null>(null)

  // * Resizing Handler (callback)
  const handleResize = () => {
    if (!container.value || !camera.value || !renderer.value)
      return

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(width, height)
  }

  // * Three.js Init
  const initThree = (containerElement: HTMLElement) => {
    container.value = containerElement

    // ** Dimensions
    const width = containerElement.clientWidth
    const height = containerElement.clientHeight

    // ** Scene
    scene.value = new THREE.Scene()
    scene.value.background = new THREE.Color(colorCollection.pureBlack)

    // ** Camera
    camera.value = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000) // ? (fov, aspectRatio, near, far)
    camera.value.position.set(0, 30, 80) // ? (x, y, z)
    camera.value.lookAt(0, 0, 0) // ? (x, y, z)

    // ** Renderer
    renderer.value = new THREE.WebGLRenderer({ antialias: true })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(window.devicePixelRatio)
    containerElement.appendChild(renderer.value.domElement)

    // ** Clock
    clock.value = new THREE.Clock()

    // ** Resizing Handler (event)
    window.addEventListener('resize', handleResize)
  }

  // * Clean-up (avoid memry leaks)
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
  }

  // * Cleaning Automation
  onBeforeUnmount(() => {
    cleanupThree()
  })

  return {
    get scene() { return scene.value as THREE.Scene },
    get camera() { return camera.value as THREE.PerspectiveCamera },
    get renderer() { return renderer.value as THREE.WebGLRenderer },
    get clock() { return clock.value as THREE.Clock },
    get animationFrameId() { return animationFrameId.value },
    set animationFrameId(id: number | null) { animationFrameId.value = id },
    initThree,
    handleResize,
    cleanupThree,
  }
}
