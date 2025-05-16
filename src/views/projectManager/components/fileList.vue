<template>
	<div class="flex items-center justify-between mb-[20px]">
		<div class="flex items-center">
			<div
				class="mr-[20px] flex items-center cursor-pointer"
				@click="handleBack">
				<Icon-ep-arrow-left-bold v-if="deepList.length > 1" />
				<span>{{ deepList[deepList.length - 1].name }}</span>
			</div>

			<el-upload
				class="mr-[10px]"
				:show-file-list="false"
				:accept="acceptList"
				:before-upload="beforeUpload"
				:on-success="uploadSuccess">
				<el-button plain>上传文件</el-button>
			</el-upload>

			<el-button plain @click="changeFolder">创建文件夹 </el-button>
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
			<div
				v-for="item in fileList"
				:key="item.id"
				class="group flex flex-col items-center w-[100px] min-h-[120px] x] mr-[20px] mb-[20px] cursor-pointer"
				@dblclick="handleDblClick(item)">
				<img
					:src="setFilePicture(item.postfix)"
					alt=""
					class="h-[60px] !important w-[60px] !important mb-[5px]" />

				<template v-if="item.id">
					<div class="text-[14px] break-all">{{ item.name }}</div>

					<div class="opacity-0 group-hover:opacity-100">
						<el-button
							size="small"
							type="plain"
							link
							@click="downloadFile(item)">
							下载
						</el-button>
						<el-button
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
						<el-button size="small" type="primary" link @click="createFolder">
							创建
						</el-button>
						<el-button
							size="small"
							type="plain"
							link
							@click="cancleCreateFolder">
							取消
						</el-button>
					</div>
				</template>
			</div>
		</div>

		<div v-else>
			<el-table :data="fileList" style="width: 100%" row-class-name="group">
				<el-table-column prop="name" label="名称">
					<template #default="{ row }">
						<div
							class="flex items-center cursor-pointer"
							@dblclick.stop="handleDblClick(row)">
							<img
								:src="setFilePicture(row.postfix)"
								alt=""
								class="h-[40px] !important w-[40px] !important mr-[5px]" />

							<div
								v-if="row.id"
								class="text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
								{{ row.name }}
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
										size="small"
										type="primary"
										link
										@click="createFolder">
										创建
									</el-button>
									<el-button
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
				<el-table-column prop="time" label="上传时间" width="200" />
				<el-table-column prop="creator" label="上传者" width="200" />
				<el-table-column width="120">
					<template #default="{ row }">
						<div class="hidden group-hover:block" v-if="row.id">
							<el-button
								size="small"
								type="plain"
								link
								@click="downloadFile(row)">
								下载
							</el-button>
							<el-button
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

import { isEmpty } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import { useUpload } from '@/hooks'

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

// 展示方式
const showList = ref('vertical')

// 切换展示方式
const changeList = (type) => {
	showList.value = type
	if (unref(visibleCreateFolder)) {
		cancleCreateFolder()
	}
}

/**
 * 初始化文件列表
 */
const initFileList = ref([
	{
		id: 1,
		pid: 0,
		type: 'file',
		name: '文件1文件1文件1文件1文件1文件1',
		size: '10M',
		time: '2022-01-01',
		postfix: 'docx',
		creator: 'lzw',
	},
	{
		id: 2,
		pid: 0,
		type: 'file',
		name: '文件1',
		size: '10M',
		time: '2022-01-01',
		postfix: 'pdf',
		creator: 'lzw',
	},
	{
		id: 3,
		pid: 0,
		type: 'file',
		name: '文件1',
		size: '10M',
		time: '2022-01-01',
		postfix: 'xlsx',
		creator: 'lzw',
	},
	{
		id: 4,
		pid: 0,
		type: 'file',
		name: '文件1',
		size: '10M',
		time: '2022-01-01',
		postfix: 'zip',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹文件夹文件夹文件夹文件夹文件夹文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 6,
		pid: 5,
		type: 'file',
		name: '文件1',
		size: '10M',
		time: '2022-01-01',
		postfix: 'docx',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
	{
		id: 5,
		pid: 0,
		type: 'folder',
		name: '文件夹',
		size: '10M',
		time: '2022-01-01',
		postfix: 'folder',
		creator: 'lzw',
	},
])

// 文件夹深度
const deepList = ref([{ name: '文件', id: 0 }])

// 文件列表
const fileList = ref([])

/**
 * 设置文件图标
 */
const setFilePicture = (postfix) => {
	const type = '.' + postfix
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
		return type
	} else if (postfix === 'folder') {
		return folder
	} else {
		return docx
	}
}

/**
 * 双击事件
 */
const handleDblClick = (row) => {
	if (row.id === null) return
	if (row.type === 'folder') {
		deepList.value.push({ name: row.name, id: row.id })
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
 * 上传文件
 */
const uploadSuccess = (response, file, fileList) => {
	// TODO: 上传成功处理
}

// 是否新建文件夹
const visibleCreateFolder = ref(false)

/**
 * 创建文件夹
 */
const changeFolder = () => {
	visibleCreateFolder.value = true
	fileList.value.unshift({
		id: null,
		pid: deepList.value[deepList.value.length - 1].id,
		type: 'folder',
		name: '',
		size: '',
		time: '',
		postfix: 'folder',
		creator: '',
	})
}

// 新建的文件夹名称
const folderName = ref('')

/**
 * 创建文件夹
 */
const createFolder = () => {
	try {
		if (unref(folderName).trim() === '') {
			ElMessage.error('文件夹名称不能为空')
			return
		}
		// TODO: 创建文件夹
		fileList.value[0].id = new Date().getTime()
		fileList.value[0].name = folderName.value
		fileList.value[0].time = new Date().toLocaleString()
		fileList.value[0].creator = 'lzw'
		visibleCreateFolder.value = false
		folderName.value = ''
	} catch (err) {
		return Promise.reject(err)
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
const downloadFile = (row) => {
	// TODO: 下载请求
}

/**
 * 删除文件
 */
const deleteFile = async (row) => {
	try {
		const tips = row.type === 'folder' ? `${row.name}和里面的文件` : row.name
		await ElMessageBox.confirm(`请确认是否删除${tips}`, '提示', {
			confirmButtonText: '确定',
			type: 'warning',
			closeOnClickModal: false,
			closeOnPressEscape: false,
		})
		// TODO: 删除请求
		getFileList()
		console.log(row)
	} catch (err) {
		return Promise.reject(err)
	}
}

// 加载状态
const pageLoading = ref(false)

/**
 * 获取文件列表
 */
const getFileList = () => {
	try {
		pageLoading.value = true
		// TODO: 处理文件列表
		fileList.value = initFileList.value.filter(
			(item) => item.pid === deepList.value[deepList.value.length - 1].id
		)
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
