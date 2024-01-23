export function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(min, value), max)
}

export function randomNumberInRangeInclusive(min: number, max: number) {
  const roundedMin = Math.ceil(min)
  const roundedMax = Math.floor(max)

  if (roundedMin === roundedMax) {
    return roundedMin
  }

  if (roundedMax < roundedMin) {
    throw new RangeError('Invalid range')
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}
