import { createApp } from 'vue'

import { AppRoot } from '@/app'
import { router } from '@/app/providers'
import '@/style.css'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

createApp(AppRoot)
  .use(router)
  .mount('#app')
