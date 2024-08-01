<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPoll } from '@/backend'
import { countries } from '@/countries'
import Title from '@/components/Title.vue'
import DetailedChart from '@/components/DetailedChart.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Poll Details | EVC Viewing Tool',
  meta: [
    { name: 'description', content: 'The content you were looking for could not be found...' },
    { property: 'og:image', content: '/img/evcseobg.png' }
  ]
})

const route = useRoute()
const id = ref(route.params.id)

const isLoading = ref(false)

const poll = ref()
const poll_data = ref()
const votes_data = ref()
const details_data = ref()
const country_data = ref()
const region_data = ref()
let formattedType = ref('')
let formattedDate = ref('')
const formatted_country = ref('')
const formatted_region = ref('')
const view_type = ref()

if (localStorage.getItem('details_view') === null) {
  localStorage.setItem('details_view', 'country')
}

const language = ref(localStorage.getItem('language') || 'english')
const country = ref(parseInt(localStorage.getItem('country')) || 49)
const region = ref(parseInt(localStorage.getItem('region')) || 1)
let details = localStorage.getItem('details') === 'true'

onMounted(async () => {
  try {
    view_type.value = localStorage.getItem('details_view') || 'country'
    isLoading.value = true
    poll.value = await fetchPoll(id.value, language.value, country.value, region.value, details)
    poll_data.value = poll.value.poll_data
    votes_data.value = poll.value.results_data
    if (details) {
      country_data.value = poll.value.details_data.country_data
      region_data.value = poll.value.details_data.region_data

      const countryId = poll.value.details_data.country.country_id
      const regionId = poll.value.details_data.country.region_id

      formatted_country.value = countries[countryId].Name
      formatted_region.value = countries[countryId].Subregions[regionId].en
    }

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

watch(view_type, async (newValue) => {
  try {
    localStorage.setItem('details_view', newValue)
    view_type.value = newValue
  } catch (error) {
    console.error(error)
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
    class="w-full h-[calc(100vh-160px)] p-20 flex flex-col items-center justify-center gap-3 -translate-y-16 text-xl dark:text-white"
  >
    <img src="/img/loading.gif" class="h-10 brightness-[1000]" /> Getting this poll data ready...
  </div>
  <div
    v-if="poll"
    class="top-24 mb-24 left-1/2 -translate-x-1/2 2 relative w-[95%] sm:max-w-[900px]"
  >
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
    <div class="-top-5 flex flex-row items-center justify-between gap-3 relative">
      <div class="w-auto flex flex-row items-center gap-[3px]">
        <input
          type="radio"
          id="country"
          name="ViewType"
          value="country"
          v-model="view_type"
          class="hidden-radio"
        />
        <label
          for="country"
          class="radio-label rounded-l-xl rounded-r-md bg-slate-600 hover:bg-slate-500 dark:text-white"
          ><i class="fa-solid fa-flag"></i> {{ formatted_country }}</label
        >

        <input
          type="radio"
          id="region"
          name="ViewType"
          value="region"
          v-model="view_type"
          class="hidden-radio"
        />
        <label
          for="region"
          class="radio-label rounded-l-md rounded-r-xl bg-slate-600 hover:bg-slate-500 dark:text-white"
          ><i class="fa-regular fa-flag"></i> {{ formatted_region }}</label
        >
      </div>
      <p class="text-right opacity-30 relative">
        {{ votes_data.total_votes.total }} votes received
      </p>
    </div>
    <hr v-if="details_data" class="w-full mb-10 border-t-2 border-white" />
    <div v-if="country_data">
      <div v-if="country_data" class="mt-3">
        <div v-if="view_type === 'country'">
          <div class="flex flex-row items-center justify-between gap-3">
            <h2>Details for {{ formatted_country }}</h2>
            <p class="opacity-30">Scroll down for worldwide details</p>
          </div>
          <DetailedChart v-bind="country_data" />
        </div>
        <div v-else>
          <div class="flex flex-row items-center justify-between gap-3">
            <h2>Details for {{ formatted_region }}</h2>
            <p class="opacity-30">Scroll down for worldwide details</p>
          </div>
          <DetailedChart v-bind="region_data" />
        </div>
      </div>
      <hr class="mt-10 mb-10" />
    </div>
    <h2><i class="fa-solid fa-globe-americas"></i> Worldwide Poll statistics</h2>
    <DetailedChart v-bind="votes_data" />
  </div>
  <div
    v-else
    class="top-24 left-1/2 w-[95%] h-[calc(100vh-300px)] -translate-x-1/2 p-20 flex flex-col items-center justify-center gap-3 backdrop-blur-lg rounded-2xl border-4 border-dashed border-gray-400/10 dark:border-slate-400/10 text-xl dark:text-white relative"
  >
    <p class="max-w-[950px] flex flex-col items-center justify-center gap-3 text-center">
      <i class="fa-solid fa-bomb text-6xl"></i>
      Either this poll does not exist, or there is no data associated to your specific region...<br />Modify
      your preferences and try again <br /><br />
      <span
        class="mt-8 p-5 rounded-xl bg-gray-400 dark:bg-slate-700 text-sm text-left opacity-60 hover:opacity-100 transition-all"
      >
        <i class="fa-solid fa-question-circle"></i><b> Reasons why you might be seeing this</b
        ><br />
        You may be viewing a Poll for a specific region that has no submissions. Change your region
        or disable region search.<br />
        You may have followed a broken link to a non-existent PollID. Verify the URL and try
        again.<br />
        You may be attempting to view results from an ongoing Poll. Wait for the Poll to end and try
        again.
      </span>
      <br /><br />
      <a href="/"
        ><i class="fa-solid fa-chevron-left"></i> <span class="underline">Go back</span></a
      >
    </p>
  </div>
</template>
