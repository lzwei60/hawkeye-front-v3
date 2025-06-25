import { request } from '@/utils/request'

/**
 * 登录接口
 * @param params
 * @returns
 */
export const loginApi = async (params) => {
	return request.post('/login', params)
}

/**
 * 注册
 * @param params
 * @returns
 */
export const registerApi = async (params) => {
	return request.post('/login', params)
}
