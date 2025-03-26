import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // 引入svg插件
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite' //引入api自动导入插件
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

import { wrapperEnv } from './build'

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}

// const pathSrc = pathResolve('src')
const pathSrc = resolve(__dirname, 'src')

// 设置别名，还可以添加其他路径
const alias: Record<string, string> = {
  '@': pathSrc,
  '@views': pathResolve('src/views'),
  '@store': pathResolve('src/store/modules')
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)

  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    /*主要看下面这段*/
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "@/styles/constant.scss";'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      // https: false,
      open: true,
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {
        '^/api': {
          target: 'http://127.0.0.0', // 自定义
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],

        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          ElementPlusResolver(),

          IconsResolver({
            prefix: 'Icon' // 图标前缀
          })
        ],

        dts: resolve(pathSrc, 'auto-imports.d.ts')
      }),

      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep'] // 启用 Element Plus 图标集
          }),
          ElementPlusResolver()
        ],
        dts: resolve(pathSrc, 'components.d.ts')
      }),

      Icons({
        autoInstall: true
      }),

      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),

      Inspect(),

      viteCompression({
        filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 需要压缩的文件
        threshold: 1024, // 文件容量大于这个值进行压缩
        algorithm: 'gzip', // 压缩方式
        ext: 'gz', // 后缀名
        deleteOriginFile: true // 压缩后是否删除压缩源文件
      })
    ],
    resolve: {
      alias
    }
  }
})
