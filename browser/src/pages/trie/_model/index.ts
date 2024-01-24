import { ref, shallowRef } from 'vue'
import { sanitizeImperative, splitToUniqueWords } from '@shared/lib/string'

export function useAutocomplete(input: string) {
  const wordsArray = shallowRef<string[]>([])

  const rawText = ref(input)

  const trie = shallowRef(new Trie())

  const searchByTrieInput = ref('')
  const trieSuggestions = ref<string[]>([])

  const searchByFilterInput = ref('')
  const filterSuggestions = ref<string[]>([])

  const searchTrie = () => {
    trieSuggestions.value = trie.value.autocomplete(searchByTrieInput.value.toLowerCase())
  }

  const searchFilter = () => {
    filterSuggestions.value = wordsArray.value.filter(word => word.startsWith(searchByFilterInput.value.toLowerCase()))
  }

  const sanitizeText = () => {
    rawText.value = sanitizeImperative(rawText.value)
    wordsArray.value = splitToUniqueWords(rawText.value)

    trie.value = new Trie()
    trie.value.insertArray(wordsArray.value)

    searchTrie()
    searchFilter()
  }

  const reset = () => {
    searchByTrieInput.value = ''
    searchByFilterInput.value = ''
    trieSuggestions.value = []
    filterSuggestions.value = []
    wordsArray.value = []
    trie.value = new Trie()
    rawText.value = input
  }

  const clear = () => {
    reset()
    rawText.value = ''
  }

  return {
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
  }
}

class TrieNode {
  children: Map<string, TrieNode>
  isWord: boolean

  constructor() {
    this.children = new Map()
    this.isWord = false
  }
}

export class Trie {
  root: TrieNode

  constructor() {
    this.root = new TrieNode()
  }

  insert(word: string) {
    let current = this.root

    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode())
      }
      current = current.children.get(char)!
    }

    current.isWord = true
  }

  insertArray(words: string[]) {
    for (const word of words) {
      this.insert(word)
    }
  }

  search(word: string): boolean {
    let current = this.root

    for (const char of word) {
      if (!current.children.has(char)) {
        return false
      }
      current = current.children.get(char)!
    }

    return current.isWord
  }

  autocomplete(prefix: string): string[] {
    let current = this.root
    for (const char of prefix) {
      if (!current.children.has(char)) return []

      current = current.children.get(char)!
    }

    const suggestions: string[] = []
    this.findAutocompleteWords(current, prefix, suggestions)
    return suggestions
  }

  private findAutocompleteWords(node: TrieNode, prefix: string, suggestions: string[]) {
    if (node.isWord) {
      suggestions.push(prefix)
    }

    for (const [char, child] of node.children.entries()) {
      this.findAutocompleteWords(child, `${prefix}${char}`, suggestions)
    }
  }
}
