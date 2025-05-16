import { request } from '@/utils/request'

/**
 * 登录接口
 * @param params
 * @returns
 */
export const loginApi = async (params: any) => {
	return request.post('/login', params)
}

/**
 * 注册
 * @param params
 * @returns
 */
export const registerApi = async (params: any) => {
	return request.post('/login', params)
}
