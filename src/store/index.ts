import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

export * from './types/index'

export const store = createPinia()

export async function setupStore(app: App<Element>) {
  store.use(
    createPersistedState({
      storage: localStorage
    })
  )
  app.use(store)
}
