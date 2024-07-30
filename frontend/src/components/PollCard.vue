<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { type Poll } from '@/types'

let props = defineProps<Poll>()
let index = props.index

let formattedType = props.type

if (props.type === 'n') {
  formattedType = '<i class="fa-solid fa-flag"></i> National'
} else if (props.type === 'w') {
  formattedType = '<i class="fa-solid fa-globe-americas"></i> Worldwide'
}

let formattedDate = new Date(props.date).toLocaleDateString()

let randomPercentage = Math.floor(Math.random() * 51) + 25
let randomPercentage1 = ref(`${randomPercentage}%`)
let randomPercentage2 = ref(`${100 - randomPercentage}%`)
</script>

<template>
  <div class="poll-hover pl-1 pr-1 pb-1 bg-white rounded-[20px]">
    <div
      class="poll-hover-metadata pt-1 pl-2 pr-2 flex flex-row items-center justify-between text-black"
    >
      <span v-html="formattedType" class="font-bold translate-y-[2px]"></span>
      <span class="opacity-60 translate-y-[2px] text-right"
        >{{ category }} | {{ formattedDate }}</span
      >
    </div>
    <div class="pt-2 pb-2 p-[6px] rounded-2xl bg-gradient-to-b from-gray-900 to-gray-700">
      <h3 class="p-3 bg-black rounded-t-xl rounded-b-md text-center text-xl">{{ content }}</h3>
      <div class="poll-hover-responses mt-2 w-full flex flex-row items-center gap-1">
        <span
          class="poll-response p-1 pl-5 pr-5 bg-pink-700 rounded-xl text-right block relative"
          :style="{ width: randomPercentage1 }"
        >
          {{ choice1 }}
        </span>
        <span
          class="poll-response p-1 pl-5 pr-5 bg-green-700 rounded-xl block relative"
          :style="{ width: randomPercentage2 }"
        >
          {{ choice2 }}
        </span>
      </div>
    </div>
  </div>
</template>
