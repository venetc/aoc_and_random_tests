import { randomBoolean } from '../../lib/random'
import { sample } from '../../lib/array'
import { randomNumberInRangeInclusive } from '../../lib/number'

import { type HttpHandler, HttpResponse, delay, http } from 'msw'
import { ref } from 'vue'

export const mswDelay = ref(750)
export const mswRejectChance = ref(0)

function generateResponse<T>({ data, success = true, status = 200, statusText }: { data: T, success?: boolean, status?: number, statusText?: string }) {
  return HttpResponse.json({
    success,
    data,
  }, {
    status,
    headers: { 'Content-Type': 'application/json' },
    statusText,
  })
}
function generateSuccessfulResponse(body: AddToFavoritesDTO[]) {
  return generateResponse({ data: { updated: body }, success: true, status: 200, statusText: 'Products updated' })
}
function generateFailedResponse(body: AddToFavoritesDTO[]) {
  const randomConflicts = sample(body, randomNumberInRangeInclusive(1, body.length))

  return generateResponse({ data: { conflicts: randomConflicts }, success: false, status: 422, statusText: 'Failed to update products' })
}

export const favoritesPatch: HttpHandler = http.patch<never, { payload: AddToFavoritesDTO[] }, FavoritesResponseGeneric>(
  '/api/favorites',
  async ({ request }) => {
    await delay(mswDelay.value)

    const isFailed = randomBoolean(mswRejectChance.value / 100)

    const body = await request.json()

    if (isFailed) return generateFailedResponse(body.payload)

    return generateSuccessfulResponse(body.payload)
  },
)

export type ProductId = Nominal<number, 'ProductId'>

export interface AddToFavoritesDTO {
  id: ProductId
  isFavorite: boolean
}

export interface FavoritesResponseGeneric<T = boolean> {
  success: T
  data: T extends true ? { updated: AddToFavoritesDTO[] } : { conflicts: AddToFavoritesDTO[] }
}

export type FavoritesResponse = FavoritesResponseGeneric<true> | FavoritesResponseGeneric<false>
