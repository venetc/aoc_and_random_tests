<script setup lang="ts">
import { computed } from 'vue'

import { Button } from '@/shared/ui/button'

const props = defineProps<{
  pathname: string
}>()

const ol = [
  { label: 'Main Page', path: '' },
  { label: 'Trie autocomplete', description: 'Testing different autocomplete techniques using trie and straightforward .filter() + .startsWith()', path: 'trie' },
  { label: 'Optimistic UI update', description: 'Updating UI on user actions and validate on server response while batching updates and debouncing request', path: 'favorites' },
]
const currentRoute = computed(() => props.pathname.split('/').filter(Boolean))
const links = computed(() => currentRoute.value.length > 1
  ? ol.filter(({ path }) => !currentRoute.value.includes(path))
  : ol.filter((_, index) => index !== 0),
)
</script>

<template>
  <nav>
    <ol class="font-fira_code text-sm max-w-[22rem] space-y-4">
      <li v-for="{ label, description, path }, index in links"
          :key="path"
      >
        <a :href="`./${path}`"
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
        </a>
      </li>
    </ol>
  </nav>
</template>
