<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/HeaderPage.vue'
import Footer from '@/components/FooterPage.vue'
</script>

<template>
  <main>
    <Header />
    <Suspense>
      <RouterView />
    </Suspense>
    <Footer />
  </main>
</template>

<style>
@font-face {
    font-family: Rubik;
    src: url(/fonts/Rubik.ttf);
}
@font-face {
    font-family: gilroy;
    src: url(/fonts/Gilroy.otf);
}
</style>