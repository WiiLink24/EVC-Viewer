<script setup lang="ts">
import Title from '~/components/Title.vue'
import PollCard from '~/components/PollCard.vue'
import { useHead } from '@unhead/vue'
import { useStorage } from '@vueuse/core'
import { type Poll } from '#build/imports'

useHead({
  title: 'Search | EVC Viewing Tool',
  meta: [
    {
      name: 'description',
      content: 'Search all of our Poll database!'
    },
    { property: 'og:image', content: '/img/cmocseobg.png' }
  ]
})

let search_field = ref<string>('')
let search_results = ref<Poll[]>()

const isLoading = ref(false)

const language = useStorage('language', 'english')
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

const searchQuery = async () => {
  isLoading.value = true
  search_results.value = await $fetch('/api/polls/search', {
    method: 'POST',
    body: JSON.stringify({
      search: search_field.value,
  }),
  query: {
    language: language.value
  }
})
  isLoading.value = false
}

</script>

<template>
  <div class="w-full h-full absolute z-0 blur-sm"></div>
<div class="top-0 left-0 w-full h-80 absolute dissolve bg-gradient-to-br from-[#d97276] via-[#49c72c] via-[#1ae4cf] to-[#24bdf0]"></div>
  <div class="top-10 left-1/2 -translate-x-1/2 w-[95%] max-w-[1090px] translate-y-14 relative">
    <Title icon="fa6-solid:magnifying-glass" name="Search" />
    <div class="w-full -translate-y-8 flex flex-row gap-1 relative">
      <input
        class="w-full p-3 bg-gray-200/60 dark:bg-slate-500/60 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-slate-600 focus:bg-gray-300 dark:focus:bg-slate-700 transition-all relative rounded-l-[18px] rounded-r-[4px] dark:text-white"
        v-model="search_field"
        type="text"
        placeholder="Search for Polls in the database..."
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
        <Icon name="fa6-solid:magnifying-glass" class="text-white" />
      </button>
    </div>

    <ul v-if="search_results != null" class="mb-20 flex flex-col gap-3 w-full translate-y-8 relative">
      <li
        id="active"
        v-for="(poll, index) in search_results"
        :key="poll.questionId"
        class="w-full sm:h-24 -translate-y-8 hover:z-50"
      >
        <NuxtLink
          :to="`/polls/${poll.questionId}`"
          class="animate-fadeUp"
          :style="{ opacity: 0, animationDelay: `${15 * index}ms` }"
        >
          <div :class="poll.type === 'n' ? 'national' : poll.type === 'w' ? 'worldwide' : ''">
            <PollCard v-bind="poll" :index="index" />
          </div>
        </NuxtLink>
      </li>
    </ul>
    <div
      v-else-if="search_results === null"
      class="p-20 w-full h-30 rounded-[18px] border-4 border-gray-400 dark:border-slate-500 border-dashed flex items-center justify-center relative"
    >
      <div class="flex flex-col items-center gap-3 text-gray-500 dark:text-slate-400">
        <div class="flex flex-row gap-3 items-center">
          <Icon name="fa6-solid:bomb" size="60" />
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
          <Icon name="fa6-solid:magnifying-glass" size="60" />
        </div>
        <p class="sm:w-96 w-full text-center relative opacity-60">
          To begin searching, type your query in the box and press the enter key or
          <Icon name="fa6-solid:magnifying-glass" /> Search icon.
        </p>
      </div>
    </div>
  </div>
</template>
