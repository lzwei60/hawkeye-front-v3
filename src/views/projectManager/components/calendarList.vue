<template>
	<div v-loading="loading" class="h-[calc(100vh-200px)]">
		<el-calendar v-model="calendarValue" ref="calendarRef">
			<template #header="{ date }">
				<div class="flex items-center">
					<div
						class="group border px-[2px] py-[5px] rounded mr-[10px] cursor-pointer hover:border-[#409eff]"
						@click="selectDate('prev-month')">
						<Icon-ep-arrow-left
							class="text-[#999999] group-hover:text-[#409eff]" />
					</div>

					<span>{{ date }}</span>

					<div
						class="group border px-[2px] py-[5px] rounded ml-[10px] cursor-pointer hover:border-[#409eff]"
						@click="selectDate('next-month')">
						<Icon-ep-arrow-right
							class="text-[#999999] group-hover:text-[#409eff]" />
					</div>

					<el-button plain class="ml-[10px]" @click="selectDate('today')">
						今天
					</el-button>
				</div>

				<div>
					<el-popover
						placement="bottom"
						:visible="visiblePopover"
						trigger="click">
						<template #reference>
							<div
								class="flex items-center cursor-pointer text-[12px] mt-[8px]"
								@click="visiblePopover = !visiblePopover">
								<Icon-ep-circle-check class="mr-[5px]" />
								{{ getQueryStatusName }}
							</div>
						</template>

						<div class="">
							<div
								class="px-[15px] py-[10px] cursor-pointer hover:bg-[#f5f7fa] flex items-center justify-between"
								v-for="item in statusList"
								:key="item.id"
								@click="changeQueryStatus(item.id)">
								<div>{{ item.name }}</div>
								<Icon-ep-success-filled
									v-if="queryStatus === item.id"
									class="text-[#409eff]" />
							</div>
						</div>
					</el-popover>
				</div>
			</template>

			<template #date-cell="{ data }">
				<div class="flex items-center justify-between px-[8px] mb-[5px]">
					<div class="flex items-center">
						<div class="text-[14px] mr-[5px]">
							{{ data.day.split('-').slice(1)[1] }}
						</div>
						<div class="text-[12px] text-[#999999]">
							{{ getLunarText(data.date) }}
						</div>
						<div
							v-if="getHolidaysText(data.date)"
							class="text-[12px] text-[#f5941d] ml-[10px]"
							:class="[data.type !== 'current-month' && 'opacity-50']">
							{{ getHolidaysText(data.date) }}
						</div>
						<div
							v-if="isWeek(data.day)"
							class="text-[12px] text-white rounded-full bg-[#f5941d] px-[3px] ml-[10px]"
							:class="[data.type !== 'current-month' && 'opacity-50']">
							休
						</div>
						<div
							v-if="isNoWeek(data.day)"
							class="text-[12px] text-white rounded-full bg-[#ff7482] px-[3px] ml-[10px]"
							:class="[data.type !== 'current-month' && 'opacity-50']">
							班
						</div>
					</div>

					<div class="add-task hidden" @click="showAddTask(data.day)">
						<Icon-ep-plus
							class="p-[5px] rounded-full text-[18px] border border-dashed cursor-pointer hover:bg-[#efefef]" />
					</div>
				</div>

				<div
					v-for="item in taskList[data.day]"
					:key="item.id"
					class="px-[5px] py-[2px] rounded bg-[#d2e5ff] mb-[5px] hover:bg-[#b5d1ff] overflow-hidden group relative">
					<div
						class="flex items-center transform -translate-x-[17px] transition-transform duration-300 ease-in-out group-hover:translate-x-0">
						<div>
							<el-checkbox
								v-model="item.completionStatus"
								:true-label="1"
								:false-label="0"
								size="small"
								@change="(val) => changeTaskStatus(val, item)" />
						</div>

						<el-avatar
							v-if="item.principal"
							class="ml-[5px]"
							:src="findObjectLabel(item.principal, 'userHead')"
							:size="16" />

						<div class="text-[12px] ml-[5px]">
							{{ item.taskName }}
						</div>
					</div>
				</div>

				<div v-if="showAddTaskDayStatus[data.day]" class>
					<el-input
						ref="addTaskInputRef"
						size="small"
						v-model="addTaskName"
						placeholder="请输入任务标题"
						@blur="confirmOrCancleTask(data.day)" />
				</div>
			</template>
		</el-calendar>
	</div>
</template>

<script setup name="CalendarList">
import { cloneDeep, isEmpty } from 'lodash-es'
import dayjs from 'dayjs'
import {
	getCalendarTaskListApi,
	createTaskApi,
	updateTaskApi,
} from '@/api/modules/task.js'
import { useTask, useAuth } from '@/hooks'
import calendar from '@/utils/lunarDay'

const { isExpired } = useTask()

const { $teamAllUserList, $userId, $projectId, $teamId } = useAuth()

const props = defineProps({
	projectMemberList: {
		type: Array,
		default: () => [],
	},
})

const calendarRef = ref()

// 表格选择项目人员列表
const projectMember = ref([{ userId: '', userName: '无负责人', userHead: '' }])

const calendarValue = ref(new Date())

/**
 * 切换日期
 */
