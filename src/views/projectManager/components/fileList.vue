<template>
	<div class="flex items-center justify-between mb-[20px]">
		<div class="flex items-center">
			<div
				class="mr-[20px] flex items-center cursor-pointer"
				@click="handleBack">
				<Icon-ep-arrow-left-bold v-if="deepList.length > 1" />
				<span>{{ deepList[deepList.length - 1].fileName }}</span>
			</div>

			<el-upload
				class="mr-[10px]"
				action="/api/uploadFile"
				name="file"
				:data="getUploadData"
				:headers="{
					Authorization: `Bearer ${$userInfo.token}`,
				}"
				:on-success="uploadSuccess"
				:on-error="uploadError"
				:before-upload="beforeUpload"
				:accept="acceptList"
				:show-file-list="false">
				<el-button :loading="btnLoading" plain>上传文件</el-button>
			</el-upload>

			<el-button :loading="btnLoading" plain @click="changeFolder">
				创建文件夹
			</el-button>
		</div>

		<div class="flex items-center pl-[20px]">
			<Icon-carbon-apps
				class="text-gray-300 text-[16px] mr-2.5 hover:text-gray-500 cursor-pointer"
				:class="{ 'text-gray-500': showList === 'horizontal' }"
				@click="changeList('horizontal')" />

			<Icon-carbon-list
				class="text-gray-300 text-[16px] mr-2.5 hover:text-gray-500 cursor-pointer"
				:class="{ 'text-gray-500': showList === 'vertical' }"
				@click="changeList('vertical')" />
		</div>
	</div>

	<div
		v-loading="pageLoading"
		class="px-[20px] pb-[20px] overflow-hidden overflow-y-auto h-[calc(100vh-280px)]">
		<div v-if="showList === 'horizontal'" class="flex flex-wrap">
			<template v-if="fileList.length">
				<div
					v-for="item in fileList"
					:key="item.fileId"
					class="group flex flex-col items-center w-[100px] min-h-[120px] x] mr-[20px] mb-[20px] cursor-pointer"
					@dblclick="handleDblClick(item)">
					<img
						:src="setFilePicture(item)"
						alt=""
						class="h-[60px] !important w-[60px] !important mb-[5px]" />

					<template v-if="item.fileId">
						<div class="text-[14px] break-all">{{ item.fileName }}</div>

						<div class="opacity-0 group-hover:opacity-100">
							<el-button
								:loading="btnLoading"
								size="small"
								type="plain"
								link
								@click="downloadFile(item)">
								下载
							</el-button>
							<el-button
								:loading="btnLoading"
								size="small"
								type="danger"
								link
								@click="deleteFile(item)">
								删除
							</el-button>
						</div>
					</template>

					<template v-else>
						<div class="text-[14px]">
							<el-input v-model="folderName" size="small" placeholder="" />
						</div>

						<div>
							<el-button
								:loading="btnLoading"
								size="small"
								type="primary"
								link
								@click="createFolder">
								创建
							</el-button>
							<el-button
								:loading="btnLoading"
								size="small"
								type="plain"
								link
								@click="cancleCreateFolder">
								取消
							</el-button>
						</div>
					</template>
				</div>
			</template>

			<template v-else>
				<el-empty class="m-[auto]" description="暂无文件"></el-empty>
			</template>
		</div>

		<div v-else>
			<el-table :data="fileList" style="width: 100%" row-class-name="group">
				<el-table-column prop="fileName" label="名称">
					<template #default="{ row }">
						<div
							class="flex items-center cursor-pointer"
							@dblclick.stop="handleDblClick(row)">
							<img
								:src="setFilePicture(row)"
								alt=""
								class="h-[40px] !important w-[40px] !important mr-[5px]" />

							<div
								v-if="row.fileId"
								class="text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
								{{ row.fileName }}
							</div>

							<div v-else class="flex items-center">
								<div class="text-[14px]">
									<el-input
										v-model="folderName"
										style="width: 100%"
										placeholder="" />
								</div>

								<div>
									<el-button
										:loading="btnLoading"
										size="small"
										type="primary"
										link
										@click="createFolder">
										创建
									</el-button>
									<el-button
										:loading="btnLoading"
										size="small"
										type="plain"
										link
										@click="cancleCreateFolder">
										取消
									</el-button>
								</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="size" label="大小" width="100" />
				<el-table-column prop="uploadTime" label="上传时间" width="200" />
				<el-table-column prop="uploaderName" label="上传者" width="200" />
				<el-table-column width="120">
					<template #default="{ row }">
						<div class="hidden group-hover:block" v-if="row.fileId">
							<el-button
								:loading="btnLoading"
								size="small"
								type="plain"
								link
								@click="downloadFile(row)">
								下载
							</el-button>
							<el-button
								:loading="btnLoading"
								size="small"
								type="danger"
								link
								@click.stop="deleteFile(row)">
								删除
							</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup name="FileList">
import docx from '@/assets/images/docx.svg'
import pdf from '@/assets/images/pdf.svg'
import xlsx from '@/assets/images/xlsx.svg'
import pptx from '@/assets/images/pptx.svg'
import zip from '@/assets/images/zip.svg'
import folder from '@/assets/images/folder.png'

