export function sample<T>(array: T[], amount: number): T[] {
  if (array.length === 0 || amount <= 0) return []
  if (amount > array.length) return array

  const sampledElements: T[] = []
  const randmoIndexes = new Set<number>()

  while (randmoIndexes.size < amount) {
    const randomIndex = Math.floor(Math.random() * array.length)
    randmoIndexes.add(randomIndex)
  }

  randmoIndexes.forEach((index) => {
    sampledElements.push(array[index])
  })

  return sampledElements
}
