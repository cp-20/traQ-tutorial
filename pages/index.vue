<script setup lang="ts">
const { state, actions } = useTraqAuthStore()
const achievements = [
  {
    id: 'times',
    label: 'timesを作る',
    status: await actions.isTimesCreated()
  },
  {
    id: 'homeChannel',
    label: 'ホームチャンネルを設定する',
    status: await actions.isHomeChannelSet()
  },
  {
    id: 'introduction',
    label: '自己紹介をする',
    status: await actions.isIntroductionSet()
  },
  {
    id: '10posts',
    label: '10投稿する',
    status: await actions.isEnoughPosts(10)
  },
] as const
</script>

<template>
  <div>
    <div class="grid place-items-center mt-8">
      <img src="/traQ.png" alt="" width="64" height="64">
    </div>
    <h1 class="text-2xl font-bold text-center mb-8 mt-4">traQチュートリアル</h1>
    <div class="px-4">
      <div v-if="!state.me" class="grid place-items-center">
        <nuxt-link class="border-2 border-blue-500 bg-blue-100 px-4 py-2 rounded-md text-blue-600"
          to="/auth-request">認証する</nuxt-link>
      </div>
      <div v-else class="flex flex-col gap-4 max-w-96 mx-auto">
        <template v-for="achievement in achievements">
          <div class="flex justify-between">
            <div class="flex items-center text-zinc-700 font-semibold">{{ achievement.label }}</div>
            <div v-if="achievement.status"
              class="flex bg-green-200 text-green-600 border-green-500 border-2 rounded-md justify-between items-center gap-1 px-2 py-1">
              <span>完了</span>
              <check-icon class="w-6 h-6" />
            </div>
            <div v-else
              class="flex bg-yellow-200 text-yellow-600 border-yellow-500 border-2 rounded-md justify-between items-center gap-1 px-2 py-1">
              <span>未完了</span>
              <info-icon />
            </div>
          </div>
          <template v-if="achievement.id === 'times'">
            <button
              class="border-2 border-zinc-200 hover:bg-zinc-50 transition-colors duration-150 py-1 rounded-md mb-8"
              v-if="!achievement.status" @click="actions.createTimes()">timesを作る (#gps/times/{{
                state.me.name }})</button>
          </template>
          <template v-if="achievement.id === 'homeChannel'">
            <button
              class="border-2 border-zinc-200 hover:bg-zinc-50 transition-colors duration-150 py-1 rounded-md mb-8"
              v-if="!achievement.status" :disabled="!achievements[0].status"
              @click="actions.setHomeChannel()">ホームチャンネルを設定する</button>
          </template>
          <template v-if="achievement.id === 'introduction'">
            <a v-if="!achievement.status"
              class="border-2 border-zinc-200 hover:bg-zinc-50 transition-colors duration-150 py-1 rounded-md block text-center mb-8"
              :href="`${traqDomain}/channels/random/jikoshokai`">#random/jikoshokai
              を開く</a>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>