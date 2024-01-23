import { useFetch } from '@vueuse/core'
import { ref, toValue } from 'vue'

import type { UseFetchOptions } from '@vueuse/core'
import type { MaybeRef } from 'vue'
import type { ProductsMap } from './useProduct'
import type { AddToFavoritesDTO, FavoritesResponse } from '@/shared/mocks/handlers/favorites'
import type { UpdatesSet } from './useUpdates'

const fetchOptions: RequestInit = { method: 'PATCH' }
const useFetchOptions: UseFetchOptions = { immediate: false, updateDataOnError: true }
interface UseFavsArgs { products: MaybeRef<ProductsMap>, updates: MaybeRef<UpdatesSet> }

export function useFavoritesRequest({ products, updates }: UseFavsArgs) {
  const requestBody = ref<{ payload: AddToFavoritesDTO[] }>({ payload: [] })

  const requestData = useFetch<FavoritesResponse>('/api/favorites', fetchOptions, useFetchOptions).patch(requestBody).json<FavoritesResponse>()

  const resetRequestData = () => {
    requestData.data.value = null
    requestData.error.value = null
  }

  const mapUpdatesToDTO = () => {
    const updatesSet = toValue(updates)
    const productsMap = toValue(products)
    const result: AddToFavoritesDTO[] = []

    for (const key of updatesSet) {
      const product = productsMap.get(key)
      if (!product) continue
      result.push({ id: key, isFavorite: product.isFavorite })
    }

    return result
  }

  function updateRequestBody() {
    const payload = mapUpdatesToDTO()
    requestBody.value = { payload }
  }

  const addToFavsRequest = (onBeforeExecute?: () => void) => {
    if (requestData.isFetching.value) return
    const updatesSet = toValue(updates)
    if (updatesSet.size === 0) return

    if (onBeforeExecute) onBeforeExecute()
    requestData.execute()
  }

  return {
    requestData,
    requestBody,
    resetRequestData,
    updateRequestBody,
    addToFavsRequest,
  }
}
