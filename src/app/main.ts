import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/main.scss'

import { registerServices } from '@/app/providers/services'
import { setupUI } from '@/app/providers/ui'

registerServices()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

setupUI(app)

app.use(pinia)
app.use(router)

app.mount('#app')
