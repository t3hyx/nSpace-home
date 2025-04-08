import type * as THREE from 'three'

// * Color Dictionary
export interface IColors {
  [key: string]: number
}

// * Three.js setup object
export interface IThreeSetup {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock
  animationFrameId: number | null
  initThree: (container: HTMLElement) => void
  handleResize: () => void
  cleanupThree: () => void
}

// * Planets Structure
export interface IPlanet {
  mesh: THREE.Mesh
  orbit: number
  orbitSpeed: number
  angle: number
  name: string
  orbitLine?: THREE.Line
}

// * Planet Building Options
export interface IPlanetOptions {
  name: string
  size: number
  orbit: number
  color: number
  orbitSpeed: number
}

// * Solar System Building Options
export interface ISolarSystemOptions {
  starsCount?: number
  sunSize?: number
  sunColor?: number
}
