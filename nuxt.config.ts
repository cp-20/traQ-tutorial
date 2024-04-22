// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'traQ チュートリアル',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      traqClientId: process.env.TRAQ_CLIENT_ID,
    },
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  googleFonts: {
    families: {
      'Noto Sans JP': [400, 600, 700],
    },
    preload: true,
    download: false,
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  ssr: false,
});
