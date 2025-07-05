import { request } from '@/utils/request'

/**
 * 查询用户所在团队
 * @param params
 * @returns
 */
export const selectUserTeamApi = async (params) => {
	return request.get('/selectTeam', params)
}

/**
 * 根据团队编码申请加入团队
 * @param params
 * @returns
 */
export const applyTeamApi = async (params) => {
	return request.post('/applyForTeam', params)
}

/**
 * 创建团队
 * @param params
 * @returns
 */
export const createTeamApi = async (params) => {
	return request.post('/creatTeam', params)
}

/**
 * 获取团队成员列表
 * @param params
 * @returns
 */
export const getTeamMembersApi = async (params) => {
	return request.get('/getTeamMembers', params)
}

/**
 * 获取团队所有成员列表
 * @param params
 * @returns
 */
export const getAllTeamMembersApi = async (params) => {
	return request.get('/getAllTeamMembers', params)
}

/**
 * 获取团队待审核成员列表
 * @param params
 * @returns
 */
export const getPendingTeamMembersApi = async (params) => {
	return request.get('/getPendingTeamMembers', params)
}

/**
 * 修改团队待审核成员状态
 * @param params
 * @returns
 */
export const updateTeamUserStatusApi = async (params) => {
	return request.post('/updateTeamUserStatus', params)
}

/**
 * 重置团队邀请码
 * @param params
 * @returns
 */
export const regenerateTeamInvitationKeyApi = async (params) => {
	return request.post('/regenerateTeamInvitationKey', params)
}

/**
 * 修改团队成员身份
 * @param params
 * @returns
 */
export const updateTeamUserIdentityApi = async (params) => {
	return request.post('/updateTeamUserIdentity', params)
}
