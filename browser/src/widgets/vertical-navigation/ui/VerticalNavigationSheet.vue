<script setup lang="ts">
import VerticalNavigation from './VerticalNavigation.vue'

import { Menu } from 'lucide-vue-next'
import { VisuallyHidden } from 'radix-vue'
import { Button } from '@shared/ui/button'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'

defineProps<{
  pathname: string
}>()
</script>

<template>
  <Sheet>
    <SheetTrigger asChild>
      <div class="fixed bottom-0 left-2 px-2 py-2 rounded-tr-lg bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/5">
        <Button size="icon">
          <Menu />
        </Button>
      </div>
    </SheetTrigger>
    <SheetContent side="left">
      <VisuallyHidden>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Naviation menu with list of app pages</SheetDescription>
        </SheetHeader>
      </VisuallyHidden>

      <VerticalNavigation :pathname="pathname"
                          class="mt-2"
      />
    </SheetContent>
  </Sheet>
</template>
