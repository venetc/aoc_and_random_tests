<script setup lang="ts">
import { AlertDialogCancel, type AlertDialogCancelProps } from 'radix-vue'

import { cn } from '@/shared/lib/utils'
import { buttonVariants } from '@/shared/ui/button'

const props = defineProps<AlertDialogCancelProps>()
</script>

<template>
  <AlertDialogCancel v-bind="props"
                     :class="cn(buttonVariants({ variant: 'destructive' }), 'mt-2 sm:mt-0', $attrs.class ?? '')"
  >
    <slot />
  </AlertDialogCancel>
</template>
