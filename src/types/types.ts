import type * as THREE from 'three'

// * Planets Structure
export interface Planet {
  mesh: THREE.Mesh
  orbit: number
  orbitSpeed: number
  angle: number
  name: string
  orbitLine?: THREE.Line
}

// * Planet Building Options
export interface PlanetOptions {
  name: string
  size: number
  orbit: number
  color: number
  orbitSpeed: number
}

// * Solar System Building Options
export interface SolarSystemOptions {
  starsCount?: number
  sunSize?: number
  sunColor?: number
}
