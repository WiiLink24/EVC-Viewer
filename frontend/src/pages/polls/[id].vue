<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPoll } from '@/backend'
import Title from '@/components/Title.vue'

const route = useRoute()
const id = ref(route.params.id)

const isLoading = ref(false)

const poll = ref()
const poll_data = ref()
const votes_data = ref()
const details_data = ref()
let formattedType = ''
let formattedDate = ''
let female_vote_percentage
let female_predictions_percentage
let male_vote_percentage
let male_predictions_percentage

const language = ref(localStorage.getItem('language') || 'english')
const country = ref(parseInt(localStorage.getItem('country')) || 49)
const region = ref(parseInt(localStorage.getItem('region')) || 1)
let details = (localStorage.getItem('details') === 'true');
console.log(details)

onMounted(async () => {
  try {
    isLoading.value = true
    poll.value = await fetchPoll(id.value, language.value, country.value, region.value, details)
    poll_data.value = poll.value.poll_data
    votes_data.value = poll.value.results_data
    let female_vote =
      votes_data.value.total_votes.choice1.female + votes_data.value.total_votes.choice2.female
    female_vote_percentage = (votes_data.value.total_votes.choice2.female / female_vote) * 100
    let male_vote =
      votes_data.value.total_votes.choice1.male + votes_data.value.total_votes.choice2.male
    male_vote_percentage = (votes_data.value.total_votes.choice2.male / male_vote) * 100
    let female_predictions =
      votes_data.value.total_predictions.choice1.female +
      votes_data.value.total_predictions.choice2.female
    female_predictions_percentage =
      (votes_data.value.total_predictions.choice2.female / female_predictions) * 100
    let male_predictions =
      votes_data.value.total_predictions.choice1.male +
      votes_data.value.total_predictions.choice2.male
    male_predictions_percentage =
      (votes_data.value.total_predictions.choice2.male / male_predictions) * 100

    if (poll_data.value.type === 'n') {
      formattedType = '<i class="fa-solid fa-flag"></i> National'
    } else if (poll_data.value.type === 'w') {
      formattedType = '<i class="fa-solid fa-globe-americas"></i> Worldwide'
    }
    let isActive = false
    let isNew = false
    formattedDate = new Date(poll_data.value.date).toLocaleDateString()

    if (dateDifference(poll_data.value.date) === 0) {
      formattedDate = 'Today'
      isNew = true
    } else if (dateDifference(poll_data.value.date) === 1) {
      formattedDate = 'Yesterday'
      isNew = true
    } else if (
      dateDifference(poll_data.value.date) > 1 &&
      dateDifference(poll_data.value.date) < 7
    ) {
      formattedDate = `${dateDifference(poll_data.value.date)} days ago`
    }
    if (dateDifference(poll_data.value.date) <= 7 && poll_data.value.type === 'n') {
      isActive = true
    }
    if (dateDifference(poll_data.value.date) <= 14 && poll_data.value.type === 'w') {
      isActive = true
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

function dateDifference(date: string) {
  let currentDate = new Date()
  let pollDate = new Date(date)
  let difference = currentDate.getTime() - pollDate.getTime()
  let daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24))
  return daysDifference
}
</script>

<template>
  <div
    v-if="isLoading"
    class="w-full h-[calc(100vh-160px)] p-20 flex flex-col items-center justify-center gap-3 backdrop-blur-lg rounded-2xl border-4 border-dashed border-gray-400/10 dark:border-slate-400/10 -translate-y-16 text-xl dark:text-white"
  >
    <img src="/img/loading.gif" class="h-10 brightness-[1000]" /> Getting this poll data ready...
  </div>
  <div v-if="poll" class="top-24 left-1/2 -translate-x-1/2 2 relative w-[95%] sm:max-w-[900px]">
    <Title :name="poll_data.content.substring(0, 10) + '...'" />
    <div class="-top-10 pl-1 pr-1 pb-1 bg-white rounded-[20px] relative">
      <div
        v-if="poll_data.isNew === true"
        class="isNew left-0 top-0 w-20 bg-yellow-300 text-black text-center rounded-tl-xl rounded-br-xl p-1 transition-all absolute"
      >
        <i class="fa-solid fa-envelope-open"></i>
      </div>
      <div class="h-11 pt-1 pl-2 pr-2 flex flex-row items-center justify-between text-black">
        <span v-html="formattedType" class="font-bold"></span>
        <span class="opacity-60 text-right"
          >{{ poll_data.category }} | {{ formattedDate }}
          <i
            v-if="poll_data.isActive === false"
            class="fa-solid fa-circle-info ml-1"
            title="Click to View More"
          ></i>
          <span v-if="poll_data.isNew === true"
            >| <i class="fa-solid fa-envelope-open"></i> New!</span
          >
        </span>
      </div>
      <div class="pt-2 pb-2 p-[6px] rounded-2xl bg-gradient-to-b from-gray-900 to-gray-700">
        <h3
          class="p-3 bg-black rounded-t-xl rounded-b-md text-center text-xl text-white"
          :title="poll_data.content"
        >
          {{ poll_data.content }}
        </h3>
        <div class="h-10 mt-2 w-full flex flex-row items-center gap-1">
          <span
            class="h-full p-1 pl-5 pr-5 bg-pink-700 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
            :style="{ width: votes_data.total_votes_percentage.choice1.total + '%' }"
          >
            <span class="opacity-60">{{
              votes_data.total_votes_percentage.choice1.total.toFixed(2) + '%'
            }}</span>
            <span>{{ poll_data.choice1 }}</span>
          </span>
          <span
            class="h-full p-1 pl-5 pr-5 bg-green-700 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
            :style="{ width: votes_data.total_votes_percentage.choice2.total + '%' }"
          >
            <span>{{ poll_data.choice2 }}</span>
            <span class="opacity-60">{{
              votes_data.total_votes_percentage.choice2.total.toFixed(2) + '%'
            }}</span>
          </span>
        </div>
        <div class="h-10 mt-2 w-full flex flex-row items-center gap-1">
          <span
            class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
            :style="{ width: votes_data.total_predictions_percentage.choice1.total + '%' }"
          >
            <span class="opacity-60">{{
              votes_data.total_predictions_percentage.choice1.total.toFixed(2) + '%'
            }}</span>
            <span class="opacity-30">Prediction</span>
          </span>
          <span
            class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
            :style="{ width: votes_data.total_predictions_percentage.choice2.total + '%' }"
          >
            <span></span>
            <span class="opacity-60">{{
              votes_data.total_predictions_percentage.choice2.total.toFixed(2) + '%'
            }}</span>
          </span>
        </div>
      </div>
    </div>
    <p class="-top-8 text-right opacity-30 relative">
      {{ votes_data.total_votes.total }} votes received
    </p>
    <hr class="w-full mb-10 border-t-2 border-white" />
    <div class="flex flex-row items-center justify-between gap-1">
      <p>Voter turnout</p>
      <p class="opacity-30">Number of votes received, regardless of choice</p>
    </div>
    <div class="h-10 mt-3 w-full flex flex-row items-center gap-1">
      <span
        class="h-full p-1 pl-5 pr-5 bg-blue-500 rounded-xl rounded-r-md rounded-bl-md text-right text-white flex items-center justify-between gap-1 relative"
        :style="{
          width:
            (votes_data.total_votes_percentage.choice1.male +
              votes_data.total_votes_percentage.choice2.male) /
              2 +
            '%'
        }"
      >
        <span class="opacity-60"
          >{{
            (
              (votes_data.total_votes_percentage.choice1.male +
                votes_data.total_votes_percentage.choice2.male) /
              2
            ).toFixed(2) + '%'
          }}
          ({{
            votes_data.total_votes.choice1.male + votes_data.total_votes.choice2.male
          }}
          votes)</span
        >
        <span><i class="fa-solid fa-person"></i> Male</span>
      </span>
      <span
        class="h-full p-1 pl-5 pr-5 bg-pink-500 rounded-xl rounded-l-md rounded-br-md text-white flex items-center justify-between gap-1 relative"
        :style="{
          width:
            (votes_data.total_votes_percentage.choice1.female +
              votes_data.total_votes_percentage.choice2.female) /
              2 +
            '%'
        }"
      >
        <span><i class="fa-solid fa-person-dress"></i> Female</span>
        <span class="opacity-60"
          >{{
            (
              (votes_data.total_votes_percentage.choice1.female +
                votes_data.total_votes_percentage.choice2.female) /
              2
            ).toFixed(2) + '%'
          }}
          ({{
            votes_data.total_votes.choice1.female + votes_data.total_votes.choice2.female
          }}
          votes)</span
        >
      </span>
    </div>
    <div class="h-10 mt-1 w-full flex flex-row items-center gap-1">
      <span
        class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-r-md rounded-tl-md text-right text-white flex items-center justify-between gap-1 relative"
        :style="{
          width:
            (votes_data.total_predictions_percentage.choice1.male +
              votes_data.total_predictions_percentage.choice2.male) /
              2 +
            '%'
        }"
      >
        <span class="opacity-60"
          >{{
            (
              (votes_data.total_predictions_percentage.choice1.male +
                votes_data.total_predictions_percentage.choice2.male) /
              2
            ).toFixed(2) + '%'
          }}
          ({{
            votes_data.total_predictions.choice1.male + votes_data.total_predictions.choice2.male
          }}
          votes)</span
        >
        <span class="opacity-30">Prediction</span>
      </span>
      <span
        class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-l-md rounded-tr-md text-white flex items-center justify-between gap-1 relative"
        :style="{
          width:
            (votes_data.total_predictions_percentage.choice1.female +
              votes_data.total_predictions_percentage.choice2.female) /
              2 +
            '%'
        }"
      >
        <span></span>
        <span class="opacity-60"
          >{{
            (
              (votes_data.total_predictions_percentage.choice1.female +
                votes_data.total_predictions_percentage.choice2.female) /
              2
            ).toFixed(2) + '%'
          }}
          ({{
            votes_data.total_predictions.choice2.female +
            votes_data.total_predictions.choice2.female
          }}
          votes)</span
        >
      </span>
    </div>

    <div class="w-full mt-12 flex flex-row items-center gap-1 mb-3">
      <p class="text-white"><i class="fa-solid fa-person-dress"></i> Female statistics</p>
      <hr class="flex-grow border-t-2 border-pink-500 opacity-100" />
    </div>
    <div class="h-10 mt-2 w-full flex flex-row items-center gap-1">
      <span
        class="h-full p-1 pl-5 pr-5 bg-pink-500 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
        :style="{ width: 100 - female_vote_percentage + '%' }"
      >
        <span class="opacity-60"
          >{{ (100 - female_vote_percentage).toFixed(2) + '%' }} ({{
            votes_data.total_votes.choice1.female
          }}
          votes)</span
        >
        <span>{{ poll_data.choice1 }}</span>
      </span>
      <span
        class="h-full p-1 pl-5 pr-5 bg-pink-500 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
        :style="{ width: female_vote_percentage + '%' }"
      >
        <span>{{ poll_data.choice2 }}</span>
        <span class="opacity-60 text-left"
          >{{ female_vote_percentage.toFixed(2) + '%' }} ({{
            votes_data.total_votes.choice2.female
          }}
          votes)</span
        >
      </span>
    </div>
    <div class="h-10 mt-2 w-full flex flex-row items-center gap-1">
      <span
        class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
        :style="{ width: 100 - female_predictions_percentage + '%' }"
      >
        <span class="opacity-60 text-left"
          >{{ (100 - female_predictions_percentage).toFixed(2) + '%' }} ({{
            votes_data.total_predictions.choice1.female
          }}
          votes)</span
        >
        <span class="opacity-30">Prediction</span>
      </span>
      <span
        class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
        :style="{ width: female_predictions_percentage + '%' }"
      >
        <span></span>
        <span class="opacity-60"
          >{{ female_predictions_percentage.toFixed(2) + '%' }} ({{
            votes_data.total_predictions.choice2.female
          }}
          votes)</span
        >
      </span>
    </div>

    <div class="w-full flex flex-row items-center gap-1 mt-3 mb-3">
      <p class="text-white"><i class="fa-solid fa-person"></i> Male statistics</p>
      <hr class="flex-grow border-t-2 border-blue-500 opacity-100" />
    </div>
    <div class="h-10 mt-2 w-full flex flex-row items-center gap-1">
      <span
        class="h-full p-1 pl-5 pr-5 bg-blue-500 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
        :style="{ width: 100 - male_vote_percentage + '%' }"
      >
        <span class="opacity-60 text-left"
          >{{ (100 - male_vote_percentage).toFixed(2) + '%' }} ({{
            votes_data.total_votes.choice1.male
          }}
          votes)</span
        >
        <span>{{ poll_data.choice1 }}</span>
      </span>
      <span
        class="h-full p-1 pl-5 pr-5 bg-blue-500 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
        :style="{ width: male_vote_percentage + '%' }"
      >
        <span>{{ poll_data.choice2 }}</span>
        <span class="opacity-60"
          >{{ male_vote_percentage.toFixed(2) + '%' }} ({{
            votes_data.total_votes.choice2.female
          }}
          votes)</span
        >
      </span>
    </div>
    <div class="h-10 mt-2 w-full flex flex-row items-center gap-1">
      <span
        class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-r-md text-right text-white flex items-center justify-between gap-1 relative"
        :style="{ width: 100 - male_predictions_percentage + '%' }"
      >
        <span class="text-left opacity-60"
          >{{ (100 - male_predictions_percentage).toFixed(2) + '%' }} ({{
            votes_data.total_predictions.choice1.male
          }}
          votes)</span
        >
        <span> <span class="opacity-30">Prediction</span></span>
      </span>
      <span
        class="h-full p-1 pl-5 pr-5 bg-slate-600 rounded-xl rounded-l-md text-white flex items-center justify-between gap-1 relative"
        :style="{ width: male_predictions_percentage + '%' }"
      >
        <span></span>
        <span class="opacity-60"
          >{{ male_predictions_percentage.toFixed(2) + '%' }} ({{
            votes_data.total_predictions.choice2.male
          }}
          votes)</span
        >
      </span>
    </div>
    <!-- use votes_data to fetch results-->
    <!-- <span>{{ votes_data.total_votes }}</span> -->
  </div>
  <div v-else>
    Either this poll does not exist, or there is no data associated to your specific region...<br>Modify your preferences and try again
  </div>
</template>
