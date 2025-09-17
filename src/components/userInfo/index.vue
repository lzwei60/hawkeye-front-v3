<template>
	<div class="flex items-center">
		<el-avatar :src="userInfoData.userHead" :size="80" />

		<div class="ml-[18px]">
			<div class="text-2xl font-bold mb-[18px]">
				{{ userInfoData.userName }}
			</div>

			<div class="text-gray-500 text-[14px]">{{ userInfoData.userEmail }}</div>
		</div>
	</div>

	<el-divider />

	<div class="flex items-center">
		<PopoverSelect
			v-model="queryModel.projectId"
			:options="projectOptions"
			@change="searchFilter">
			<template #reference>
				<el-button :icon="Filter" round>
					{{ projectName }}
				</el-button>
			</template>
		</PopoverSelect>

		<PopoverSelect
			v-model="queryModel.status"
			:search="false"
			:width="150"
			:options="taskStatusList"
			@change="searchFilter">
			<template #reference>
				<el-button :icon="CollectionTag" round>{{ taskStatusLabel }}</el-button>
			</template>
		</PopoverSelect>
	</div>

	<div class="mt-[18px] h-[calc(100%-180px)]">
		<el-collapse
			v-model="collapseActive"
			expand-icon-position="left"
			class="overflow-hidden overflow-y-auto h-[100%]">
			<el-collapse-item
				v-for="item in tableData"
				:key="item.projectId"
				:name="item.projectId"
				:icon="CaretRight">
				<template #title="{ isActive }">
					<div class="flex items-center">
						<div class="text-[14px] font-bold">{{ item.projectName }}</div>

						<div
							class="ml-[10px] bg-[#999999] rounded-[10px] m-w-[20px] h-[20px] l-h-[20px] flex items-center text-white px-[4px]">
							{{ item.taskCount }}
						</div>
					</div>
				</template>

				<template v-if="item.tasks.length">
					<div v-for="task in item.tasks" :key="task.taskId" class="">
						<OnceTask :task="task" @update="searchFilter()"></OnceTask>

						<div
							v-for="childTask in task.children"
							:key="childTask.taskId"
							class="pl-[40px]">
							<OnceTask :task="childTask" @update="searchFilter()"></OnceTask>
						</div>
					</div>
				</template>

				<template v-else>
					<span class="flex justify-center ext-gray-500 text-[12px]">
						暂无数据
					</span>
				</template>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script setup>
import { Filter, CollectionTag, CaretRight } from '@element-plus/icons-vue'
import PopoverSelect from '@/components/popoverSelect/index.vue'
import OnceTask from '@/components/onceTask/index.vue'
import { getUserTasksApi } from '@/api/modules/task.js'
import { getUserInfoByIdApi } from '@/api/modules/user.js'
import { useAuth } from '@/hooks'
import { cloneDeep } from 'lodash-es'

defineOptions({
	name: 'UserInfo',
})

const props = defineProps({
	userId: {
		type: Number,
	},
})

const { $userId, $teamId, $projectList } = useAuth()

const queryModel = reactive({
	projectId: '',
	status: 0,
})

// 项目筛选列表
const projectOptions = computed(() => {
	const list = unref($projectList).map((item) => {
		return {
			...item,
			value: item.projectId,
			label: item.projectName,
		}
	})
	list.unshift({
		value: '',
		label: '全部项目',
	})
	return list
})

// 项目名称
const projectName = computed(() => {
	return projectOptions.value.find(
		(item) => item.value === queryModel.projectId
	).label
})

// 任务状态列表
const taskStatusList = ref([
	{ value: 0, label: '未开始' },
	{ value: 1, label: '已完成' },
	{ value: 2, label: '已延期' },
])

// 任务状态名称
const taskStatusLabel = computed(() => {
	return taskStatusList.value.find((item) => item.value === queryModel.status)
		.label
})

// 默认打开的折叠面板
const collapseActive = ref([1])

// 加载状态
const loading = ref(false)

// 任务列表数据
const tableData = ref([])

// 用户信息数据
const userInfoData = ref({})

/**
 * 搜索筛选项
 */
const searchFilter = () => {
	getTaskList()
}

/**
 * 获取任务列表
 */
const getTaskList = async () => {
	try {
		loading.value = true
		const params = cloneDeep(unref(queryModel))
		params.teamId = unref($teamId)
		params.userId = props.userId
		const { data: res } = await getUserTasksApi(params)
		tableData.value = res
		if (res.length) {
			collapseActive.value = [res[0].projectId]
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 获取用户信息
 */
const getUserInfoData = async () => {
	try {
		const params = {
			userId: props.userId,
		}
		const { data: res } = await getUserInfoByIdApi(params)
		userInfoData.value = res
		console.log(res)
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 初始化
 */
const init = async () => {
	await getTaskList()
	await getUserInfoData()
}

watch(() => props.userId, init, {
	deep: true,
	immediate: true,
})
</script>
