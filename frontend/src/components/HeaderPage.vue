<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 1
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
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
    <nav class="flex gap-10 items-center">
      <ul class="flex gap-2 items-center mobile-hide-flex">
        <li>
          <a
            href="/#top"
            class="header-link text-black"
            active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
            ><i class="fa-solid fa-house"></i> Home</a
          >
        </li>
        <li>
          <a
            href="/#active"
            class="header-link text-black"
            active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
            ><i class="fa-solid fa-chart-simple"></i> Active Polls</a
          >
        </li>
        <li>
          <a
            href="/#past"
            class="header-link text-black"
            active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
            ><i class="fa-solid fa-rotate-left"></i> Past Polls</a
          >
        </li>
        <li class="opacity-30 mr-3">|</li>
        <a
          href="/search"
          class="bg-gray-400/30 dark:bg-gray-200/30 px-4 py-2 w-80 text-black dark:text-white flex justify-between items-center rounded-lg hover:no-underline hover:shadow-xl hover:scale-105 shadow-slate-400 transition-all"
          ><i class="fa-solid fa-magnifying-glass mr-2"></i>Search...</a
        >
      </ul>
      <div
        class="mobile-show hidden"
        onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"
      >
        <i class="fa-solid fa-bars text-3xl"></i>
      </div>
    </nav>
  </header>
  <div id="mobile-menu" class="bg-gray-200 dark:bg-slate-700 hidden">
    <ul
      class="left-1/2 -translate-x-1/2 w-[calc(100%-30px)] mt-24 flex flex-col gap-2 items-center relative"
    >
      <a
        href="/search"
        class="bg-gray-400/30 dark:bg-gray-200/30 px-4 py-2 w-full text-black dark:text-white flex justify-between items-center rounded-lg hover:no-underline hover:shadow-xl hover:scale-105 shadow-slate-400 transition-all"
        onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"
        ><i class="fa-solid fa-magnifying-glass mr-2"></i>Search...</a
      >
      <hr class="w-full mt-3 mb-3 border-t-black dark:border-t-white" />
      <li class="w-full">
        <a
          href="/#top"
          class="w-full block header-link text-black"
          active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
          onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"
          ><i class="fa-solid fa-house"></i> Home</a
        >
      </li>
      <li class="w-full">
        <a
          href="/#active"
          class="w-full block header-link text-black"
          active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
          onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"
          ><i class="fa-solid fa-chart-simple"></i> Active Polls</a
        >
      </li>
      <li class="w-full">
        <a
          href="/#past"
          class="w-full block header-link text-black"
          active-class="bg-gray-300/80 dark:bg-white/20 scale-[0.97] transition"
          onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"
          ><i class="fa-solid fa-rotate-left"></i> Past Polls</a
        >
      </li>
    </ul>
    <a
      class="left-1/2 -translate-x-1/2 w-[95%] mt-3 justify-center inline-flex flex-row gap-1 items-center bg-[#2bca38] hover:bg-green-600 hover:scale-105 hover:shadow-xl hover:shadow-green-400/10 hover:no-underline transition-all px-8 py-3 rounded-xl text-white border-2 border-gray-200/10 relative"
      href="https://www.wiilink24.com/"
      ><img
        src="/img/favicon.png"
        alt="WiiLink Logo"
        style="filter: brightness(10000); height: 20px !important"
      />
      Install WiiLink</a
    >
  </div>
</template>
