<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { fetchCurrentPolls } from '@/backend'
import { countries } from '@/countries'
import Title from '@/components/Title.vue'
import PollCard from '@/components/PollCard.vue'
import PageNavigation from '@/components/PageNavigation.vue'

const polls = ref()
const filteredPolls = ref()
const isLoading = ref(true)

const countries_array = []
const countries_array_num = []
let regions_array = []

const details = ref(false)
const selectedCountry = ref('1')
const selectedRegion = ref('1')
const language = ref('english')
const available_languages = [
  'english',
  'french',
  'german',
  'italian',
  'spanish',
  'dutch',
  'portuguese',
  'french_canada'
]
const formatted_languages = [
  '🇬🇧 English',
  '🇫🇷 French',
  '🇩🇪 German',
  '🇮🇹 Italian',
  '🇪🇸 Spanish',
  '🇳🇱 Dutch',
  '🇵🇹 Portuguese',
  '🇨🇦 French (Canada)'
]

const limit = ref(20)
const current_page = ref(1)
const total_pages = ref()
const total_items = ref()
const view_type = ref()

const updateCurrentPage = (newPage: number) => {
  current_page.value = newPage
}

if (localStorage.getItem('language') === null) {
  localStorage.setItem('language', 'english')
}

if (localStorage.getItem('limit') === null) {
  localStorage.setItem('limit', '20')
}

if (localStorage.getItem('view_type') === undefined) {
  localStorage.setItem('view_type', 'all')
}

if (localStorage.getItem('details') === undefined) {
  localStorage.setItem('details', 'false')
}

if (localStorage.getItem('country') === undefined) {
  localStorage.setItem('country', '1')
  localStorage.setItem('country_index', '0')
}

if (localStorage.getItem('region') === undefined) {
  localStorage.setItem('region', '1')
}

view_type.value = localStorage.getItem('view_type') ?? 'all'

getCountriesList()

onMounted(async () => {
  try {
    isLoading.value = true
    language.value = localStorage.getItem('language') ?? 'english'
    limit.value = parseInt(localStorage.getItem('limit') ?? '20')
    let is_true = localStorage.getItem('details') === 'true'
    if (!is_true) {
      document.getElementById('regionSelect')?.classList.add('disabled')
    }
    selectedCountry.value =
      localStorage.getItem('country') + ' ' + localStorage.getItem('country_index')
    selectedRegion.value = localStorage.getItem('region') + ''
    details.value = is_true ?? false
    const response = await fetchCurrentPolls(1, language.value, limit.value, view_type.value)
    total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items)
    polls.value = response.data
    filteredPolls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) <= 7) ||
        (poll.type === 'w' && dateDifference(poll.date) <= 14)
      ) {
        return poll
      }
    })

    polls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) > 7) ||
        (poll.type === 'w' && dateDifference(poll.date) > 14)
      ) {
        return poll
      }
    })

    // Copy the div
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

watch(details, async (is_enabled) => {
  localStorage.setItem('details', '' + is_enabled + '')
  if (localStorage.getItem('details') == 'false') {
    document.getElementById('regionSelect')?.classList.add('disabled')
  } else {
    document.getElementById('regionSelect')?.classList.remove('disabled')
  }
})

watch(selectedCountry, async (newCountry) => {
  try {
    const [part1, part2] = newCountry.split(' ', 2)

    localStorage.setItem('country', part1)
    localStorage.setItem('country_index', part2)
    const index = parseInt(part2, 10)
    chooseRegion(countries_array[index])
  } catch (error) {
    console.error(error)
  }
})

watch(selectedRegion, async (newRegion) => {
  try {
    localStorage.setItem('region', newRegion)
  } catch (error) {
    console.error(error)
  }
})

