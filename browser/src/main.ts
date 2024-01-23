import { createApp } from 'vue'

import { AppRoot } from '@/app'
import { router } from '@/app/providers'
import '@/style.css'

async function initApp() {
  const { worker } = await import('./shared/mocks/browser')
  worker.start({
    quiet: true,
    onUnhandledRequest: (req, print) => {
      if (!req.url.startsWith('/api')) return

      print.warning()
    },
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })

  createApp(AppRoot)
    .use(router)
    .mount('#app')
}

initApp()
