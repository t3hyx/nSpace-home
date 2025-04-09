<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSolarSystem } from '../composables/useSolarSystem'
import { colors } from '../utils/colorsHelper'

// # Container Ref
const sceneContainer = ref<HTMLElement | null>(null)

const solarSystem = useSolarSystem({
  starsCount: 5000,
  sunSize: 5,
  sunColor: colors.sunOrange,
})

// # Init
onMounted(() => {
  // making sure DOM is ready here
  setTimeout(() => {
    if (sceneContainer.value) {
      // ? DEBUG ----------------------------------
      try {
        console.warn('Threejs Init...')
        solarSystem.initThree(sceneContainer.value)

        console.warn('Camera config...')
        solarSystem.camera.position.set(0, 30, 80)
        solarSystem.camera.lookAt(0, 0, 0)
        solarSystem.camera.updateMatrixWorld()
        solarSystem.camera.updateProjectionMatrix()

        console.warn('Solar System creation...')
        solarSystem.setupSolarSystem()

        console.warn('Animation starting...')
        solarSystem.animate()
      }
      catch (error) {
        console.error('Init Error!! : ', error)
      }
    }
    else {
      console.error('Scene container not available !!')
    }
  }, 100)
})

// # Cleanup
onBeforeUnmount(() => {
  solarSystem.cleanupSolarSystem()
})
</script>

<template>
  <div ref="sceneContainer" class="scene-container" />
</template>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
}
</style>
