import { request } from '@/utils/request'

/**
 * 获取项目列表接口
 * @param params
 * @returns
 */
export const getProjectListApi = async (params) => {
	return request.get('/getProjectList', params)
}

/**
 * 创建项目
 * @param {*} params
 * @returns
 */
export const createProjectApi = async (params) => {
	return request.post('/createProject', params)
}