import { isEmpty, cloneDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import { useUpload, useAuth } from '@/hooks'
import {
	getFileEntriesListApi,
	createFileEntryApi,
	deleteFileEntryApi,
	downloadFileApi,
	downloadFolderApi,
} from '@/api/modules/files.js'

const {
	acceptImgList,
	acceptWordList,
	acceptExcelList,
	acceptPdfList,
	acceptPPTList,
	acceptZipList,
	acceptList,

	beforeUpload,
} = useUpload()

const { $teamId, $projectId, $getUserNickName, $userInfo } = useAuth()

// 展示方式
const showList = ref('vertical')

// 切换展示方式
const changeList = (type) => {
	showList.value = type
	if (unref(visibleCreateFolder)) {
		cancleCreateFolder()
	}
}

// 按钮加载状态
const btnLoading = ref(false)

// 文件夹深度
const deepList = ref([{ fileName: '文件', fileId: 0 }])

// 文件列表
const fileList = ref([])

/**
 * 设置文件图标
 */
const setFilePicture = (row) => {
	const { extension, path } = row
	const type = '.' + extension
	if (acceptWordList.includes(type)) {
		return docx
	} else if (acceptPdfList.includes(type)) {
		return pdf
	} else if (acceptExcelList.includes(type)) {
		return xlsx
	} else if (acceptZipList.includes(type)) {
		return zip
	} else if (acceptPPTList.includes(type)) {
		return pptx
	} else if (acceptImgList.includes(type)) {
		return path
	} else if (extension === 'folder') {
		return folder
	} else {
		return docx
	}
}

/**
 * 双击事件
 */
const handleDblClick = (row) => {
	if (row.fileId === null) return
	if (row.fileType === 1) {
		deepList.value.push({ fileName: row.fileName, fileId: row.fileId })
		getFileList()
	}
}

/**
 * 返回上一级
 */
const handleBack = () => {
	deepList.value.pop()
	if (unref(visibleCreateFolder)) {
		cancleCreateFolder()
	}
	getFileList()
}

/**
 * 上传文件 的其他参数
 */
const getUploadData = () => {
	return {
		teamId: $teamId.value,
		projectId: $projectId.value,
		parentId: deepList.value[deepList.value.length - 1].fileId,
	}
}

/**
 * 上传文件
 */
const uploadSuccess = async (res, file, fileList) => {
	if (res.data.code === -1) {
		ElMessage.error(res.data.msg)
	} else {
		await getFileList()
	}
}

/**
 * 上传失败
 */
const uploadError = (res) => {
	ElMessage.error('上传失败')
}

// 是否新建文件夹
const visibleCreateFolder = ref(false)

/**
 * 创建文件夹
 */
const changeFolder = () => {
	visibleCreateFolder.value = true
	const newFolder = {
		teamId: $teamId.value,
		projectId: $projectId.value,
		fileName: '',
		fileType: 1,
		parentId: deepList.value[deepList.value.length - 1].fileId,
		size: 0,
		path: '',
		extension: 'folder',
	}
	fileList.value.unshift(newFolder)
}

// 新建的文件夹名称
const folderName = ref('')

/**
 * 创建文件夹
 */
const createFolder = async () => {
	try {
		btnLoading.value = true
		if (unref(folderName).trim() === '') {
			ElMessage.error('文件夹名称不能为空')
			return
		}
		fileList.value[0].fileName = folderName.value
		const params = cloneDeep(fileList.value[0])
		await createFileEntryApi(params)
		await getFileList()
		visibleCreateFolder.value = false
		folderName.value = ''
	} catch (err) {
		return Promise.reject(err)
	} finally {
		btnLoading.value = false
	}
}

/**
 * 取消创建文件夹
 */
const cancleCreateFolder = () => {
	fileList.value.shift()
	visibleCreateFolder.value = false
	folderName.value = ''
}

/**
 * 下载文件
 */
const downloadFile = async (row) => {
	try {
		btnLoading.value = true
		// 下载文件
		if (row.fileType === 0) {
			await downloadFileApi({ fileId: row.fileId })
		}
		// 下载压缩包
		else {
			const res = await downloadFolderApi({ fileId: row.fileId })
			console.log(res)
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		btnLoading.value = false
	}
}

/**
 * 删除文件
 */
const deleteFile = async (row) => {
	try {
		const tips =
			row.fileType === 1 ? `${row.fileName}和里面的文件` : row.fileName
		await ElMessageBox.confirm(`请确认是否删除${tips}`, '提示', {
			confirmButtonText: '确定',
			type: 'warning',
			closeOnClickModal: false,
			closeOnPressEscape: false,
		})
		const params = {
			fileId: row.fileId,
		}
		await deleteFileEntryApi(params)
		getFileList()
	} catch (err) {
		return Promise.reject(err)
	}
}

// 加载状态
const pageLoading = ref(false)

/**
 * 获取文件列表
 */
const getFileList = async () => {
	try {
		pageLoading.value = true
		const params = {
			parentId: unref(deepList).at(-1).fileId,
			projectId: $projectId.value,
			teamId: $teamId.value,
		}
		const res = await getFileEntriesListApi(params)
		fileList.value = res.data.map((item) => {
			item.uploaderName = $getUserNickName(item.uploader)
			if (item.size) {
				if (item.size < 1024) {
					item.size = item.size + 'B'
				} else if (item.size < 1024 * 1024) {
					item.size = (item.size / 1024).toFixed(2) + 'KB'
				} else if (item.size < 1024 * 1024 * 1024) {
					item.size = (item.size / 1024 / 1024).toFixed(2) + 'MB'
				} else {
					item.size = (item.size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
				}
			} else {
				item.size = '--'
			}
			return item
		})
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}

/**
 * 初始化数据
 */
const initial = () => {
	getFileList()
}

onMounted(() => {
	initial()
})
</script>

<style lang="scss" scoped></style>
