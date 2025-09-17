import { request } from '@/utils/request'

/**
 * 查询项目附件列表
 * @param params
 * @returns
 */
export const getFileEntriesListApi = async (params) => {
	return request.get('/getFileEntriesList', params)
}

/**
 * 创建项目附件文件夹
 * @param {*} params
 * @returns
 */
export const createFileEntryApi = async (params) => {
	return request.post('/createFileEntry', params)
}

/**
 * 删除项目附件
 * @param {*} params
 * @returns
 */
export const deleteFileEntryApi = async (params) => {
	return request.post('/deleteFileEntry', params)
}

/**
 * 修改项目附件
 * @param {*} params
 * @returns
 */
export const updateFileEntryApi = async (params) => {
	return request.post('/updateFileEntry', params)
}

/**
 * 下载单个文件
 * @param {*} params
 * @returns
 */
export const downloadFileApi = async (params) => {
	return request.get('/downloadFile', params, {
		downloadFile: true,
	})
}

/**
 * 下载文件夹（打包 zip）
 * @param {*} params
 * @returns
 */
export const downloadFolderApi = async (params) => {
	return request.get('/downloadFolder', params, {
		downloadFile: true,
	})
}
