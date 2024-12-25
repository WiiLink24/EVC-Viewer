<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const { y } = useScroll(window)
const isScrolled = computed(() => y.value > 1)

const isMenuOpen = ref<boolean>(false)
</script>

<template>
  <header
    :class="{
      'backdrop-blur-md shadow-md bg-gray-400/50 dark:bg-slate-600/50 transition-all': isScrolled
    }"
    class="w-full flex items-center justify-between dark:text-white md:px-8 lg:px-8 px-4 py-4 z-10 fixed"
  >
    <img
      src="/img/viewingTool-logo.png"
      alt="WiiLink Mii Contest Channel Viewer Logo"
      class="dark:invert !h-[50px]"
    />
    <button
        class="lg:hidden relative z-10"
        @click="isMenuOpen = !isMenuOpen"
      >
        <Icon name="fa6-solid:bars" class="text-3xl" />
      </button>
    <nav class="flex gap-10 items-center fixed top-0 left-0 w-screen h-screen lg:inline lg:w-auto lg:h-auto lg:static" :class="{ 'hidden': !isMenuOpen }">
      <ul class="lg:flex gap-2 items-center w-screen lg:w-auto">
        <li>
          <NuxtLink
            to="/#top"
            class="header-link text-black"
            active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
            @click="isMenuOpen = false"
            ><Icon name="fa6-solid:house" /> Home</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/#active"
            class="header-link text-black"
            active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
            @click="isMenuOpen = false"
            ><Icon name="fa6-solid:chart-simple" /> Active Polls</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/#past"
            class="header-link text-black"
            active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
            @click="isMenuOpen = false"
            ><Icon name="fa6-solid:rotate-left" /> Past Polls</NuxtLink
          >
        </li>
        <li class="opacity-30 mr-3">|</li>
        <NuxtLink
          to="/search"
          class="bg-gray-400/30 dark:bg-gray-200/30 px-4 py-2 w-80 text-black dark:text-white flex justify-between items-center rounded-lg hover:no-underline hover:shadow-xl hover:scale-105 shadow-slate-400 transition-all"
          @click="isMenuOpen = false"
          ><Icon name="fa6-solid:magnifying-glass" class="mr-2" />Search...</NuxtLink
        >
        <li class="opacity-30 ml-3">
          <button class="flex items-center transition-all hover:bg-white/10 p-2 rounded-lg" aria-label="Login to WiiLink Accounts">
            <Icon name="fa6-solid:arrow-right-to-bracket" size="24" />
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>
