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
 * 获取项目列表接口（含已删除）
 * @param params
 * @returns
 */
export const getProjectAllListApi = async (params) => {
	return request.get('/getProjectAllList', params)
}

/**
 * 创建项目
 * @param {*} params
 * @returns
 */
export const createProjectApi = async (params) => {
	return request.post('/createProject', params)
}

/**
 * 查询项目成员（包含被删除的）
 * @param {*} params
 * @returns
 */
export const getProjectMembersApi = async (params) => {
	return request.post('/getProjectMembers', params)
}

/**
 * 批量更新项目成员（新增 & 删除）
 * @param {*} params
 * @returns
 */
export const updateProjectMembersApi = async (params) => {
	return request.post('/updateProjectMembers', params)
}

/**
 * 退出项目
 * @param {*} params
 * @returns
 */
export const quitProjectMemberApi = async (params) => {
	return request.post('/quitProjectMember', params)
}

/**
 * 移交项目管理员
 * @param {*} params
 * @returns
 */
export const transferProjectAdminApi = async (params) => {
	return request.post('/transferProjectAdmin', params)
}

/**
 * 解散项目
 * @param {*} params
 * @returns
 */
export const dissolveProjectApi = async (params) => {
	return request.post('/dissolveProject', params)
}

/**
 * 获取动态记录
 * @param {*} params
 * @returns
 */
export const getOperateLogsApi = async (params) => {
	return request.get('/getOperateLogs', params)
}

/**
 * 获取项目成员动态
 * @param {*} params
 * @returns
 */
export const getUserProjectOperatesApi = async (params) => {
	return request.get('/getUserProjectOperates', params)
}
