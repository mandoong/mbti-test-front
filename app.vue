<template>
  <main class="main">
    <div class="view">
      <NuxtPage class="route-view" />
    </div>
  </main>
</template>

<script>
export default {
  setup() {},
};
</script>
>

<style scoped>
.main {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
  margin: 0px;
}

.view {
  display: flex;
  width: 500px;
  max-width: 800px;
  height: 100%;
  overflow: hidden;
}

.route-view {
  width: 100%;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
