export const sanitize = (s: string) => s.replace(/[^\sa-zA-ZА-Яа-я]+/g, ' ').trim().replace(/\s+/g, ' ').toLowerCase()

export function sanitizeImperative(text: string) {
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

export function splitToUniqueWords(text: string) {
  return [...new Set(text.split(' '))].filter(Boolean)
}
