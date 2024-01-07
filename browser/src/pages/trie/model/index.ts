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
