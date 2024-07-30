<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPoll } from '@/backend'

const route = useRoute()
const id = ref(route.params.id)

const isLoading = ref(false)

const poll = ref()
const poll_data = ref()
const votes_data = ref()
const details_data = ref()

const language = ref(localStorage.getItem('language') || 'english')
const country = ref(parseInt(localStorage.getItem('country')) || 49)

onMounted(async () => {
    console.log(id.value)
    try {
        isLoading.value = true
        console.log(language.value)
        poll.value = await fetchPoll(id.value, language.value)
        poll_data.value = poll.value.poll_data
        votes_data.value = poll.value.results_data
        console.log(poll.value)
        console.log(poll_data.value)
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div v-if="poll">
        <h1>{{ poll_data.content }}</h1>
        <span>{{ poll_data.choice1 }}</span><span>{{ poll_data.choice2 }}</span>
        <span v-if="poll_data.type = 'n'">National poll</span>
        <span v-else-if="poll_data.type = 'w'">Worldwide poll</span>

        <!-- use votes_data to fetch results-->
        <!-- <span>{{ votes_data.total_votes }}</span> -->
    </div>

</template>