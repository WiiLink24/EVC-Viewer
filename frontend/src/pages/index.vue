<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCurrentPolls } from '/backend.ts'

const polls = ref()
const isLoading = ref(true)

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
    <div v-for="poll in polls" :key="poll.question_id">
        <h2>{{ poll.content_english }}</h2>
    </div>
</template>