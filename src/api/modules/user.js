import { request } from '@/utils/request'

/**
 * 获取当前用户信息
 * @returns
 */
export const getLoginUserInfoApi = async () => {
	return request.post('/getLoginUserInfo')
}

/**
 * 校验邮箱
 * @param params
 * @returns
 */
export const verifyInitEmailApi = async (params) => {
	return request.post('/verifyInitEmail', params)
}

/**
 * 修改邮箱
 * @param params
 * @returns
 */
export const updateUserEmailApi = async (params) => {
	return request.post('/updateUserEmail', params)
}

/**
 * 修改密码
 * @param params
 * @returns
 */
export const updatePasswordApi = async (params) => {
	return request.post('/updatePassword', params)
}

/**
 * 修改基础内容
 * @param params
 * @returns
 */
export const updateBaseInfoApi = async (params) => {
	return request.post('/updateBaseInfo', params)
}

/**
 * 根据用户id获取用户信息
 * @param params
 * @returns
 */
export const getUserInfoByIdApi = async (params) => {
	return request.post('/getUserInfoById', params)
}
