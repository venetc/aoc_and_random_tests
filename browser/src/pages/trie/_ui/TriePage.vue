<script setup lang="ts">
import { useAutocomplete } from '../_model'

import { RotateCcw, Trash2 } from 'lucide-vue-next'
import { DEMO_TEXT } from '@shared/config/constants'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Textarea } from '@/shared/ui/textarea'
import { VerticalNavigationSheet } from '@/widgets/vertical-navigation'

defineProps<{ pathname: string }>()

const {
  wordsArray,
  rawText,
  searchByTrieInput,
  trieSuggestions,
  searchByFilterInput,
  filterSuggestions,
  sanitizeText,
  searchTrie,
  searchFilter,
  reset,
  clear,
} = useAutocomplete(DEMO_TEXT)
</script>

<template>
  <div class="grid grid-cols-3 gap-x-6 gap-y-6 font-fira_code max-lg:grid-cols-1 pb-14">
    <div class="col-span-1">
      <div class="text-lg mb-3">
        Input:
      </div>

      <div class="mb-3 flex gap-3 justify-end">
        <Button class="mr-auto"
                @click="sanitizeText"
        >
          Sanitize
        </Button>
        <Button size="icon"
                variant="destructive"
                @click="reset"
        >
          <RotateCcw :size="20"
                     :strokeWidth="2"
          />
        </Button>
        <Button size="icon"
                variant="destructive"
                @click="clear"
        >
          <Trash2 :size="20"
                  :strokeWidth="2"
          />
        </Button>
      </div>

      <Textarea v-model="rawText"
                class="w-full h-80 resize-none"
                placeholder="Enter text"
      />
    </div>

    <div class="col-span-1 relative">
      <div class="text-lg mb-3">
        Trie:
      </div>

      <Input v-model="searchByTrieInput"
             class="bg-white mb-3"
             placeholder="Seach using trie"
             @input="searchTrie"
      />

      <ScrollArea type="auto"
                  class="h-80 rounded-md border px-2 text-sm shadow-sm whitespace-pre"
      >
        <div v-for=" word of trieSuggestions"
             :key="word"
        >
          {{ word }}
        </div>
      </ScrollArea>

      <Transition name="fade">
        <div v-if="wordsArray.length === 0"
             class="absolute top-0 left-0 w-[calc(100%+1px)] h-full rounded-md bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/5 flex flex-col justify-center items-center"
        >
          <div>Paste text into textarea</div>
          <div class="flex items-center gap-2">
            <div>and click</div>
            <Button size="sm"
                    @click="sanitizeText"
            >
              Sanitize
            </Button>
            <div>button.</div>
          </div>
        </div>
      </Transition>
    </div>

    <div class="col-span-1 relative">
      <div class="text-lg mb-3">
        Filter:
      </div>

      <Input v-model="searchByFilterInput"
             class="bg-white mb-3"
             placeholder="Seach using .filter() and .startsWith()"
             @input="searchFilter"
      />

      <ScrollArea type="auto"
                  class="h-80 rounded-md border px-2 text-sm shadow-sm whitespace-pre"
      >
        <div v-for=" word of filterSuggestions"
             :key="word"
        >
          {{ word }}
        </div>
      </ScrollArea>

      <Transition name="fade">
        <div v-if="wordsArray.length === 0"
             class="absolute top-0 left-0 w-[calc(100%+1px)] h-full rounded-md bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/5 flex flex-col justify-center items-center"
        >
          <div>Paste text into textarea</div>
          <div class="flex items-center gap-2">
            <div>and click</div>
            <Button size="sm"
                    @click="sanitizeText"
            >
              Sanitize
            </Button>
            <div>button.</div>
          </div>
        </div>
      </Transition>
    </div>

    <Transition name="fade">
      <ScrollArea v-if="wordsArray.length > 0"
                  type="auto"
                  class="h-48 rounded-md border w-full col-span-full"
      >
        <div class="flex flex-wrap gap-x-1.5 gap-y-1 text-xs px-2 py-2">
          <span v-for="word of wordsArray"
                :key="word"
                class="border rounded px-1.5"
          >
            {{ word }}
          </span>
        </div>
      </ScrollArea>
    </Transition>

    <VerticalNavigationSheet :pathname="pathname" />
  </div>
</template>
