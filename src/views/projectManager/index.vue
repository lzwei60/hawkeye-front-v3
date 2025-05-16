<template>
	<div class="project-manager h-[100%]">
		<template v-if="projectList.length">
			<div class="header flex items-center mb-[18px]">
				<div class="pr-[20px] border-r">
					<el-button type="primary" @click="createProject">新建项目</el-button>
				</div>

				<div class="header-icon flex items-center pl-[20px]">
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
				class="content p-[20px] overflow-hidden overflow-y-auto h-[calc(100%-50px)]">
				<div v-if="showList === 'horizontal'" class="content-horizontal">
					<div class="list flex items-center">
						<div
							class="item mr-[30px] mb-[30px] p-[10px] flex flex-col items-center cursor-pointer hover:bg-[#eaf3ff] rounded-[4px]"
							v-for="item in projectList"
							:key="item.projectId"
							@click="pageToProject(item)">
							<div class="item-img w-[90px] h-[80px]">
								<img
									src="@/assets/images/folder.png"
									class="w-full h-full"
									alt="" />
							</div>

							<div class="item-title mt-[10px]">{{ item.projectName }}</div>
						</div>
					</div>
				</div>

				<div v-else class="content-vertical">
					<div class="list">
						<div
							class="item flex items-center mb-[30px] p-[10px] cursor-pointer hover:bg-[#eaf3ff] rounded-[4px] border-b"
							v-for="item in projectList"
							:key="item.projectId"
							@click="pageToProject(item)">
							<div class="item-img w-[90px] h-[80px]">
								<img
									src="@/assets/images/folder.png"
									class="w-full h-full"
									alt="" />
							</div>

							<div class="item-title ml-[10px]">{{ item.projectName }}</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<div v-else class="empty">
			<el-empty :image-size="200" description="暂无项目">
				<el-button type="primary" @click="createProject">新建项目</el-button>
			</el-empty>
		</div>
	</div>

	<el-dialog v-model="dialogData.visible" :title="dialogData.title" width="500">
		<el-form
			label-width="90px"
			:model="formModel"
			:rules="formRules"
			ref="formRef">
			<el-form-item label="项目名称" prop="projectName">
				<el-input
					v-model="formModel.projectName"
					maxlength="8"
					show-word-limit />
			</el-form-item>

			<el-form-item label="项目简介" prop="projectDesc">
				<el-input
					type="textarea"
					maxlength="500"
					show-word-limit
					:rows="4"
					v-model="formModel.projectDesc" />
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="cancle">取消</el-button>

				<el-button :loading="loading" type="primary" @click="confirm">
					确认
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'

const router = useRouter()

const showList = ref('horizontal')

/**
 * 切换列表展示方式
 */
const changeList = (type) => {
	showList.value = type
}

const projectList = ref([])

/**
 * 跳转项目
 */
const pageToProject = (item) => {
	console.log('pageToProject')
	router.push({
		path: '/dashboard/projectOnce',
		query: {
			menuActive: '/dashboard/projectManager',
		},
	})
}

const dialogData = ref({
	visible: false,
	title: '新建项目',
})

const formModel = ref({
	projectName: '',
	projectDesc: '',
})

const formRules = ref({
	projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
})

const formRef = ref(null)

/*
 * 表单校验
 */
const formValidate = async () => {
	return unref(formRef) && unref(formRef).validate()
}

/**
 * 清除校验
 */
const formClearValidate = async () => {
	return unref(formRef) && unref(formRef).clearValidate()
}

/**
 * 新建项目
 */
const createProject = () => {
	dialogData.value.visible = true
	formClearValidate()
}

/**
 * 取消
 */
const cancle = () => {
	dialogData.value.visible = false
}

const loading = ref(false)

/**
 * 确定新建
 */
const confirm = async () => {
	try {
		loading.value = true
		await formValidate()

		const model = cloneDeep(formModel.value)

		// TODO: 调用接口

		cancle()
		await getProjectList()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

const pageLoading = ref(false)

/**
 * 获取项目列表
 */
const getProjectList = async () => {
	try {
		pageLoading.value = true
		// TODO: 调用接口
	} catch (err) {
	} finally {
		pageLoading.value = false
	}
}

/**
 * 初始化
 */
const init = () => {
	getProjectList()
}

init()
</script>

<style lang="scss" scoped>
.project-manager {
	.content {
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}
}
</style>
