/// <reference types="vite/client" />

declare const NominalType: unique symbol

declare global {
  export type Nominal<K, T> = K & { [NominalType]: T }
}

export {}
