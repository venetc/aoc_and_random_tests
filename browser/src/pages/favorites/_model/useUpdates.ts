import { ref } from 'vue'

import type { AddToFavoritesDTO, ProductId } from '@/shared/mocks/handlers/favorites'

interface FilterUpdatesByResponsePayload {
  updatesFromResponse: AddToFavoritesDTO[]
  mode?: 'intersection' | 'difference'
}

export type UpdatesSet = Set<ProductId>

export function useUpdates() {
  const updates = ref<UpdatesSet>(new Set())

  const toggleUpdate = (key: ProductId) => {
    updates.value.has(key)
      ? updates.value.delete(key)
      : updates.value.add(key)
  }

  const setPendingUpdates = (keys: ProductId[]) => {
    updates.value.clear()
    keys.forEach(key => updates.value.add(key))
  }

  const filterUpdatesOnResponse = (payload: FilterUpdatesByResponsePayload) => {
    const { updatesFromResponse, mode = 'intersection' } = payload
    const result: ProductId[] = []

    for (const id of updates.value) {
      const wasEnqueued = updatesFromResponse.find(({ id: _id }) => id === _id)
      const condition = mode === 'intersection' ? wasEnqueued : !wasEnqueued

      if (condition) result.push(id)
    }

    return result
  }

  return {
    updates,
    toggleUpdate,
    setPendingUpdates,
    filterUpdatesOnResponse,
  }
}
