<script setup lang="ts">
import ChatPage from "./pages/ChatPage.vue";
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <ChatPage />
  </div>
</template>

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
h1 {
  color: white;
}
</style>