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
								所有状态
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
						class="flex items-center transform -translate-x-[16px] transition-transform duration-300 ease-in-out group-hover:translate-x-0">
						<div>
							<el-checkbox
								v-model="item.taskStatus"
								:true-label="1"
								:false-label="0"
								size="small"
								@change="(val) => changeTaskStatus(val, item)" />
						</div>

						<el-avatar
							v-if="item.principal"
							class="ml-[5px]"
							:src="findObjectLabel(item.principal, 'headImg')"
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
import { useTask } from '@/hooks'
import calendar from '@/utils/lunarDay'

const { libertyDayOptions, workingDayOptions, initTableData, isExpired } =
	useTask()

const calendarRef = ref()

const projectMember = ref([
	{ userId: '-1', userName: '无负责人', headImg: '' },
	{ userId: 'liaozhiwei', userName: '廖志伟', headImg: '' },
])

const calendarValue = ref(new Date())

/**
 * 切换日期
 */
const selectDate = (val) => {
	if (!calendarRef.value) return
	calendarRef.value.selectDate(val)
	queryFilter()
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
	return libertyDayOptions.includes(day)
}

/**
 * 判断补班
 */
const isNoWeek = (day) => {
	return workingDayOptions.includes(day)
}

// 筛选状态
const statusList = ref([
	{ id: 0, name: '未完成任务' },
	{ id: 1, name: '已完成任务' },
	{ id: 100, name: '所有状态' },
])

// 当前筛选状态
const queryStatus = ref(0)

// 状态弹出层状态
const visiblePopover = ref(false)

/**
 * 筛选状态
 */
const changeQueryStatus = (val) => {
	queryStatus.value = val
	visiblePopover.value = false
	queryFilter()
}

// 任务列表
const taskList = ref({})

// 加载状态
const loading = ref(false)

/**
 * 获取任务列表
 */
const getTaskList = () => {
	try {
		loading.value = true
		// TODO: 请求任务列表
		queryFilter()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 查询
 */
const queryFilter = () => {
	// 深拷贝初始数据
	let filteredData = cloneDeep(unref(initTableData))
	// 当前日期
	const dayjsNow = dayjs(unref(calendarValue))
	// 获取指定日期上一个月的开始日期
	const monthStart = dayjsNow
		.subtract(1, 'month')
		.startOf('month')
		.format('YYYY-MM-DD')
	// 获取指定日期下一个月的结束日期
	const monthEnd = dayjsNow.add(1, 'month').endOf('month').format('YYYY-MM-DD')
	// 过滤数据的函数
	const filterData = (data) => {
		return data.filter((item) => {
			if (unref(queryStatus) === 100) return true

			// 任务状态筛选
			if (item.taskStatus !== unref(queryStatus)) {
				return false
			}
			// if (isEmpty(item.deadline)) return false

			const targetDate = dayjs(item.deadline)

			// 判断是否在这个月内（包含起始和结束）
			const isInMonth =
				targetDate.isSameOrAfter(monthStart, 'day') &&
				targetDate.isSameOrBefore(monthEnd, 'day')

			return isInMonth
		})
	}

	// 执行过滤
	taskList.value = filterData(filteredData).reduce((acc, item) => {
		const key = item.deadline
		if (!acc[key]) {
			acc[key] = []
		}
		acc[key].push(item)
		return acc
	}, {})
}

/**
 * 获取对象label
 */
const findObjectLabel = (id, file) => {
	const item = unref(projectMember).find((item) => item.userId === id)
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
const confirmTask = (day) => {
	try {
		const taskName = unref(addTaskName).trim()

		// TODO: 添加任务
		showAddTaskDayStatus.value[day] = false
		addTaskName.value = ''
		taskList.value[day] = taskList.value[day] || []
		taskList.value[day].push({
			taskName,
			taskStatus: 0,
			userId: '-1',
			deadline: day,
		})
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 修改任务完成状态
 */
const changeTaskStatus = (checked, row) => {
	row.taskStatus = checked ? 1 : 0
}

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
