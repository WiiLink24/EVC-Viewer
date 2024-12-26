<template>
<div class="container pt-48">
    <button class="text-white px-3 py-1.5 rounded-xl bg-blue-500 text-base" @click="login">Login</button>
    <p>Are you logged in? {{ user }}</p>
</div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { login, user } = useAuth()
console.log(user.value)
</script>