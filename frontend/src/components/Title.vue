<script setup lang="ts">
import { defineProps, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  name: String,
  icon: String
})

const title = ref(props.name)

onMounted(() => {
  const titleElement = document.getElementById('title')

  const updateStylesOnScroll = () => {
    const scrollY = window.scrollY
    const translateY = Math.min(100, scrollY / 2)
    const opacity = Math.max(0, 0.5 - scrollY / 100)

    titleElement.style.transform = `translateY(${translateY}px)`
    titleElement.style.opacity = `${opacity}`
  }

  window.addEventListener('scroll', updateStylesOnScroll)

  // Cleanup on component unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', updateStylesOnScroll)
  })
})
</script>

<template>
  <h1
    id="title"
    class="text-9xl outline-text uppercase whitespace-nowrap text-ellipsis opacity-50 z-5 relative flex items-center justify-between overflow-hidden invert dark:invert-0"
  >
    {{ title }} <i v-if="icon" :class="icon" class="mobile-hide"></i>
  </h1>
</template>
