<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPoll } from '@/backend'

const route = useRoute()
const id = ref(route.params.id) 

const poll = ref()
const isLoading = ref(false)

onMounted(async () => {
    console.log(id.value)
    try {
        isLoading.value = true
        poll.value = await fetchPoll(id.value, language)
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <h1>{{ id }}</h1>
</template>