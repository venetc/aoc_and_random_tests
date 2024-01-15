<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

import { Button } from '@/shared/ui/button'

const route = useRoute()

const ol = [
  { label: 'Main Page', routeName: 'Main Page' },
  { label: 'Trie autocomplete test', routeName: 'Trie Page' },
]

const links = computed(() => {
  return ol.filter(({ routeName }) => routeName !== route.name)
})
</script>

<template>
  <nav>
    <ol class="font-fira_code">
      <li v-for="{ label, routeName }, index in links" :key="routeName">
        <span>{{ index + 1 }}.</span>
        <Button asChild variant="link" class="px-2 py-1 h-auto">
          <RouterLink :to="{ name: routeName }">
            {{ label }}
          </RouterLink>
        </Button>
      </li>
    </ol>
  </nav>
</template>
