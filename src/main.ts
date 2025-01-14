import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import {
  setupAppVersionNotification,
  setupDayjs,
  setupIconifyOffline,
  setupLoading,
  setupUI,
} from './plugins'
import { setupRouter } from './router'
import { setupStore } from './store'
import './plugins/assets'

async function setupApp() {
  setupLoading()

  setupIconifyOffline()

  setupDayjs()

  const app = createApp(App)

  setupUI(app)

  setupStore(app)

  await setupRouter(app)

  setupI18n(app)

  setupAppVersionNotification()

  app.mount('#app')
}

setupApp()
