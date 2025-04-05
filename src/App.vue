<template>
  <LoadingPage v-if="globalState.isAuthenticating" message="正在验证登录状态" />
  <router-view v-else />
</template>

<script setup lang="ts">
import LoadingPage from './pages/LoadingPage.vue'
import {inject} from "vue";

const globalState = inject('globalState') as { isAuthenticating: boolean }
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  width: 100%;
}
</style>
