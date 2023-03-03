<template>
  <div class="list">
    <PullRefresh v-model="loading" @refresh="onRefresh" :success-duration="1500">
      <p>刷新次数: {{ count }}</p>
      <template #loading>
        <Loading />
      </template>
    </PullRefresh>
  </div>
</template>

<script lang="ts" setup>
import { PullRefresh } from '@virsual-scroller/vue'
import { ref } from 'vue';
import Loading from './loading.vue'
const count = ref(0);
const loading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false;
    count.value++;
  }, 10000);
};
</script>

<style lang="scss" scoped>
.list {
  height: 100vh;
  width: 100vw;
  text-align: center;
}
</style>
