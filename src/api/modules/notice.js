import { request } from '@/utils/request'

/**
 * 获取通知列表接口
 * @param params
 * @returns
 */
export const getSelectNoticeApi = async (params) => {
	return request.get('/getSelectNotice', params)
}

/**
 * 全部标记已读接口
 * @param params
 * @returns
 */
export const markAllNoticesAsReadApi = async (params) => {
	return request.post('/markAllNoticesAsRead', params)
}

/**
 * 单个标记已读接口
 * @param params
 * @returns
 */
export const markOnceNoticesAsReadApi = async (params) => {
	return request.post('/markOnceNoticesAsRead', params)
}

/**
 * 批量删除通知接口
 * @param params
 * @returns
 */
export const deleteNoticesApi = async (params) => {
	return request.post('/deleteNotices', params)
}
