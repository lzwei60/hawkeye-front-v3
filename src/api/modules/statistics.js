import { request } from '@/utils/request'

/**
 * 获取项目任务数据接口
 * @param params
 * @returns
 */
export const getTaskStatisticsApi = async (params) => {
	return request.get('/getTaskStatistics', params)
}

/**
 * 获取项目重点关注总数据接口
 * @param params
 * @returns
 */
export const getTaskStatusCountApi = async (params) => {
	return request.get('/getTaskStatusCount', params)
}

/**
 * 查询任务列表（根据状态）接口
 * @param params
 * @returns
 */
export const getTaskListByStatusApi = async (params) => {
	return request.get('/getTaskListByStatus', params)
}

/**
 * 查询过期未完成任务
 * @param params
 * @returns
 */
export const getOverdueUnfinishedTasksApi = async (params) => {
	return request.get('/getOverdueUnfinishedTasks', params)
}

/**
 * 查询项目任务进展统计
 * @param params
 * @returns
 */
export const getProjectTaskStatsApi = async (params) => {
	return request.get('/getProjectTaskStats', params)
}
