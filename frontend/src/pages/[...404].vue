<script setup lang="ts">
import ReturnBtn from '@/components/ReturnBtn.vue'
import Title from '@/components/Title.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: '404 | EVC Viewing Tool',
  meta: [
    { name: 'description', content: 'The content you were looking for could not be found...' },
    { property: 'og:image', content: '/img/evcseobg.png' }
  ]
})
</script>

<template>
 <div
    class="top-24 left-1/2 w-[95%] h-[calc(100vh-300px)] -translate-x-1/2 p-20 flex flex-col items-center justify-center gap-3 backdrop-blur-lg rounded-2xl border-4 border-dashed border-gray-400/10 dark:border-slate-400/10 text-xl dark:text-white relative"
  >
    <p class="max-w-[950px] flex flex-col items-center justify-center gap-3 text-center">
      <span class="text-6xl"><i class="fa-solid fa-bomb"></i> <b>404</b></span>
      The page you were looking for could not be found <br /><br />
      <span
        class="mt-8 p-5 rounded-xl bg-gray-400 dark:bg-slate-700 text-sm text-left opacity-60 hover:opacity-100 transition-all"
      >
        <i class="fa-solid fa-question-circle"></i><b> Reasons why you might be seeing this</b
        ><br />
        You may have followed a broken link to a non-existent PollID. Verify the URL and try
        again.
      </span>
      <br /><br />
      <a href="/"
        ><i class="fa-solid fa-chevron-left"></i> <span class="underline">Go back</span></a
      >
    </p>
  </div>
</template>
