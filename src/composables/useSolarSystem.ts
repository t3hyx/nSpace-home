import type { IPlanet, IPlanetOptions, ISolarSystemOptions } from '../types/types'
import * as THREE from 'three'
import { ref } from 'vue'
import { colors } from '../utils/colorsHelper'
import { createOrbitLine, createStars, disposeObject } from '../utils/threeHelpers'
import { useThreeSetup } from './useThreeSetup'

export function useSolarSystem(options: ISolarSystemOptions = {}) {
  const threeSetup = useThreeSetup()

  // # Default Values
  const defaultOptions = {
    starsCount: 5000,
    sunSize: 5,
    sunColor: colors.sunOrange,
  }
  // # Merging Options
  const config = { ...defaultOptions, ...options }

  // # Refs
  const sun = ref<THREE.Mesh | null>(null)
  const planets = ref<IPlanet[]>([])

  // # Stars Building
  const setupStars = () => {
    const stars = createStars(config.starsCount)
    threeSetup.scene.add(stars)
    return stars
  }

  // # Sun Building
  const setupSun = () => {
    const sunGeometry = new THREE.SphereGeometry(config.sunSize, 32, 32) // ? radius, w-segments, h-segments
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: config.sunColor,
    })
    sun.value = new THREE.Mesh(sunGeometry, sunMaterial)
    threeSetup.scene.add(sun.value)

    // ** Lights
    const sunLight = new THREE.PointLight(colors.starWhite, 2, 300) // ? color, intensity, distance
    const ambientLight = new THREE.AmbientLight(colors.graphiteGrey, 0.7) // ? color, intensity
    sun.value.add(sunLight)
    threeSetup.scene.add(ambientLight)

    return sun.value
  }

  // # Planet Building
  const createPlanet = (options: IPlanetOptions): IPlanet => {
    const { name, size, orbit, color, orbitSpeed } = options

    // ** Geometry, Material & Mesh
    const planetGeometry = new THREE.SphereGeometry(size, 24, 24)
    const planetMaterial = new THREE.MeshLambertMaterial({
      color,
      emissive: colors.pureBlack
    })
    const mesh = new THREE.Mesh(planetGeometry, planetMaterial)

    // ** Random initial angle
    const angle = Math.random() * Math.PI * 2
    mesh.position.x = Math.cos(angle) * orbit
    mesh.position.z = Math.sin(angle) * orbit

    // ** Orbit
    const orbitLine = createOrbitLine(orbit)
    threeSetup.scene.add(orbitLine)

    threeSetup.scene.add(mesh)

    return {
      mesh,
      orbit,
      orbitSpeed,
      angle,
      name,
      orbitLine
    }
  }

  // # Solar System Configuration
  const setupSolarSystem = () => {
    // ** Sun creation
    setupSun()
    // ** Stars creation
    setupStars()
    // ** Planets creation
    const planetData: IPlanetOptions[] = [
      { name: 'Mercury', size: 1.2, orbit: 12, color: colors.mercuryBlue, orbitSpeed: 0.5 },
      { name: 'Venus', size: 1.5, orbit: 19, color: colors.venusOrange, orbitSpeed: 0.25 },
      { name: 'Earth', size: 1.8, orbit: 26, color: colors.earthGreen, orbitSpeed: 0.167 },
      { name: 'Mars', size: 2.1, orbit: 33, color: colors.marsRed, orbitSpeed: 0.125},
      { name: 'Jupiter', size: 2.0, orbit: 40, color: colors.jupiterYellow, orbitSpeed: 0.1},
      { name: 'Saturn', size: 2.4, orbit: 47, color: colors.saturnPurple, orbitSpeed: 0.083},
      { name: 'Uranus', size: 2.8, orbit: 54, color: colors.uranusTeal, orbitSpeed: 0.071},
      { name: 'Neptune', size: 3.2, orbit: 61, color: colors.neptuneBlue, orbitSpeed: 0.063},
    ]
    planets.value = planetData.map(options => createPlanet(options))
  }

  // # Solar System Animation
  const animateSolarSystem = () => {
    if (!sun.value)
      return
    // ** Get elapsed time
    const delta = threeSetup.clock.getDelta()

    // ** Sun rotation
    sun.value.rotation.y += 0.5 * delta

    // ** Planets animation
    planets.value.forEach(planet => {
      planet.angle += planet.orbitSpeed * delta // ? update angle according to speed
      planet.mesh.position.x = Math.cos(planet.angle) * planet.orbit // ? calculate new position
      planet.mesh.position.z = Math.sin(planet.angle) * planet.orbit
      planet.mesh.rotation.y += delta
    })
  }

  // # Animation Loop
  const animate = () => {
    animateSolarSystem()

    // Render
    threeSetup.renderer.render(threeSetup.scene, threeSetup.camera)

    // Resume Animation Loop
    threeSetup.animationFrameId = requestAnimationFrame(animate)
  }

  // # Solar System Cleanup
  const cleanupSolarSystem = () => {
    // ** Cleaning planets
    planets.value.forEach(planet => {
      disposeObject(planet.mesh)
      if (planet.orbitLine) disposeObject(planet.orbitLine)
      threeSetup.scene.remove(planet.mesh)
      if (planet.orbitLine) threeSetup.scene.remove(planet.orbitLine)
    })

    // ** Cleaning sun
    if (sun.value) {
      disposeObject(sun.value)
      threeSetup.scene.remove(sun.value)
    }

    // ** Emptying arrays
    planets.value = []
    sun.value = null
  }

  return {
    ...threeSetup,
    sun,
    planets,
    setupSolarSystem,
    animate,
    cleanupSolarSystem,
  }
}
