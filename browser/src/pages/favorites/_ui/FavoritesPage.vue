<script setup lang="ts">
import ProductCard from './ProductCard.vue'

import { useDebugger, useFavoritesRequest, useProduct, useUpdates } from '../_model'

import { ArrowBigRight, Loader2 } from 'lucide-vue-next'
import { nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useDebounceFn, useElementBounding, useScroll } from '@vueuse/core'

import type { DebounceFilterOptions } from '@vueuse/core'
import type { Product } from '../_model'
import type { Ref } from 'vue'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/ui/alert-dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { VerticalNavigationSheet } from '@/widgets/vertical-navigation'
import { mswDelay, mswRejectChance } from '@/shared/mocks/handlers/favorites'
import { clamp } from '@/shared/lib/number'

const props = defineProps<{ pathname: string, images: string[] }>()

function validateRange(ref: Ref<number>, lowerBound: number, upperBound: number) {
  return () => {
    let n = +ref.value

    if (Number.isNaN(n)) n = lowerBound

    ref.value = clamp(n, lowerBound, upperBound)
  }
}

const debounce = ref(750)

const validateChance = validateRange(mswRejectChance, 0, 100)
const validateRequestDelay = validateRange(mswDelay, 0, 5000)
const validateDebounceDelay = validateRange(debounce, 0, 5000)

const {
  updates,
  toggleUpdate,
  setPendingUpdates,
  filterUpdatesOnResponse,
} = useUpdates()

const {
  products,
  toggleProductFavorite,
  getProductsStateMismatches,
} = useProduct({ images: props.images })

const {
  requestData,
  requestBody,
  resetRequestData,
  updateRequestBody,
  addToFavsRequest,
} = useFavoritesRequest({ products, updates })

const { enqueueMessage, messagesQueue } = useDebugger()

const pluralizeProducts = (n: number) => n === 1 ? 'product' : 'products'

const debounceOptions: DebounceFilterOptions = { maxWait: 10_000 }
function addToFavsHandler() {
  addToFavsRequest(() => {
    enqueueMessage({ type: 'info', message: `Enqueue ${requestBody.value.payload.length} ${pluralizeProducts(requestBody.value.payload.length)} updates` })
  })
}

const debouncedAddToFavsRequest = useDebounceFn(addToFavsHandler, debounce, debounceOptions)

const {
  data: response,
  abort,
  onFetchFinally,
  isFetching,
  canAbort,
} = requestData

function abortFavoritesRequest() {
  if (canAbort.value) {
    enqueueMessage({ type: 'warning', message: 'Request aborted' })
    abort()
  }
}
function onProductUpdate(product: Product, oV: boolean, nV: boolean) {
  enqueueMessage({ type: 'default', message: `Product "${product.id}" favorite status changed from "${oV}" to "${nV}"` })
}

function toggleFavoriteAndRequest(product: Product) {
  toggleProductFavorite(product, onProductUpdate)
  abortFavoritesRequest()
  toggleUpdate(product.id)
  updateRequestBody()
  debouncedAddToFavsRequest()
}

const dialogOpened = ref(false)

function openConflictsDialog() {
  dialogOpened.value = true
}

function closeConflictsDialog() {
  dialogOpened.value = false
}

function rejectSolvingConflict() {
  abortFavoritesRequest()

  for (const id of updates.value) {
    const product = products.value.get(id)
    if (!product) continue
    toggleProductFavorite(product, onProductUpdate)
  }

  updates.value.clear()
  requestBody.value = { payload: [] }
  resetRequestData()
  closeConflictsDialog()
}

function tryToResolve() {
  if (isFetching.value) return
  updateRequestBody()
  addToFavsHandler()
}

const productsCompare = shallowRef<Product[][]>([])

function populateProductsCompare() {
  productsCompare.value = []
  const confictProducts: Product[][] = []

  for (const id of updates.value) {
    const product = products.value.get(id)
    if (!product) continue
    confictProducts.push([product])
  }

  for (const row of confictProducts) {
    const oldProduct = row[0]
    row.push({ ...oldProduct, isFavorite: !oldProduct.isFavorite })
  }

  productsCompare.value = confictProducts
}

onFetchFinally(() => {
  if (!response.value) return

  /**
   * Handle response conflicts
   */
  if (!response.value.success) {
    const unhandledUpdates = filterUpdatesOnResponse({ updatesFromResponse: response.value.data.conflicts })
    enqueueMessage({ type: 'error', message: `Failed to update ${unhandledUpdates.length} ${pluralizeProducts(unhandledUpdates.length)}` })
    setPendingUpdates(unhandledUpdates)
    populateProductsCompare()
    openConflictsDialog()
    return
  }

  /**
   * Handle response updates size mismatch
   */
  const isSameSize = response.value.data.updated.length === updates.value.size
  if (!isSameSize) {
    const unhandledUpdates = filterUpdatesOnResponse({ updatesFromResponse: response.value.data.updated, mode: 'difference' })
    enqueueMessage({ type: 'error', message: `Failed to update ${unhandledUpdates.length} ${pluralizeProducts(unhandledUpdates.length)}` })
    setPendingUpdates(unhandledUpdates)
    populateProductsCompare()
    openConflictsDialog()
    return
  }

  /**
   * Handle current UI state mismatch
   */
  const mismatchesAfterResponse = getProductsStateMismatches(response.value.data.updated)
  if (mismatchesAfterResponse.length > 0) {
    enqueueMessage({ type: 'error', message: `Failed to update ${mismatchesAfterResponse.length} ${pluralizeProducts(mismatchesAfterResponse.length)}` })
    setPendingUpdates(mismatchesAfterResponse)
    populateProductsCompare()
    openConflictsDialog()
    return
  }

  const productsAmount = response.value.data.updated.length
  enqueueMessage({ type: 'success', message: `Successfully updated ${productsAmount} ${pluralizeProducts(productsAmount)}` })
  updates.value.clear()
  requestBody.value = { payload: [] }
})

