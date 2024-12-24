<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const props = defineProps({
  name: String,
  icon: String
})

const { y } = useWindowScroll()
const translateY = computed(() => Math.min(100, y.value / 2))
const opacity = computed(() => Math.max(0, 0.5 - y.value / 100))

</script>

<template>
  <h1
    class="text-9xl outline-text uppercase whitespace-nowrap text-ellipsis opacity-50 z-5 relative flex items-center justify-between overflow-hidden invert dark:invert-0"
    :class="`translate-y-[${translateY}] opacity-[${opacity}]`"
  >
    {{ props.name }} <Icon v-if="icon" :name="icon" class="outline-text" />
  </h1>
</template>
