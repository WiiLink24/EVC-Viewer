<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fetchCurrentPolls } from '@/backend'
import { countries } from '@/countries';
import PollCard from '@/components/PollCard.vue'
import PageNavigation from '@/components/PageNavigation.vue'

const polls = ref()
const isLoading = ref(true)

const language = ref('english')
const available_languages = ['english', 'french', 'german', 'italian', 'spanish', 'dutch', 'portuguese', 'french_canada']
const formatted_languages = ['English', 'French', 'German', 'Italian', 'Spanish', 'Dutch', 'Portuguese', 'French (Canada)']

const limit = ref(20)
const current_page = ref(1)
const total_pages = ref()
const total_items = ref()

const countries_data = ref(countries)

const updateCurrentPage = (newPage: number) => {
  current_page.value = newPage
}

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await fetchCurrentPolls(1, language.value, limit.value)
    total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items)
    polls.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

watch(language, async (newLanguage) => {
  try {
    isLoading.value = true
    const response = await fetchCurrentPolls(1, newLanguage, limit.value)
    total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items)
    polls.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

watch(limit, async (newLimit) => {
  try {
    isLoading.value = true
    const response = await fetchCurrentPolls(1, language.value, newLimit)
    total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items)
    polls.value = response.data

    if (current_page.value > total_pages.value) {
      current_page.value = total_pages.value
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

watch(current_page, async (newPage) => {
  try {
    isLoading.value = true
    const response = await fetchCurrentPolls(newPage, language.value, limit.value)
    /* total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items) */
    polls.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
    <h1>AAAA</h1>
    <select v-model="language">
      <option v-for="(lang, index) in available_languages" :value="lang" :key="lang">{{ formatted_languages[index] }}</option>
    </select>
    <select v-model="limit">
      <option v-for="i in 5" :value="i * 20" :key="i">{{ i * 20 }}</option>
    </select>
    <PageNavigation v-if="polls" :total_pages="total_pages" :current_page="current_page" @update:current_page="updateCurrentPage" />
    <div v-if="isLoading">Loading...</div>
    <div v-for="poll in polls">
      <RouterLink to="`/polls/${poll.question_id}`">
        <PollCard v-bind="poll" :key="poll.question_id" />
      </RouterLink>
    </div>
    
</template>