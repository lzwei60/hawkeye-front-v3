import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import components from '@/components/index'

import 'virtual:svg-icons-register' // 导入svg需要的配置代码

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/dark/css-vars.css' // 导入element-plus的暗黑模式
import 'element-plus/dist/index.css' // 确保样式文件已经引入

import '@/styles/index.scss'

import { setupStore } from './store'

// import { mockXHR } from '../mock/index'

import { mixins } from './mixins'

// 判断开发环境
// if (process.env.VITE_USER_NODE_ENV == 'development') {
// 	mockXHR()
// }

async function start() {
	const app = createApp(App)

	app.use(ElementPlus, {
		locale: zhCn,
	})

	app.use(components)

	app.use(router)

	setupStore(app)

	app.mixin(mixins)

	app.mount('#app')
}

start()
