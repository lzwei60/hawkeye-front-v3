import { request } from '@/utils/request'

export const loginApi = (params: any) => {
  // 设置 showLoading，timeout 会覆盖index.ts里的默认值
  return request.post<any>('/login', params, { showLoading: false, timeout: 1000 })
}

export const sendSuccessApi = () => {
  return request.get<any>('/upms/user/info')
}

export const sendErrorApi = () => {
  return request.post<any>('/auth/auth/token', { timeout: 1000 })
}
