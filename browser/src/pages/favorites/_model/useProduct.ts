import { ref } from 'vue'

import type { AddToFavoritesDTO, ProductId } from '@/shared/mocks/handlers/favorites'

const names = ['FluxFoot', 'VaporBounce', 'ZephyrKicks', 'FusionSole', 'AeroStep', 'NexusStride', 'BlitzDash', 'PhoenixSprint']
const prices = [99.99, 129.99, 149.99, 189.99, 199.99, 249.99, 299.99, 349.99]

export interface Product {
  id: ProductId
  name: string
  image: string
  price: number
  isFavorite: boolean
}

export type ProductsMap = Map<ProductId, Product>

export function useProduct({ images }: { images: string[] }) {
  const products = ref<ProductsMap>(new Map(
    Array.from(
      { length: names.length },
      (_, index) => (
        [index, {
          id: index,
          name: names[index % names.length],
          image: images[index % images.length],
          price: prices[index % prices.length],
          isFavorite: false,
        }] as [ProductId, Product]),
    ),
  ))

  const toggleProductFavorite = (product: Product, onAfterProductUpdate?: (product: Product, oV: boolean, nV: boolean) => void) => {
    product.isFavorite = !product.isFavorite
    if (onAfterProductUpdate) onAfterProductUpdate(product, !product.isFavorite, product.isFavorite)
  }

  const getProductsStateMismatches = (updates: AddToFavoritesDTO[]) => {
    const mismatches = []

    for (const responseDTO of updates) {
      const product = products.value.get(responseDTO.id)
      if (!product) continue

      if (product.isFavorite !== responseDTO.isFavorite) mismatches.push(product.id)
    }

    return mismatches
  }

  return {
    products,
    toggleProductFavorite,
    getProductsStateMismatches,
  }
}
