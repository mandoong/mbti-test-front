<template>
  <div class="content-view index-view">
    <img class="img" src="../assets/main.png" />
    <button @click="$router.push('home')" class="start-btn">시작하기</button>
  </div>
</template>

<script>
export default {};
</script>

<style>
.img {
  height: 60%;
  object-fit: cover;
}

.index-view {
  background-color: lightpink;
}
</style>
