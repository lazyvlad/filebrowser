import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    base : 'https://dev.afk.mk/filebrowser/dist/',
    server: {
        hmr: {
            host: 'localhost'

        },
    },
  plugins: [vue()]
})