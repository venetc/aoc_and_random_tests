<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="h-full px-4 py-2">
    <RouterView v-slot="{ Component, route }">
      <Transition
        mode="out-in"
        name="fade"
        appear
      >
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </Transition>
    </RouterView>
  </main>
</template>
