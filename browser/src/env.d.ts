/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { SetupWorker } from 'msw/browser'

declare const NominalType: unique symbol

declare global {
  export type Nominal<K, T> = K & { [NominalType]: T }

  interface Window {
    __mockServiceWorker?: SetupWorker
  }
}

export {}