const selectDate = async (val) => {
	if (!calendarRef.value) return
	calendarRef.value.selectDate(val)
	await getTaskList()
}

/**
 * 返回农历日期
 */
const getLunarText = (date) => {
	const lunarDay = calendar.solar2lunar(
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate()
	)

	const { IDayCn, IMonthCn } = lunarDay
	if (IDayCn === '初一') return IMonthCn
	return IDayCn
}

/**
 * 展示节假日
 */
const getHolidaysText = (date) => {
	const lunarDay = calendar.solar2lunar(
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate()
	)
	const { festival, lunarFestival } = lunarDay

	// 优先显示公历节日
	if (festival) return festival
	// 再显示农历节日
	if (lunarFestival) return lunarFestival

	return false
}

/**
 * 判断节假日
 */
const isWeek = (day) => {
	return calendar.libertyDayOptions.includes(day)
}

/**
 * 判断补班
 */
const isNoWeek = (day) => {
	return calendar.workingDayOptions.includes(day)
}

// 筛选状态
const statusList = ref([
	{ id: 0, name: '未完成任务' },
	{ id: 1, name: '已完成任务' },
	{ id: '', name: '所有状态' },
])

// 当前筛选状态
const queryStatus = ref(0)

// 状态弹出层状态
const visiblePopover = ref(false)

const getQueryStatusName = computed(() => {
	const item = unref(statusList).find((item) => item.id === unref(queryStatus))
	return item ? item.name : ''
})

/**
 * 筛选状态
 */
const changeQueryStatus = (val) => {
	queryStatus.value = val
	visiblePopover.value = false
	getTaskList()
}

// 任务列表
const taskList = ref({})

// 加载状态
const loading = ref(false)

/**
 * 获取任务列表
 */
const getTaskList = async () => {
	try {
		loading.value = true
		const time = dayjs(calendarValue.value)
		const startOfMonth = time.startOf('month').format('YYYY-MM-DD HH:mm:ss')
		const endOfMonth = time.endOf('month').format('YYYY-MM-DD HH:mm:ss')
		const params = {
			startTime: startOfMonth,
			endTime: endOfMonth,
			status: queryStatus.value,
		}
		const res = await getCalendarTaskListApi(params)
		taskList.value = {}
		const list = res.data
		list.forEach((item) => {
			const day = dayjs(item.deadlineTime).format('YYYY-MM-DD')
			taskList.value[day] = taskList.value[day] || []
			taskList.value[day].push(item)
		})
		console.log(taskList.value)
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 获取对象label
 */
const findObjectLabel = (id, file) => {
	const item = unref($teamAllUserList).find((item) => item.userId === id)
	return item ? item[file] || '' : ''
}

// 展示添加任务的日期状态
const showAddTaskDayStatus = ref({})

// 新增任务标题
const addTaskName = ref('')

// 新增任务输入框 ref
const addTaskInputRef = ref(null)

/**
 * 展示添加任务窗口
 */
const showAddTask = (day) => {
	for (let key in showAddTaskDayStatus.value) {
		showAddTaskDayStatus.value[key] = false
	}
	showAddTaskDayStatus.value[day] = true

	nextTick(() => {
		unref(addTaskInputRef) && addTaskInputRef.value.focus()
	})
}

/**
 * 确认 || 取消 添加任务
 */
const confirmOrCancleTask = (day) => {
	const taskName = unref(addTaskName).trim()
	if (isEmpty(taskName)) {
		showAddTaskDayStatus.value[day] = false
		return
	}
	confirmTask(day)
}

/**
 * 确认添加任务
 */
const confirmTask = async (day) => {
	try {
		const taskName = unref(addTaskName).trim()

		showAddTaskDayStatus.value[day] = false
		addTaskName.value = ''

		const newTask = {
			taskId: null,
			taskName,
			projectId: unref($projectId),
			teamId: unref($teamId),
			priority: 2,
			deadlineTime: day,
			principal: '',
		}
		if (taskName) {
			const res = await createTaskApi(newTask)
			taskList.value[day] = taskList.value[day] || []
			taskList.value[day].push(res.data)
		}
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 修改任务完成状态
 */
const changeTaskStatus = async (checked, row) => {
	const newTask = row
	try {
		newTask.completionStatus = checked ? 1 : 0
		newTask.consummator = checked ? unref($userId) : ''
		await updateTaskApi(newTask)
		await getTaskList()
	} catch (err) {
		newTask.completionStatus = !checked ? 1 : 0
		newTask.consummator = !checked ? unref($userId) : ''
		return Promise.reject(err)
	}
}

watch(
	() => props.projectMemberList,
	(arr) => {
		projectMember.value.push(...props.projectMemberList)
	},
	{
		deep: true,
		immediate: true,
	}
)

/**
 * 初始化数据
 */
const initial = () => {
	getTaskList()
}

onMounted(() => {
	initial()
})
</script>

<style lang="scss" scoped>
:deep .el-calendar {
	height: 100%;

	.el-calendar__body {
		height: calc(100% - 100px); /* 你可以设置为自己需要的高度 */
		overflow-y: auto;

		.el-calendar-table__row {
			.el-calendar-day {
				min-height: 85px;
				height: auto;

				&:hover {
					.add-task {
						display: block;
					}
				}
			}
		}
	}
}
</style>
