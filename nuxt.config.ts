// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // modules: ["@nuxtjs/axios"],
  runtimeConfig: {
    public: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
  css: ["@/assets/global.css"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
