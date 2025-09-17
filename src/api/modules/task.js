import { request } from '@/utils/request'

/**
 * 获取任务列表接口
 * @param params
 * @returns
 */
export const getTaskListApi = async (params) => {
	return request.get('/getTaskList', params)
}

/**
 * 创建任务接口
 * @param params
 * @returns
 */
export const createTaskApi = async (params) => {
	return request.post('/createTask', params)
}

/**
 * 修改任务接口
 * @param params
 * @returns
 */
export const updateTaskApi = async (params) => {
	return request.post('/updateTask', params)
}

/**
 * 删除任务接口
 * @param params
 * @returns
 */
export const deleteTaskApi = async (params) => {
	return request.post('/deleteTask', params)
}

/**
 * 获取任务列表接口
 * @param params
 * @returns
 */
export const getCalendarTaskListApi = async (params) => {
	return request.get('/getCalendarTaskList', params)
}

/**
 * 获取指定用户团队任务列表接口
 * @param params
 * @returns
 */
export const getUserTasksApi = async (params) => {
	return request.post('/getUserTasks', params)
}