const debugArea = ref<HTMLElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)
const messagesInnerContainer = ref<HTMLElement | null>(null)

const { y } = useScroll(messagesContainer)
const { height, update } = useElementBounding(messagesInnerContainer)

watch(
  messagesQueue.value,
  () => {
    nextTick(() => {
      update()
      y.value += height.value
    })
  },
)

onMounted(() => {
  if (!debugArea.value) return
  messagesContainer.value = debugArea.value.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
})
</script>

<template>
  <div class="font-fira_code pb-14">
    <div class="mx-auto max-w-screen-lg flex gap-4 mb-4 max-md:flex-wrap">
      <div class="flex flex-col gap-4 max-w-xs w-full">
        <div>
          <Label for="reject"
                 class="mb-2"
          >
            Reject chance (%)
          </Label>
          <Input id="reject"
                 v-model.number="mswRejectChance"
                 placeholder="0...100"
                 type="number"
                 min="0"
                 max="100"
                 class="bg-white"
                 @input="validateChance"
          />
        </div>
        <div>
          <Label for="delay"
                 class="mb-2"
          >
            Request delay (ms)
          </Label>
          <Input id="delay"
                 v-model.number="mswDelay"
                 placeholder="0...5000"
                 type="number"
                 min="0"
                 max="5000"
                 class="bg-white"
                 @input="validateRequestDelay"
          />
        </div>
        <div>
          <Label for="debounce"
                 class="mb-2"
          >
            User actions debounce (ms)
          </Label>
          <Input id="debounce"
                 v-model.number="debounce"
                 placeholder="0...5000"
                 type="number"
                 min="0"
                 max="5000"
                 class="bg-white"
                 @input="validateDebounceDelay"
          />
        </div>
      </div>
      <div ref="debugArea"
           class="w-full"
      >
        <ScrollArea class="rounded-lg shadow-inner border h-56 text-xs"
                    type="auto"
        >
          <div ref="messagesInnerContainer"
               class="flex flex-col gap-y-1 max-sm:gap-y-4 px-2 py-1"
          >
            <div v-for="(entity, index) in messagesQueue"
                 :key="`${entity.timestamp}-${index}`"

                 class="flex gap-2 max-sm:flex-col max-md:gap-1"
            >
              <span>
                {{ entity.timestamp }}
              </span>
              <span :class="{
                'text-destructive': entity.type === 'error',
                'text-green-600': entity.type === 'success',
                'text-yellow-600': entity.type === 'warning',
                'text-blue-600': entity.type === 'info',
              }"
              >
                {{ entity.message }}
              </span>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-x-2 gap-y-2 max-w-screen-lg mx-auto max-md:grid-cols-2">
      <ProductCard v-for="[key, product] in products"
                   :key="key"
                   :product="product"
                   @onFavClick="toggleFavoriteAndRequest(product)"
      />
    </div>

    <AlertDialog :open="dialogOpened">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Couldn't change some items status.</AlertDialogTitle>
          <AlertDialogDescription>
            You can try again now or leave conflicted products as it is and try again later. Keep in mind that some products may be unavailable in the future.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea class="max-h-[60vh] max-sm:max-h-[40vh] rounded-lg shadow-inner"
                    type="auto"
        >
          <div class="space-y-2 p-2">
            <template v-for="[newProduct, oldProduct] in productsCompare"
                      :key="oldProduct.id"
            >
              <div class="grid grid-cols-11 pointer-events-none">
                <ProductCard class="col-span-5"
                             :product="oldProduct"
                             decorative
                />
                <ArrowBigRight class="place-self-center"
                               :size="24"
                               fill="currentColor"
                />
                <ProductCard class="col-span-5 col-start-7"
                             :product="newProduct"
                             decorative
                />
              </div>
            </template>
          </div>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel variant="destructive"
                             @click="rejectSolvingConflict"
          >
            Close
          </AlertDialogCancel>
          <AlertDialogAction :disabled="isFetching"
                             @click="tryToResolve"
          >
            <span>{{ isFetching ? 'Loading' : 'Try again' }}</span>
            <Loader2 v-if="isFetching"
                     :size="20"
                     class="ml-2 animate-spin"
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <VerticalNavigationSheet :pathname="pathname" />
  </div>
</template>
