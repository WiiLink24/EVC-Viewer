<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { type Poll } from '../utils/types'

let props = defineProps<Poll>()

function dateDifference(date: string) {
  let currentDate = new Date()
  let pollDate = new Date(date)
  let difference = currentDate.getTime() - pollDate.getTime()
  let daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24))
  return daysDifference
}

let formattedDate = new Date(props.date).toLocaleDateString()
let isActive = false
let isNew = false

if (dateDifference(props.date) === 0) {
  formattedDate = 'Today'
  isNew = true
} else if (dateDifference(props.date) === 1) {
  formattedDate = 'Yesterday'
  isNew = true
} else if (dateDifference(props.date) > 1 && dateDifference(props.date) < 7) {
  formattedDate = `${dateDifference(props.date)} days ago`
}

if (dateDifference(props.date) <= 7 && props.type === 'n') {
  isActive = true
}
if (dateDifference(props.date) <= 14 && props.type === 'w') {
  isActive = true
}

let randomPercentage = Math.floor(Math.random() * 51) + 25
let randomPercentage1 = ref(`${randomPercentage}%`)
let randomPercentage2 = ref(`${100 - randomPercentage}%`)
</script>

<template>
  <div class="poll-hover pl-1 pr-1 pb-1 bg-gray-200 dark:bg-white rounded-[20px]">
    <div
      v-if="isNew === true"
      class="isNew left-0 top-0 w-20 bg-yellow-300 text-black text-center rounded-tl-xl rounded-br-xl p-1 transition-all absolute"
    >
      <i class="fa-solid fa-envelope-open"></i>
    </div>
    <div
      class="poll-hover-metadata pt-1 pl-2 pr-2 flex flex-row items-center justify-between text-black"
    >
      <span v-if="props.type === 'n'" class="font-bold translate-y-[2px]"><i class="fa-solid fa-flag"></i> National</span>
      <span v-else-if="props.type === 'w'" class="font-bold translate-y-[2px]"><i class="fa-solid fa-globe-americas"></i> Worldwide</span>
      <span class="opacity-60 translate-y-[2px] text-right"
        >{{ category }} | {{ formattedDate }}
        <i
          v-if="isActive === false"
          class="fa-solid fa-circle-info ml-1"
          title="Click to View More"
        ></i>
        <span v-if="isNew === true">| <i class="fa-solid fa-envelope-open"></i> New!</span>
      </span>
    </div>
    <div class="pt-2 pb-2 p-[6px] rounded-2xl bg-gradient-to-b from-gray-900 to-gray-700">
      <h3
        class="border-black border-[0.75em] bg-black rounded-t-xl rounded-b-md text-center text-xl text-white sm:line-clamp-1"
        :title="content"
      >
        {{ content }}
      </h3>
      <div class="poll-hover-responses mt-2 w-full flex flex-row items-stretch gap-1">
        <span
          class="flex-grow flex items-center justify-end poll-response poll-response p-1 pl-5 pr-5 bg-pink-700 rounded-xl text-right relative dark:text-white"
          :style="{ width: randomPercentage1 }"
        >
          {{ choice1 }}
        </span>
        <span
          class="flex-grow flex items-center poll-response p-1 pl-5 pr-5 bg-green-700 rounded-xl relative dark:text-white"
          :style="{ width: randomPercentage2 }"
        >
          {{ choice2 }}
        </span>
      </div>
    </div>
  </div>
</template>
