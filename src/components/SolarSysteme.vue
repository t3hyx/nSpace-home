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
      solarSystem.initThree(sceneContainer.value)
      solarSystem.setupSolarSystem()
      solarSystem.animate()
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
