<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

import { Button } from '@/shared/ui/button'

const route = useRoute()

const ol = [
  { label: 'Main Page', routeName: 'Main Page' },
  { label: 'Trie autocomplete', description: 'Testing different autocomplete techniques using trie and straightforward .filter() + .startsWith()', routeName: 'Trie Page' },
  { label: 'Optimistic UI update', description: 'Updating UI on user actions and validate on server response while batching updates and debouncing request', routeName: 'Optimistic UI Page' },
]

const links = computed(() => ol.filter(({ routeName }) => routeName !== route.name))
</script>

<template>
  <nav>
    <ol class="font-fira_code text-sm max-w-[22rem] space-y-4">
      <li v-for="{ label, description, routeName }, index in links"
          :key="routeName"
      >
        <RouterLink :to="{ name: routeName }"
                    class="flex items-baseline gap-2"
        >
          <span>{{ index + 1 }}.</span>
          <div>
            <Button variant="link"
                    class="px-0 py-0 h-auto"
            >
              {{ label }}
            </Button>
            <div v-if="description"
                 class="mt-1 opacity-75 text-xs italic font-normal tracking-wider leading-normal font-inter"
            >
              {{ description }}
            </div>
          </div>
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>
