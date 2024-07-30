<script setup lang="ts">
import { type Poll } from '@/types'

const props = defineProps<Poll>()
</script>

<template>
    <div>
        <h3>{{ content }}</h3>
        <span>{{ choice1 }}</span>
        <span>{{ choice2 }}</span>
    </div>    
</template>