<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { searchPolls } from '@/backend'
import Title from '@/components/Title.vue'
import PollCard from '@/components/PollCard.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Search | EVC Viewing Tool',
  meta: [
    {
      name: 'description',
      content: 'Search all of our Mii database and download them for yourself!'
    },
    { property: 'og:image', content: '/img/cmocseobg.png' }
  ]
})

let search_field = ref('')
let search_results = ref()

const isLoading = ref(false)

const language = ref('english')
const available_languages = [
  'english',
  'french',
  'german',
  'italian',
  'spanish',
  'dutch',
  'portuguese',
  'french_canada'
]
const formatted_languages = [
  '🇬🇧 English',
  '🇫🇷 French',
  '🇩🇪 German',
  '🇮🇹 Italian',
  '🇪🇸 Spanish',
  '🇳🇱 Dutch',
  '🇵🇹 Portuguese',
  '🇨🇦 French (Canada)'
]

if (localStorage.getItem('language') === null) {
  localStorage.setItem('language', 'english')
}

const searchQuery = async () => {
  isLoading.value = true
  try {
    search_results.value = await searchPolls(search_field.value, language.value)
  } catch (error) {
    search_results.value = null
  }
  isLoading.value = false
}

watch(language, (newVal) => {
  localStorage.setItem('language', newVal)
})

onMounted(() => {
  language.value = localStorage.getItem('language') || 'english'
})
</script>

<template>
  <div class="w-full h-full absolute z-0 blur-sm"></div>
  <div
    class="top-0 left-0 w-full h-80 absolute dissolve"
    style="
      background: linear-gradient(
        33deg,
        rgba(217, 114, 118, 1) 0%,
        rgba(73, 199, 44, 1) 39%,
        rgba(26, 228, 207, 1) 80%,
        rgba(36, 189, 240, 1) 100%
      );
    "
  ></div>
  <div class="top-10 left-1/2 -translate-x-1/2 w-[95%] max-w-[1090px] translate-y-14 relative">
    <Title icon="fa-solid fa-magnifying-glass" name="Search" />
    <div class="w-full -translate-y-8 flex flex-row gap-1 relative">
      <input
        class="w-full p-3 bg-gray-200/60 dark:bg-slate-500/60 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-slate-600 focus:bg-gray-300 dark:focus:bg-slate-700 transition-all relative rounded-l-[18px] rounded-r-[4px] dark:text-white"
        v-model="search_field"
        type="text"
        placeholder="Search for Miis or Artisans by Name, ID or Initials..."
        @keyup.enter="searchQuery(), (current_page = 1)"
        :autofocus="true"
      />
      <select
        v-model="language"
        class="w-12 sm:w-auto pl-3 pr-6 bg-gray-200/60 dark:bg-slate-600/60 hover:bg-gray-300 dark:hover:bg-slate-700 backdrop-blur-md rounded-[4px] dark:text-white transition-all relative"
      >
        <option v-for="(lang, index) in available_languages" :value="lang" :key="lang">
          {{ formatted_languages[index] }}
        </option>
      </select>
      <button
        @click="searchQuery(), (current_page = 1)"
        class="p-3 pl-4 pr-4 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-700 transition-all rounded-l-[4px] rounded-r-[18px]"
      >
        <i class="fas fa-search dark:text-white"></i>
      </button>
    </div>

    <ul v-if="search_results != null" class="mb-20 flex flex-col gap-3 w-full translate-y-8 relative">
      <li
        id="active"
        v-for="(poll, index) in search_results"
        :key="poll.question_id"
        class="w-full sm:h-24 -translate-y-8 hover:z-50"
      >
        <RouterLink
          :to="`/polls/${poll.question_id}`"
          class="animate-fadeUp"
          :style="{ opacity: 0, animationDelay: `${15 * index}ms` }"
        >
          <div :class="poll.type === 'n' ? 'national' : poll.type === 'w' ? 'worldwide' : ''">
            <PollCard v-bind="poll" :index="index" />
          </div>
        </RouterLink>
      </li>
    </ul>
    <div
      v-else-if="search_results === null"
      class="p-20 w-full h-30 rounded-[18px] border-4 border-gray-400 dark:border-slate-500 border-dashed flex items-center justify-center relative"
    >
      <div class="flex flex-col items-center gap-3 text-gray-500 dark:text-slate-400">
        <div class="flex flex-row gap-3 items-center">
          <i class="fa-solid fa-bomb text-6xl"></i>
        </div>
        <p class="sm:w-96 w-full text-center relative opacity-60">
          Your search yielded no results. Change your query and try again.
        </p>
      </div>
    </div>
    <div
      v-else
      class="p-20 w-full h-30 rounded-[18px] border-4 border-gray-400 dark:border-slate-500 border-dashed flex items-center justify-center relative"
    >
      <div class="flex flex-col items-center gap-3 text-gray-500 dark:text-slate-400">
        <div class="flex flex-row gap-3 items-center">
          <i class="fa-solid fa-magnifying-glass text-6xl"></i>
        </div>
        <p class="sm:w-96 w-full text-center relative opacity-60">
          To begin searching, type your query in the box and press the enter key or
          <i class="fa-solid fa-magnifying-glass"></i> Search icon.
        </p>
      </div>
    </div>
  </div>
</template>
