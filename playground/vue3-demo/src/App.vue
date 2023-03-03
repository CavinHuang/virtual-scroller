<script setup lang="ts">
import { ref } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'
import List from './components/list.vue'
const count = ref(0);
const loading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false;
    count.value++;
  }, 1000);
};

</script>

<template>
  <List />
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" />
  <PullRefresh v-model="loading" @refresh="onRefresh">
    <p>刷新次数: {{ count }}</p>
  </PullRefresh> -->
</template>

<style>

</style>
