<template>
	<div class="mb-[18px] flex align-center">
		<div class="text-[14px]">筛选动态：</div>

		<PopoverSelect
			v-model="queryFormModel.projectId"
			:options="projectOptions"
			@change="changeProject">
			<template #reference>
				<div class="text-[14px] w-[200px] cursor-pointer hover:opacity-80">
					{{ selectLabel }}
				</div>
			</template>
		</PopoverSelect>

		<PopoverSelect
			ref="popoverUserRef"
			v-model="queryFormModel.operatorId"
			value-key="userId"
			label-key="userName"
			:options="teamMemberList">
			<template #reference>
				<div class="flex items-center justify-center cursor-pointer">
					<div v-if="!queryFormModel.operatorId">
						<Icon-ep-userFilled class="text-[#999999] text-[20px]" />
					</div>

					<el-avatar
						v-else
						:src="
							findObjectLabel(
								queryFormModel.operatorId,
								'userId',
								teamMemberList
							)?.userHead || ''
						"
						size="small" />

					<span class="ml-[6px] text-[14px]">
						{{
							findObjectLabel(
								queryFormModel.operatorId,
								'userId',
								teamMemberList
							)?.userName || ''
						}}
					</span>
				</div>
			</template>

			<template #item="{ item }">
				<div
					:key="item.userId"
					class="flex items-center justify-between p-[5px] hover:bg-[#f5f5f5]"
					@click="changeValue(item.userId)">
					<div class="flex items-center cursor-pointer">
						<div class="mt-[5px] mr-[15px]">
							<div v-if="!item.userId">
								<Icon-ep-userFilled class="text-[#999999] text-[20px]" />
							</div>

							<el-avatar
								v-else
								:src="
									findObjectLabel(item.userId, 'userId', teamMemberList)
										?.userHead || ''
								"
								size="small" />
						</div>
						<div class="">{{ item.userName }}</div>
					</div>

					<div
						v-if="queryFormModel.operatorId === item.userId"
						class="before:content-['✔'] before:text-[#51b52f]"></div>
				</div>
			</template>
		</PopoverSelect>
	</div>

	<div
		v-infinite-scroll="infiniteScroll"
		class="overflow-auto h-[calc(100%-50px)]">
		<template v-if="dynamicData.length">
			<template v-for="dynamic in dynamicData" :key="dynamic.date">
				<div
					v-for="(project, projectIndex) in dynamic.list"
					:key="project.projectId"
					class="mb-[18px] last:mb-0">
					<div class="px-[18px]">
						<div class="flex items-center">
							<div
								v-if="projectIndex === 0"
								class="border-[4px] rounded-[50%] w-[70px] h-[70px] flex flex-col justify-center items-center">
								<div class="font-bold text-[146x] text-[#1677ff]">
									{{ dynamic.formatDate }}
								</div>
								<div class="text-[#666666] text-[14px]">
									{{ dynamic.weekday }}
								</div>
							</div>

							<el-divider class="flex-1" direction="horizontal" />

							<div class="ml-[10px] text-[#7f7f7f] text-[18px] font-bold">
								{{ getProjectName(project.projectId) }}
							</div>
						</div>
					</div>

					<div
						v-for="item in project.list"
						:key="item.operatorId"
						class="flex items-center px-[80px] mb-[18px] last:mb-0">
						<div class="text-[#7f7f7f] text-[12px] mr-[18px]">
							{{ item.operateTime.split(' ')[1] }}
						</div>

						<el-avatar
							class="mr-[18px]"
							:src="
								findObjectLabel(item.operatorId, 'userId', teamMemberList)
									?.userHead || ''
							"
							:size="50" />

						<div
							class="text-[14px] font-bold mr-[18px] cursor-pointer"
							@click="openDrawer(item.operatorId)">
							{{ $getUserNickName(item.operatorId) }}
						</div>

						<div class="text-[14px] mr-[18px]">{{ item.operateContent }}：</div>

						<div class="text-[14px]">{{ item.operateDetails }}</div>
					</div>
				</div>
			</template>

			<div v-if="pageLoading" class="text-[14px] text-center text-[#1677ff]">
				加载中...
			</div>

			<el-divider v-if="noMore">
				<div class="text-[14px] text-center text-[#999999]">我也是有底线的</div>
			</el-divider>
		</template>

		<el-empty v-else description="暂无动态数据"></el-empty>
	</div>

	<el-drawer
		v-model="drawerPropsData.visible"
		:size="drawerPropsData.width"
		:with-header="false">
		<UserInfo :userId="drawerPropsData.userId" />
	</el-drawer>
</template>

