<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCurrentPolls } from '@/backend'
import { countries } from '@/countries';
import PollCard from '@/components/PollCard.vue'

const polls = ref()
const isLoading = ref(true)

const countries_data = ref(countries)
console.log(countries_data.value)
console.log(countries_data.value[1].Name)

console.log(countries[1].Name)

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await fetchCurrentPolls(2)
    polls.value = response.data
    console.log(polls.value)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
    <h1>AAAA</h1>
    <div v-for="poll in polls">
      <RouterLink to="`/polls/${poll.question_id}`">
        <PollCard v-bind="poll" :key="poll.question_id" />
      </RouterLink>
    </div>
    
</template>