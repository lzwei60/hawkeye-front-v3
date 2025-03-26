/**
 * 创建实例，可以多个，当你需要请求多个不同域名的接口时
 */
import Request from './request'
import { getToken } from '@/utils/auth'

const request = new Request({
  // 这里用 Easy Mock 模拟了真实接口
  baseURL: 'https://mock.mengxuegu.com/mock/65421527a6dde808a695e96d/official/',
  timeout: 60000,
  showLoading: true,
  interceptorHooks: {
    requestInterceptor: (config) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    requestInterceptorCatch: (err) => {
      return err
    },
    responseInterceptor: (res) => {
      return res.data
    },
    responseInterceptorCatch: (err) => {
      return Promise.reject(err)
    }
  }
})

export { request }
