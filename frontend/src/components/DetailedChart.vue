<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import { type DetailedChart } from '@/types'

let props = defineProps<DetailedChart>()

let male_vote_percentage =
  (100 * props.total_votes.choice1.male) /
  (props.total_votes.choice1.male + props.total_votes.choice2.male)
let female_vote_percentage =
  (100 * props.total_votes.choice1.female) /
  (props.total_votes.choice1.female + props.total_votes.choice2.female)
let male_predictions_percentage =
  (100 * props.total_predictions.choice1.male) /
  (props.total_predictions.choice1.male + props.total_predictions.choice2.male)
let female_predictions_percentage =
  (100 * props.total_predictions.choice1.female) /
  (props.total_predictions.choice1.female + props.total_predictions.choice2.female)

let male_vote_intention_percentage =
  (100 * (props.total_votes.choice1.male + props.total_votes.choice2.male)) /
  (props.total_votes.choice1.total + props.total_votes.choice2.total)
let male_prediction_vote_intention_percentage =
  (100 * (props.total_predictions.choice1.male + props.total_predictions.choice2.male)) /
  (props.total_predictions.choice1.total + props.total_predictions.choice2.total)
</script>

<template>
  <div class="h-auto min-h-10 mt-3 w-full flex flex-row items-stretch gap-1">
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-blue-500 rounded-xl rounded-r-md rounded-bl-md text-right text-white flex items-center justify-between gap-1 relative"
      :style="{
        width: male_vote_intention_percentage + '%'
      }"
    >
      <span class="opacity-60 text-left">
        {{ male_vote_intention_percentage.toFixed(2) + '%' }} ({{
          props.total_votes.choice1.male + props.total_votes.choice2.male
        }}
        votes)
      </span>
      <span><i class="fa-solid fa-person text-2xl"></i></span>
    </span>
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-pink-500 rounded-xl rounded-l-md rounded-br-md text-white flex items-center justify-between gap-1 relative"
      :style="{
        width: 100 - male_vote_intention_percentage + '%'
      }"
    >
      <span><i class="fa-solid fa-person-dress text-2xl"></i></span>
      <span class="opacity-60 text-right">
        {{ (100 - male_vote_intention_percentage).toFixed(2) + '%' }} ({{
          props.total_votes.choice1.female + props.total_votes.choice2.female
        }}
        votes)
      </span>
    </span>
  </div>
  <div class="h-auto min-h-10 mt-1 w-full flex flex-row items-stretch gap-1">
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-r-md rounded-tl-md text-right text-white flex items-center justify-between gap-1 relative"
      :style="{
        width: male_prediction_vote_intention_percentage + '%'
      }"
    >
      <span class="opacity-60 text-left"
        >{{ male_prediction_vote_intention_percentage.toFixed(2) + '%' }} ({{
          props.total_predictions.choice1.male + props.total_predictions.choice2.male
        }}
        votes)</span
      >
      <span class="opacity-30">Prediction</span>
    </span>
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-l-md rounded-tr-md text-white flex items-center justify-between gap-1 relative"
      :style="{
        width: 100 - male_prediction_vote_intention_percentage + '%'
      }"
    >
      <span class="opacity-60 text-right"
        >{{ (100 - male_prediction_vote_intention_percentage).toFixed(2) + '%' }} ({{
          props.total_predictions.choice1.female + props.total_predictions.choice2.female
        }}
        votes)</span
      >
    </span>
  </div>

  <div class="w-full mt-12 flex flex-row items-center gap-1 mb-3">
    <p class="text-white"><i class="fa-solid fa-person-dress"></i> Female statistics</p>
    <hr class="flex-grow border-t-2 border-pink-500 opacity-100" />
  </div>
  <div class="h-auto min-h-10 mt-2 w-full flex flex-row items-stretch gap-1">
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-pink-700/70 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
      :style="{ width: female_vote_percentage + '%' }"
    >
      <span class="opacity-60 text-left"
        >{{ female_vote_percentage.toFixed(2) + '%' }} ({{
          props.total_votes.choice1.female
        }}
        votes)</span
      >
      <span></span>
    </span>
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-green-700/70 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
    >
      <span></span>
      <span class="opacity-60 text-right"
        >{{ (100 - female_vote_percentage).toFixed(2) + '%' }} ({{
          props.total_votes.choice2.female
        }}
        votes)</span
      >
    </span>
  </div>
  <div class="h-auto min-h-10 mt-2 w-full flex flex-row items-stretch gap-1">
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
      :style="{ width: female_predictions_percentage + '%' }"
    >
      <span class="opacity-60 text-left"
        >{{ female_predictions_percentage.toFixed(2) + '%' }} ({{
          props.total_predictions.choice1.female
        }}
        votes)</span
      >
      <span class="opacity-30">Prediction</span>
    </span>
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
      :style="{ width: 100 - female_predictions_percentage + '%' }"
    >
      <span></span>
      <span class="opacity-60 text-right"
        >{{ (100 - female_predictions_percentage).toFixed(2) + '%' }} ({{
          props.total_predictions.choice2.female
        }}
        votes)</span
      >
    </span>
  </div>

  <div class="w-full flex flex-row items-center gap-1 mt-3 mb-3">
    <p class="text-white"><i class="fa-solid fa-person"></i> Male statistics</p>
    <hr class="flex-grow border-t-2 border-blue-500 opacity-100" />
  </div>
  <div class="h-auto min-h-10 mt-2 w-full flex flex-row items-stretch gap-1">
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-pink-700/70 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
      :style="{ width: male_vote_percentage + '%' }"
    >
      <span class="opacity-60 text-left"
        >{{ male_vote_percentage.toFixed(2) + '%' }} ({{
          props.total_votes.choice1.male
        }}
        votes)</span
      >
      <span></span>
    </span>
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-green-700/70 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
      :style="{ width: 100 - male_vote_percentage + '%' }"
    >
      <span></span>
      <span class="opacity-60 text-right"
        >{{ (100 - male_vote_percentage).toFixed(2) + '%' }} ({{
          props.total_votes.choice2.male
        }}
        votes)</span
      >
    </span>
  </div>
  <div class="h-auto mt-2 w-full flex flex-row items-stretch gap-1">
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
      :style="{ width: male_predictions_percentage + '%' }"
    >
      <span class="text-left opacity-60"
        >{{ male_predictions_percentage.toFixed(2) + '%' }} ({{
          props.total_predictions.choice1.male
        }}
        votes)</span
      >
      <span> <span class="opacity-30">Prediction</span></span>
    </span>
    <span
      class="flex-grow p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
      :style="{ width: 100 - male_predictions_percentage + '%' }"
    >
      <span></span>
      <span class="opacity-60 text-right"
        >{{ (100 - male_predictions_percentage).toFixed(2) + '%' }} ({{
          props.total_predictions.choice2.male
        }}
        votes)</span
      >
    </span>
  </div>
</template>
