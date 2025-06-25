import { request } from '@/utils/request'

/**
 * 获取项目任务数据接口
 * @param params
 * @returns
 */
export const getProjectTotalDataApi = async (params) => {
	return request.get('/task/projectTotalData', params)
}

/**
 * 获取项目重点关注接口
 * @param params
 * @returns
 */
export const getProjectEmphasisDataApi = async (params) => {
	return request.get('/task/projectEmphasisData', params)
}

/**
 * 获取项目进展接口
 * @param params
 * @returns
 */
export const getProjectProgressApi = async (params) => {
	return request.get('/task/projectProgress', params)
}

/**
 * 获取项目逾期分布接口
 * @param {*} params
 * @returns
 */
export const getProjectOverdueApi = async (params) => {
	return request.get('/task/projectOverdue', params)
}
