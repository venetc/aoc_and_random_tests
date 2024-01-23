export function randomFloatInclusive(min = 0, max = 1) {
  const random = Math.random()
  const range = max - min
  return +(random * range + min).toFixed(2)
}

export function randomBoolean(probability = 0.5) {
  const float = randomFloatInclusive()
  if (probability === 1) return true
  if (probability === 0) return false

  return float < probability
}
