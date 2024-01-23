<script setup lang="ts">
import { Heart, ShoppingBasket } from 'lucide-vue-next'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

import type { Product } from '../model'

import { AspectRatio, Button, Card, CardTitle } from '@/shared/ui'
import { cn } from '@/shared/lib'

const props = defineProps<{ product: Product, decorative?: boolean }>()
const emit = defineEmits<{ onFavClick: [] }>()

const bp = useBreakpoints(breakpointsTailwind)
const isMobile = bp.smaller('sm')
const mobileAR = computed(() => props.decorative ? 240 / 170 : 240 / 240)
const aspectRatio = computed(() => isMobile.value ? mobileAR.value : 240 / 130)
</script>

<template>
  <Card class="col-span-1 overflow-hidden">
    <AspectRatio :ratio="aspectRatio">
      <div class="absolute top-2 right-2">
        <Button size="icon"
                variant="ghost"
                class="bg-foreground/25 backdrop-blur-sm supports-[backdrop-filter]:bg-foreground/5 supports-[backdrop-filter]:hover:bg-foreground/5 hover:bg-foreground/5 group"
                @click="emit('onFavClick')"
        >
          <Heart :size="20"
                 class="transition-all group-hover:scale-125"
                 :class="[
                   product.isFavorite ? 'fill-destructive stroke-destructive' : 'fill-muted stroke-muted',
                 ]"
          />
        </Button>
      </div>
      <img :src="product.image"
           :alt="product.name"
           class="w-full h-full object-cover"
      >
    </AspectRatio>
    <div class="p-2 grid grid-cols-2">
      <CardTitle :class="cn(
        'col-start-1 row-start-1 row-span-2 self-start max-sm:text-base',
        decorative ? 'row-span-1 max-sm:row-start-1 max-sm:row-span-1 max-sm:col-span-2' : 'max-sm:row-start-1 max-sm:row-span-1 max-sm:col-span-2',
      )"
      >
        {{ product.name }}
      </CardTitle>
      <div :class="cn(
        'col-start-1 row-start-1 row-span-2 self-end max-sm:self-center max-sm:text-xs font-inter text-xs text-muted-foreground',
        decorative ? 'row-start-2 max-sm:row-start-2 max-sm:row-span-1 max-sm:col-span-2' : 'max-sm:mb-1.5 max-sm:row-start-2 max-sm:row-span-1',
      )"
      >
        {{ product.price }} $
      </div>
      <Button v-if="!decorative"
              class="col-start-2 max-sm:h-7 row-start-2 justify-self-end max-sm:col-start-1 max-sm:col-span-2 max-sm:row-start-3 max-sm:justify-self-start max-sm:w-full"
              size="icon"
              variant="secondary"
      >
        <ShoppingBasket :size="20" />
      </Button>
    </div>
  </Card>
</template>
