<template>
<div class="pt-48">
    <button class="text-white px-3 py-1.5 rounded-xl bg-blue-500 text-base" @click="login">Login</button>
    <p>Are you logged in? {{ user }}</p>
    <button @click="fetchData">Fetch user info</button>
</div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { login, user } = useAuth()

</script>