import { favoritesPatch } from './favorites'

import { type HttpHandler, HttpResponse, http } from 'msw'

const NotFoundResponse = new HttpResponse('Not found', {
  status: 404,
  headers: { 'Content-Type': 'text/plain' },
})

export const handlers: HttpHandler[] = [
  favoritesPatch,

  http.all('/api', () => NotFoundResponse),
  http.all('/api/*', () => NotFoundResponse),
]
