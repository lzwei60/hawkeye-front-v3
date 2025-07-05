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
	return request.post('/register', params)
}

/**
 * 发送注册验证码
 * @param {*} params
 * @returns
 */
export const sendEmailCodeApi = async (params) => {
	return request.post('/sendCode', params)
}

/**
 * 重置密码
 * @param {*} params
 * @returns
 */
export const resetPasswordApi = async (params) => {
	return request.post('/resetPassword', params)
}
