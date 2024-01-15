<script setup lang="ts">
import { DEMO_TEXT } from '../config'
import { Trie } from '../model'

import { ref, shallowRef } from 'vue'

import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Input } from '@/shared/ui/input'
import { ScrollArea } from '@/shared/ui/scroll-area'

// const sanitize = (s: string) => s.replace(/[^\sa-zA-ZА-Яа-я]+/g, ' ').trim().replace(/\s+/g, ' ').toLowerCase()
const words = shallowRef<string[]>([])

function sanitizeImperative(text: string) {
  let result = ''

  for (let i = 0; i < text.length; i++) {
    const prevChar = text[i - 1]
    const char = text[i]
    const nextChar = text[i + 1]

    if (char.match(/[a-zA-ZА-Яа-я]/)) {
      result += char.toLowerCase()
    }
    // "сколько-нибудь" и т.п.
    else if (prevChar?.match(/[a-zA-ZА-Яа-я]/) && nextChar?.match(/[a-zA-ZА-Яа-я]/)) {
      result += char
    }
    else if (!result.endsWith(' ')) {
      result += ' '
    }
  }
  return result
}

const text = ref(DEMO_TEXT)

const trie = shallowRef(new Trie())

const trieInput = ref('')
const trieAutocomplete = ref<string[]>([])

const filterInput = ref('')
const filterAutocomplete = ref<string[]>([])

function sanitizeText() {
  text.value = sanitizeImperative(text.value)
  words.value = [...new Set(text.value.split(' '))].filter(Boolean)

  trie.value = new Trie()
  trie.value.insertArray(words.value)

  trieAutocomplete.value = []
  filterAutocomplete.value = []

  console.log(trie.value)
}

function searchTrie(text: string) {
  trieAutocomplete.value = trie.value.autocomplete(text)
}

function searchFilter(text: string) {
  filterAutocomplete.value = words.value.filter(word => word.startsWith(text))
}
</script>

<template>
  <div class="grid grid-cols-3 gap-x-3 gap-y-6 font-fira_code max-lg:grid-cols-1">
    <div class="col-span-1">
      <div class="text-sm mb-3">
        Input:
      </div>

      <Button size="sm" class="mb-3" @click="sanitizeText">
        Sanitize
      </Button>

      <Textarea
        v-model="text"
        class="w-full h-80 resize-none"
        placeholder="Enter text"
      />
    </div>
    <div class="col-span-1 relative">
      <div class="text-sm mb-3">
        Trie:
      </div>

      <Input
        v-model="trieInput"
        class="bg-white mb-2"
        placeholder="Seach using trie"
        @input="searchTrie(trieInput)"
      />

      <ScrollArea class="h-80 rounded-md border px-2 text-sm shadow-sm whitespace-pre">
        <div v-for=" word of trieAutocomplete" :key="word">
          {{ word }}
        </div>
      </ScrollArea>

      <Transition name="fade">
        <div
          v-if="words.length === 0"
          class="absolute top-0 left-0 w-[calc(100%+1px)] h-full rounded-md bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/5 flex flex-col justify-center items-center"
        >
          <div>Paste text into textarea</div>
          <div class="flex items-center gap-2">
            <div>and click</div>
            <Button size="sm" @click="sanitizeText">
              Sanitize
            </Button>
            <div>button.</div>
          </div>
        </div>
      </Transition>
    </div>
    <div class="col-span-1 relative">
      <div class="text-sm mb-3">
        Filter:
      </div>

      <Input
        v-model="filterInput"
        class="bg-white mb-2"
        placeholder="Seach using .filter() and .startsWith()"
        @input="searchFilter(filterInput)"
      />

      <ScrollArea class="h-80 rounded-md border px-2 text-sm shadow-sm whitespace-pre">
        <div v-for=" word of filterAutocomplete" :key="word">
          {{ word }}
        </div>
      </ScrollArea>

      <Transition name="fade">
        <div
          v-if="words.length === 0"
          class="absolute top-0 left-0 w-[calc(100%+1px)] h-full rounded-md bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/5 flex flex-col justify-center items-center"
        >
          <div>Paste text into textarea</div>
          <div class="flex items-center gap-2">
            <div>and click</div>
            <Button size="sm" @click="sanitizeText">
              Sanitize
            </Button>
            <div>button.</div>
          </div>
        </div>
      </Transition>
    </div>
    <Transition name="fade">
      <div v-if="words.length > 0" class="col-span-full flex flex-wrap gap-x-1.5 gap-y-1 text-xs">
        <span v-for="word of words" :key="word" class="border rounded-full px-2">
          {{ word }}
        </span>
      </div>
    </Transition>
  </div>
</template>
