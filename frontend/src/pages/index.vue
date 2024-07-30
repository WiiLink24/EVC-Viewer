<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fetchCurrentPolls } from '@/backend'
import { countries } from '@/countries'
import Title from '@/components/Title.vue'
import PollCard from '@/components/PollCard.vue'
import PageNavigation from '@/components/PageNavigation.vue'

const polls = ref()
const filteredPolls = ref()
const isLoading = ref(true)

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

const countries_data = ref(countries)

const updateCurrentPage = (newPage: number) => {
  current_page.value = newPage
}

if (localStorage.getItem('language') === null) {
  localStorage.setItem('language', 'english')
}

if (localStorage.getItem('limit') === null) {
  localStorage.setItem('limit', '20')
}

onMounted(async () => {
  try {
    isLoading.value = true
    language.value = localStorage.getItem('language') ?? 'english'
    limit.value = parseInt(localStorage.getItem('limit') ?? '20')
    const response = await fetchCurrentPolls(1, language.value, limit.value)
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

watch(language, async (newLanguage) => {
  try {
    isLoading.value = true
    localStorage.setItem('language', newLanguage)
    const response = await fetchCurrentPolls(1, newLanguage, limit.value)
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
    const response = await fetchCurrentPolls(1, language.value, newLimit)
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
    const response = await fetchCurrentPolls(newPage, language.value, limit.value)
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
    class="top-24 w-full flex flex-row items-center sm:items-start justify-center gap-8 relative"
  >
    <div class="sticky-container w-96 h-screen flex flex-col justify-between mobile-hide">
      <div>
        <p class="mb-2 opacity-30"><i class="fa-solid fa-globe"></i> Poll Language</p>
        <select
          v-model="language"
          class="pl-3 pr-6 w-full h-14 bg-slate-700 hover:bg-slate-600 rounded-[20px] text-white transition-all relative"
        >
          <option v-for="(lang, index) in available_languages" :value="lang" :key="lang">
            {{ formatted_languages[index] }}
          </option>
        </select>
        <p class="mt-6 opacity-30"><i class="fa-solid fa-chart-simple"></i> Number of Polls</p>
        <div class="flex items-center gap-1 w-full">
          <input type="range" v-model="limit" :min="20" :max="100" :step="20" class="w-full" />
          <span
            class="h-[27px] pl-3 pr-3 rounded-l-[4px] rounded-r-[20px] bg-slate-400 flex items-center text-white text-center"
            >{{ limit }}</span
          >
        </div>
        <hr class="w-full mt-8 border-t-2 border-white" />
        <a
            class="w-full mt-10 justify-center inline-flex flex-row gap-1 items-center bg-[#2bca38] hover:bg-green-600 hover:scale-105 hover:shadow-xl hover:shadow-green-400/10 hover:no-underline transition-all px-8 py-3 rounded-xl text-white border-2 border-gray-200/10"
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
        class="w-[95%] max-w-[900px] sm:h-24 -translate-y-24 transition-all"
        :total_pages="total_pages"
        :current_page="current_page"
        @update:current_page="updateCurrentPage"
      />
    </div>

    <ul class="flex flex-col gap-3 items-center sm:items-start">
      <Title name="Polls" class="w-[95%] max-w-[900px] sm:h-24" />
      <div v-if="isLoading">Loading...</div>
      <li
        id="active"
        v-for="(poll, index) in filteredPolls"
        :key="poll.question_id"
        class="w-full sm:h-24 -translate-y-8"
      >
        <div>
          <PollCard v-bind="poll" :index="index" />
        </div>
      </li>
      <div class="w-full flex flex-row items-center gap-3 mt-3 mb-3 -translate-y-8">
        <hr class="flex-grow border-t-2 border-white" />
        <p class="text-white opacity-30"><i class="fa-solid fa-rotate-left"></i> Ended Polls</p>
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