<script setup>
import { cloneDeep } from 'lodash-es'
import { useTeam, useAuth } from '@/hooks'
import {
	getOperateLogsApi,
	getProjectAllListApi,
} from '@/api/modules/project.js'
import PopoverSelect from '@/components/popoverSelect/index.vue'
import UserInfo from '@/components/userInfo/index.vue'
import calendar from '@/utils/lunarDay'

const { initMemberList } = useTeam()

const { $teamId, $teamUserList, $projectList, $getUserNickName, $userMap } =
	useAuth()

const QUERY_FROM_MODEL = {
	projectId: '',
	operatorId: '',
	page: 1,
	limit: 20,
}

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

// 所有项目列表
const projectAllList = ref([])

// 筛选数据
const queryFormModel = reactive(cloneDeep({ ...QUERY_FROM_MODEL }))

// 筛选项目 ref
const popoverProjetRef = ref(null)

// 筛选项目 name
const selectLabel = computed(() => {
	return projectOptions.value.find(
		(item) => item.value === unref(queryFormModel).projectId
	)?.label
})

/**
 * 修改项目
 */
const changeProject = (value) => {
	resetFormModel()
	getLoadData()
}

/**
 * 获取项目名称
 */
const getProjectName = (val) => {
	return projectAllList.value.find((item) => item.projectId === val)
		?.projectName
}

// 团队成员
const teamMemberList = computed(() => {
	return [
		{ userId: '', userName: '所有成员', headHead: '' },
		...unref($teamUserList),
	]
})

// 抽屉弹窗
const drawerPropsData = reactive({
	visible: false,
	width: '600px',
	userId: null,
})

/**
 * 打开抽屉弹窗
 */
const openDrawer = (userId) => {
	drawerPropsData.visible = true
	drawerPropsData.userId = userId
}

// 筛选用户 ref
const popoverUserRef = ref(null)

/**
 * 获取对象label
 */
const findObjectLabel = (id, key, options) => {
	const item = options.find((item) => item[key] === id)
	return item
}

/**
 * 修改数据
 */
const changeValue = (value) => {
	queryFormModel.operatorId = value
	popoverUserRef.value && popoverUserRef.value.hide()
	resetFormModel()
	getLoadData()
}

/**
 * 重置表单
 */
const resetFormModel = () => {
	queryFormModel.page = 1
	queryFormModel.limit = 20
	initialDynamicData.value = []
	dynamicData.value = []
	noMore.value = false
	total.value = 0
}

// 加载状态
const pageLoading = ref(false)

// 暂无数据
const noMore = ref(false)

// 总数
const total = ref(0)

// 展示的数据
const dynamicData = ref([])

// 动态总数
const initialDynamicData = ref([])

/**
 * 滚动加载
 */
const infiniteScroll = () => {
	if (unref(pageLoading) || unref(noMore)) return
	queryFormModel.page++
	getLoadData()
}

/**
 * 获取动态加载数据
 */
const getLoadData = async () => {
	try {
		pageLoading.value = true
		const params = {
			...unref(queryFormModel),
			teamId: unref($teamId),
		}
		if (unref(noMore)) return
		const { data: res } = await getOperateLogsApi(params)
		initialDynamicData.value.push(...res.list)
		total.value = res.total
		console.log(unref(initialDynamicData).length, unref(total))
		if (unref(initialDynamicData).length === unref(total)) {
			noMore.value = true
		}

		res.list.forEach((item) => {
			const date = item.operateTime.split(' ')[0]
			const dateIndex = dynamicData.value.findIndex(
				(data) => data.date === date
			)
			if (dateIndex > -1) {
				const projectIndex = dynamicData.value[dateIndex].list.findIndex(
					(data) => data.projectId === item.projectId
				)
				if (projectIndex > -1) {
					dynamicData.value[dateIndex].list[projectIndex].list.push(item)
				} else {
					dynamicData.value[dateIndex].list.push({
						projectId: item.projectId,
						list: [item],
					})
				}
			} else {
				const dateData = calendar.getDateStatus(date)
				const formatDate = date.split('-')[1] + '/' + date.split('-')[2]
				dynamicData.value.push({
					...dateData,
					formatDate,
					list: [{ projectId: item.projectId, list: [item] }],
				})
			}
		})
		console.log(dynamicData.value)
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}

/**
 * 返回操作时间
 * @param dateTime
 */
const handleOperateTime = (dateTime) => {
	return dateTime.split(' ')[1]
}

/**
 * 获取所有项目列表
 */
const getProjectList = async () => {
	try {
		const params = {
			teamId: unref($teamId),
		}
		const res = await getProjectAllListApi(params)

		projectAllList.value = res.data
	} catch (err) {
		return Promise.reject(err)
	}
}

const init = async () => {
	getProjectList()
	getLoadData()
}

onMounted(() => {
	init()
})
</script>

<style lang="scss" scoped></style>
