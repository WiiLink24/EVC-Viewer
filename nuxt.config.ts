// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
      OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
      OIDC_ISSUER: process.env.OIDC_ISSUER,
      OIDC_REDIRECT_URI: process.env.OIDC_REDIRECT_URI,
    }
  },

  modules: [
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "@nuxt/fonts",
  ],
  
});