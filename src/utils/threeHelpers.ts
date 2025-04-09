/* eslint-disable jsdoc/no-multi-asterisks */
import * as THREE from 'three'
import { colors } from './colorsHelper'

/**
 * * Create stars for the background
 * @param count number of stars
 * @param spread Max. distance of stars
 * @returns A Three.js 'Points' object containing stars
 */
export function createStars(count = 5000, spread = 1000): THREE.Points {
  const starsGeometry = new THREE.BufferGeometry()
  const starsMaterial = new THREE.PointsMaterial({
    color: colors.starWhite,
    size: 0.7,
    sizeAttenuation: true,
  })

  const starsVertices = []
  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(spread)
    const y = THREE.MathUtils.randFloatSpread(spread)
    const z = THREE.MathUtils.randFloatSpread(spread)
    starsVertices.push(x, y, z)
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))

  return new THREE.Points(starsGeometry, starsMaterial)
}

/**
 * * Create a line representing a planet's orbit
 * @param radius Orbit radius
 * //@param color Orbit color
 * @returns A Three.js 'Line' object representing the orbit
 */
export function createOrbitLine(radius: number): THREE.Line {
  const segments = 64
  const orbitGeometry = new THREE.BufferGeometry()
  const points = []

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    points.push(new THREE.Vector3(
      radius * Math.cos(theta),
      0,
      radius * Math.sin(theta),
    ))
  }

  orbitGeometry.setFromPoints(points)

  const orbitMaterial = new THREE.LineBasicMaterial({
    color: colors.starWhite,
    transparent: true,
    opacity: 0.3,
  })

  return new THREE.Line(orbitGeometry, orbitMaterial)
}

/**
 * * Safely clean up a Three.js object
 * @param object Object to clean
 */
export function disposeObject(object: THREE.Object3D): void {
  if (object instanceof THREE.Mesh) {
    if (object.geometry)
      object.geometry.dispose()
    if (object.material) {
      // here we handle cases of multiple materials
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose())
      }
      else {
        object.material.dispose()
      }
    }
    else if (object instanceof THREE.Line) {
      if (object.geometry)
        object.geometry.dispose()
      if (object.material instanceof THREE.Material)
        object.material.dispose()
    }
  }
}