watch(language, async (newLanguage) => {
  try {
    isLoading.value = true
    localStorage.setItem('language', newLanguage)
    const response = await fetchCurrentPolls(1, newLanguage, limit.value, view_type.value)
    total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items)
    polls.value = response.data
    filteredPolls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) <= 7) ||
        (poll.type === 'w' && dateDifference(poll.date) <= 14)
      ) {
        return poll
      }
    })

    polls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) > 7) ||
        (poll.type === 'w' && dateDifference(poll.date) > 14)
      ) {
        return poll
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

watch(limit, async (newLimit) => {
  try {
    isLoading.value = true
    localStorage.setItem('limit', newLimit.toString())
    const response = await fetchCurrentPolls(1, language.value, newLimit, view_type.value)
    total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items)
    polls.value = response.data
    filteredPolls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) <= 7) ||
        (poll.type === 'w' && dateDifference(poll.date) <= 14)
      ) {
        return poll
      }
    })

    polls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) > 7) ||
        (poll.type === 'w' && dateDifference(poll.date) > 14)
      ) {
        return poll
      }
    })
    if (current_page.value > total_pages.value) {
      current_page.value = total_pages.value
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

watch(current_page, async (newPage) => {
  try {
    isLoading.value = true
    const response = await fetchCurrentPolls(newPage, language.value, limit.value, view_type.value)
    /* total_pages.value = response.total_pages
    total_items.value = parseInt(response.total_items) */
    polls.value = response.data
    filteredPolls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) <= 7) ||
        (poll.type === 'w' && dateDifference(poll.date) <= 14)
      ) {
        return poll
      }
    })

    polls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) > 7) ||
        (poll.type === 'w' && dateDifference(poll.date) > 14)
      ) {
        return poll
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

watch(view_type, async (newViewType) => {
  try {
    isLoading.value = true
    localStorage.setItem('view_type', newViewType)
    const response = await fetchCurrentPolls(1, language.value, limit.value, newViewType)
    polls.value = response.data
    filteredPolls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) <= 7) ||
        (poll.type === 'w' && dateDifference(poll.date) <= 14)
      ) {
        return poll
      }
    })

    polls.value = polls.value.filter((poll) => {
      if (
        (poll.type === 'n' && dateDifference(poll.date) > 7) ||
        (poll.type === 'w' && dateDifference(poll.date) > 14)
      ) {
        return poll
      }
    })
    if (current_page.value > total_pages.value) {
      current_page.value = total_pages.value
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

function getCountriesList() {
  for (const countryId in countries) {
    if (countries.hasOwnProperty(countryId)) {
      const country = countries[countryId]
      countries_array.push(country.Name)
      countries_array_num.push(countryId)
    }
  }
}

function chooseRegion(selectedCountry: string) {
  for (const countryId in countries) {
    if (countries.hasOwnProperty(countryId)) {
      const country = countries[countryId]
      if (country.Name === selectedCountry) {
        regions_array = []
        for (const subregionId in country.Subregions) {
          if (country.Subregions.hasOwnProperty(subregionId)) {
            const subregion = country.Subregions[subregionId]
            regions_array.push(subregion.en)
          }
        }
      }
    }
  }
}

window.onscroll = function () {
  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  if (documentHeight - scrollPosition < 700) {
    document.getElementById('stickyNav').style.opacity = '0'
  } else {
    document.getElementById('stickyNav').style.opacity = '1'
  }
}

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
    id="top"
    class="top-0 left-0 w-full h-[300px] absolute dissolve"
    style="
      background: linear-gradient(33deg, rgba(235, 139, 246, 1) 0%, rgba(169, 247, 128, 1) 100%);
    "
  ></div>
  <div
    class="left-1/2 -translate-x-1/2 top-24 sm:w-[98%] w-[95%] flex sm:flex-row flex-col items-center sm:items-start justify-center gap-8 relative"
  >
    <div class="sticky-container sm:w-96 w-full sm:h-screen flex flex-col justify-between">
      <div>
        <span class="w-full mb-2 flex flex-row items-center justify-between"
          ><p class="opacity-30"><i class="fa-solid fa-flag"></i> Country and Region</p>
          <label class="container flex items-start sm:-translate-y-2 -translate-y-5"
            ><i
              class="fa-solid fa-triangle-exclamation text-yellow-400 text-sm sm:block hidden"
              title="If a poll has no submissions for a given region, no data will be shown."
            ></i>
            <input
              checked="checked"
              type="checkbox"
              v-model="details"
              id="showDetails"
              class="mr-2"
            />
            <span class="checkmark"></span> </label
        ></span>
        <div id="regionSelect" class="flex flex-row items-center gap-[3px]">
          <select
            v-model="selectedCountry"
            class="mb-8 pl-3 pr-6 w-full h-14 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-l-[20px] rounded-r-md dark:text-white transition-all relative"
          >
            <option
              v-for="(item, index) in countries_array_num"
              :value="`${countries_array_num[index]} ${index}`"
              :key="item"
            >
              {{ countries_array[index] }}
            </option>
          </select>
          <select
            v-model="selectedRegion"
            class="mb-8 pl-3 pr-6 w-full h-14 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-l-md rounded-r-[20px] dark:text-white transition-all relative"
          >
            <option v-for="(item, index) in regions_array" :value="index + 1" :key="item">
              {{ index + 1 }}. {{ item }}
            </option>
          </select>
        </div>
        <p class="mb-2 opacity-30"><i class="fa-solid fa-globe"></i> Poll Language</p>
        <select
          v-model="language"
          class="pl-3 pr-6 w-full h-14 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-[20px] dark:text-white transition-all relative"
        >
          <option v-for="(lang, index) in available_languages" :value="lang" :key="lang">
            {{ formatted_languages[index] }}
          </option>
        </select>
        <p class="mt-6 opacity-30"><i class="fa-solid fa-chart-simple"></i> Number of Polls</p>
        <div class="flex items-center gap-1 w-full">
          <input type="range" v-model="limit" :min="20" :max="100" :step="20" class="w-full" />
          <span
            class="h-[27px] pl-3 pr-3 rounded-l-[4px] rounded-r-[20px] bg-gray-400 dark:bg-slate-400 flex items-center text-white text-center"
            >{{ limit }}</span
          >
        </div>
        <p class="mt-6 mb-2 opacity-30"><i class="fa-solid fa-filter"></i> Filter by Type</p>
        <div class="flex flex-row items-center gap-[3px]">
          <input
            type="radio"
            id="a"
            name="ViewType"
            value="all"
            v-model="view_type"
            class="hidden-radio"
          />
          <label
            for="a"
            class="radio-label w-1/3 rounded-l-xl rounded-r-md bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600"
            ><i class="fa-solid fa-circle w-full text-center dark:text-white"></i
          ></label>

          <input
            type="radio"
            id="n"
            name="ViewType"
            value="n"
            v-model="view_type"
            class="hidden-radio"
          />
          <label
            for="n"
            class="radio-label w-1/3 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600"
            ><i class="fa-solid fa-flag w-full text-center dark:text-white"></i
          ></label>

          <input
            type="radio"
            id="ww"
            name="ViewType"
            value="w"
            v-model="view_type"
            class="hidden-radio"
          />
          <label
            for="ww"
            class="radio-label w-1/3 rounded-l-md rounded-r-xl bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600"
            ><i class="fa-solid fa-globe-americas w-full text-center dark:text-white"></i
          ></label>
        </div>
        <hr class="w-full mt-8 border-t-2 dark:border-white/30" />
        <a
          class="w-full mt-10 justify-center flex-row gap-1 items-center bg-[#2bca38] hover:bg-green-600 hover:scale-105 hover:shadow-xl hover:shadow-green-400/10 hover:no-underline transition-all px-8 py-3 rounded-xl text-white border-2 border-gray-200/10 sm:inline-flex hidden"
          href="https://www.wiilink24.com/"
          ><img
            src="/img/favicon.png"
            alt="WiiLink Logo"
            style="filter: brightness(10000); height: 20px !important"
          />
          Install WiiLink</a
        >
      </div>
      <PageNavigation
        v-if="polls"
        id="stickyNav"
        class="sm:flex hidden w-[95%] max-w-[900px] sm:h-24 -translate-y-24 transition-all"
        :total_pages="total_pages"
        :current_page="current_page"
        @update:current_page="updateCurrentPage"
      />
    </div>

    <ul class="w-full sm:w-auto flex flex-col gap-3 items-center sm:items-start">
      <Title v-if="view_type === 'all'" name="Polls" class="w-[95%] max-w-[900px] sm:h-24" />
      <Title v-if="view_type === 'n'" name="National" class="w-[95%] max-w-[900px] sm:h-24" />
      <Title v-if="view_type === 'w'" name="World" class="w-[95%] max-w-[900px] sm:h-24" />
      <div
        v-if="isLoading"
        class="w-full h-[calc(100vh-160px)] p-20 flex flex-col items-center justify-center gap-3 backdrop-blur-lg rounded-2xl border-4 border-dashed border-gray-400/10 dark:border-slate-400/10 -translate-y-16 text-xl dark:text-white"
      >
        <img src="/img/loading.gif" class="h-10 brightness-[1000] invert dark:invert-0" /> Getting
        the latest polls just for you...
      </div>
      <li
        id="active"
        v-for="(poll, index) in filteredPolls"
        :key="poll.question_id"
        class="w-full sm:h-24 -translate-y-8"
      >
        <div :class="poll.type === 'n' ? 'national' : poll.type === 'w' ? 'worldwide' : ''">
          <PollCard v-bind="poll" :index="index" />
        </div>
      </li>
      <div class="w-full flex flex-row items-center gap-3 mt-3 mb-3 -translate-y-8">
        <hr class="flex-grow border-t-2 dark:border-white/30" />
        <p class="dark:text-white opacity-30">
          <i class="fa-solid fa-rotate-left"></i> Ended Polls
        </p>
      </div>
      <li
        id="past"
        v-for="(poll, index) in polls"
        :key="poll.question_id"
        class="w-full sm:h-24 -translate-y-8"
      >
        <RouterLink
          :to="`/polls/${poll.question_id}`"
          class="animate-fadeUp"
          :style="{ opacity: 0, animationDelay: `${15 * index}ms` }"
        >
          <PollCard v-bind="poll" :index="index" />
        </RouterLink>
      </li>
      <PageNavigation
        v-if="polls"
        class="w-[95%] max-w-[900px] sm:h-24"
        :total_pages="total_pages"
        :current_page="current_page"
        @update:current_page="updateCurrentPage"
      />
    </ul>
  </div>
</template>
