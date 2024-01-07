<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/shared/ui/button'

const ol = [
  { label: 'Trie autocomplete test', routeName: 'Trie Page' },
]
</script>

<template>
  <div>
    <ol class="font-fira_code">
      <li v-for="{ label, routeName }, index in ol" :key="routeName">
        <span>{{ index + 1 }}.</span>
        <Button asChild variant="link">
          <RouterLink :to="{ name: routeName }">
            {{ label }}
          </RouterLink>
        </Button>
      </li>
    </ol>
  </div>
</template>
