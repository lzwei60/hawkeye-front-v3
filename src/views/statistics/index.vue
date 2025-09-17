<template>
	<div class="mb-[18px] flex align-center">
		<div class="text-[14px]">项目筛选：</div>
		<PopoverSelect
			v-model="projectId"
			:options="projectList"
			labelKey="projectName"
			valueKey="projectId"
			@change="changeProject">
			<template #reference>
				<div class="text-[14px] w-[200px] cursor-pointer hover:opacity-80">
					{{ selectLabel }}
				</div>
			</template>
		</PopoverSelect>
	</div>

	<div class="flex items-center justify-center">
		<!-- 任务数据 -->
		<div
			v-loading="taskDataLoading"
			class="rounded-lg border flex-1 mr-[12px] p-[12px]">
			<div class="mb-[12px] flex items-center justify-between">
				<div class="text-[16px] font-bold">{{ selectLabel }}任务数据</div>

				<div class="flex items-center bg-[#eeeeee] rounded p-[1px]">
					<div
						class="text-[12px] px-[6px] py-[2px] cursor-pointer first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br"
						:class="[
							dateActive == item.value ? 'bg-[#ffffff] text-[#999999] ' : '',
						]"
						v-for="item in filterDateList"
						:key="item.value"
						@click="changeDate(item.value)">
						{{ item.label }}
					</div>
				</div>
			</div>

			<el-row :gutter="12">
				<el-col
					:span="8"
					v-for="item in taskDataRecoed"
					:key="item.value"
					class="task-item">
					<div class="rounded-lg bg-[#ECF4FF] p-[12px]">
						<div class="text-[14px] font-bold">{{ item.label }}</div>

						<div class="text-[18px] font-bold mt-[6px]">{{ item.count }}</div>
					</div>
				</el-col>
			</el-row>
		</div>

		<!-- 重点关注 -->
		<div
			v-loading="emphasisLoading"
			class="rounded-lg border w-[420px] p-[12px]">
			<div class="mb-[12px]">
				<div class="text-[16px] font-bold">{{ selectLabel }}重点关注</div>

				<div class="mt-[12px]">
					<el-row :gutter="12">
						<el-col
							:span="8"
							v-for="item in emphasisTaskStutas"
							:key="item.value"
							class="task-item">
							<div
								class="rounded-lg py-[6px] px-[10px] flex justify-between items-center cursor-pointer border border-[#ffffff]"
								:style="{
									backgroundColor: item.bgColor,
									borderColor:
										emphasisTaskActive === item.value ? item.color : '',
								}"
								@click="changeTaskStutas(item.value)">
								<div class="text-[12px] font-bold">{{ item.label }}</div>

								<div
									class="text-[12px] font-bold"
									:style="{ color: item.color }">
									{{ item.count }}
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>

			<el-scrollbar ref="scrollRef" height="125px" @scroll="handleScroll()">
				<div
					v-for="item in emphasisTaskList"
					:key="item.taskId"
					class="mb-[12px]">
					<div class="flex items-center">
						<div class="text-[12px] max-w-[340px] truncate">
							{{ item.taskName }}
						</div>
						<div
							class="text-[12px] rounded-sm px-[2px] text-white bg-[#F56B6C] ml-[5px]"
							:style="{
								backgroundColor: getPriorityData(item.priority, 'color'),
							}">
							{{ getPriorityData(item.priority, 'label') }}
						</div>
					</div>

					<div class="text-[12px] text-[#999999]">
						负责人：{{ item.executorName }}
					</div>
				</div>

				<div
					v-if="scrollLoading"
					class="flex items-center justify-center my-[16px] text-[#999999] text-[12px]">
					<span> 加载中... </span>
				</div>
				<div
					v-else-if="scrollNoMore"
					class="flex items-center justify-center my-[16px] text-[#999999] text-[12px]">
					<span>暂无更多数据</span>
				</div>
			</el-scrollbar>
		</div>
	</div>

	<div class="mt-[12px] flex items-center justify-center h-[calc(100%-280px)]">
		<!-- 各/筛选项目名称）项目进展 -->
		<div class="flex-1 mr-[12px] border rounded-lg p-[12px] h-[100%] w-[100%]">
			<div class="text-[18px] font-bold">
				{{ projectId === '' ? '各项目' : selectLabel }}进展
			</div>

			<barCharts
				class="h-[calc(100%-20px)]"
				v-loading="progressLoading"
				:visible-empty="progressVisibleChart"
				v-bind="progressChartConfig"
				:toolbox="false" />
		</div>

		<!-- 过期任务（所有项目/项目成员）分布 -->
		<div class="flex-1 border rounded-lg p-[12px] h-[100%] w-[100%]">
			<div class="text-[18px] font-bold">
				过期任务{{ projectId === '' ? '所有项目' : selectLabel + '成员' }}分布
			</div>

			<barCharts
				class="h-[calc(100%-20px)]"
				v-loading="overdueLoading"
				:visible-empty="overdueVisibleChart"
				:dataZoom="false"
				v-bind="overdueChartConfig"
				:toolbox="false" />
		</div>
	</div>
</template>

<script setup>
import { cloneDeep, divide, multiply, round } from 'lodash-es'
import dayjs from 'dayjs'
import { useTask, useAuth } from '@/hooks'
import barCharts from '@/components/echart/barCharts.vue'
import PopoverSelect from '@/components/popoverSelect/index.vue'
import {
	getTaskStatisticsApi,
	getTaskStatusCountApi,
	getTaskListByStatusApi,
	getOverdueUnfinishedTasksApi,
	getProjectTaskStatsApi,
} from '@/api/modules/statistics.js'

const { priorityOptions } = useTask()

const { $teamId, $projectList, $getUserNickName } = useAuth()

/********** 任务数据 ************/
// 任务数据 加载状态
const taskDataLoading = ref(false)
// 当前日期选日期
const dateActive = ref('day')
// 筛选日期
const filterDateList = ref([
	{ label: '今日', value: 'day' },
	{ label: '本周', value: 'isoWeek' },
	{ label: '本月', value: 'month' },
	{ label: '本年', value: 'year' },
])
// 任务数据
const taskDataRecoed = ref([
	{ value: 'totalTasks', label: '任务总数', count: 0 },
	{ value: 'completedTasks', label: '已完成任务', count: 0 },
	{ value: 'onTimeRate', label: '准时完成率', count: 0 },
	{ value: 'totalUsers', label: '总人数', count: 0 },
	{ value: 'avgTasksPerUser', label: '平均任务量', count: 0 },
	{ value: 'unassignedTasks', label: '未安排任务', count: 0 },
])
/**
 * 获取任务数据
 */
const getProjectTotalData = async () => {
	try {
		taskDataLoading.value = true
		const params = handleTotalParams()

		const { data: res } = await getTaskStatisticsApi(params)
		taskDataRecoed.value.forEach((item) => {
			item.count = res[item.value]
		})
	} catch (err) {
		return Promise.reject(err)
	} finally {
		taskDataLoading.value = false
	}
}
/**
 * 处理任务数据参数
 */
const handleTotalParams = () => {
	const format = 'YYYY-MM-DD HH:mm:ss'

	const params = {
		teamId: unref($teamId),
		startTime: dayjs().startOf(unref(dateActive)).format(format), // 开始
		endTime: dayjs().endOf(unref(dateActive)).format(format), // 结束
	}
	if (unref(projectId)) {
		params.projectId = unref(projectId)
	}

	return params
}
/**
 * 监听日期
 */
const changeDate = (val) => {
	if (unref(dateActive) === val) return
	dateActive.value = val
	getProjectTotalData()
}

/********** 重点关注 ************/
// 重点关注 加载状态
const emphasisLoading = ref(false)
// 重点关注 当前任务状态
const emphasisTaskActive = ref('expiredCount')
// 重点关注 任务状态筛选
const emphasisTaskStutas = ref([
	{
		label: '过期任务',
		value: 'expiredCount',
		count: 12,
		color: '#000000',
		bgColor: '#F7F7F7',
	},
	{
		label: '未完成任务',
		value: 'unfinishedCount',
		count: 12,
		color: '#F9AE42',
		bgColor: '#FDF7ED',
	},
	{
		label: '最高级任务',
		value: 'priorityICount',
		count: 12,
		color: '#F56B6C',
		bgColor: '#FCF1F0',
	},
])
// 重点关注 任务列表
const emphasisTaskList = ref([])
// 当前页数
const page = ref(1)
// 滚动加载 dom
const scrollRef = ref()
// 滚动加载
const scrollLoading = ref(false)
// 是否还有更多
const scrollNoMore = ref(false)
/**
 * 获取重点关注数据
 */
const getProjectEmphasisData = async () => {
	try {
		emphasisLoading.value = true
		const params = {
			teamId: unref($teamId),
		}
		if (unref(projectId)) {
			params.projectId = unref(projectId)
		}
		const { data: res } = await getTaskStatusCountApi(params)
		emphasisTaskStutas.value.forEach((item) => {
			item.count = res[item.value]
		})
	} catch (err) {
		return Promise.reject(err)
	} finally {
		emphasisLoading.value = false
	}
}
/**
 * 获取重点关注单个列表数据
 */
const getProjectEmphasisListData = async () => {
	try {
		scrollLoading.value = true
		if (unref(scrollNoMore)) return

		const params = {
			teamId: unref($teamId),
			page: unref(page),
			status: unref(emphasisTaskActive),
		}
		if (unref(projectId)) {
			params.projectId = unref(projectId)
		}
		const { data: res } = await getTaskListByStatusApi(params)
		const data = res.map((item) => {
			item.executorName = $getUserNickName(item.principal) || '--'
			return item
		})
		emphasisTaskList.value.push(...data)
		const total =
			unref(emphasisTaskStutas).find(
				(item) => item.value === unref(emphasisTaskActive)
			)?.count || 0

		if (unref(emphasisTaskList).length >= total) {
			scrollNoMore.value = true
		} else {
			page.value++
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		scrollLoading.value = false
	}
}
/**
 * 获取筛选任务状态
 */
const getPriorityData = (val, field) => {
	return priorityOptions.value.find((item) => item.value === val)?.[field]
}
/**
 * 监听任务关注状态
 */
const changeTaskStutas = (val) => {
	emphasisTaskActive.value = val
	handleEmphasisTaskData()
	getProjectEmphasisListData()
}
/**
 * 监听滚动
 */
const handleScroll = () => {
	if (!scrollRef.value) return

	const wrap = scrollRef.value.$el?.querySelector('.el-scrollbar__wrap')
	if (!wrap) return

	if (scrollLoading.value) return

	const threshold = 5
	if (wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - threshold) {
		getProjectEmphasisListData()
	}
}

/**
 * 处理重点关注任务数据
 */
const handleEmphasisTaskData = () => {
	page.value = 1
	emphasisTaskList.value = []
	scrollNoMore.value = false
}

/********** 项目进展 ************/
// 项目进展 加载状态
const progressLoading = ref(false)
// 是否展示图表
const progressVisibleChart = ref(false)
// 项目进展列表
const progressList = ref([])
// 项目进展图例
const progressLegend = {
	taskTotal: '任务总数',
	taskUnDone: '未完成任务数',
}
// 数据集-进展
const progressDataSet = ref({
	dimensions: [],
	source: [],
})
/** 图表配置-进展 */
const progressChartConfig = computed(() => {
	const legendData = Object.values(cloneDeep({ ...progressLegend }))
	const config = setProgressChartConfig(legendData, unref(progressDataSet))
	config.tooltip = {
		trigger: 'item',
	}

	config.tooltipFormatter = (params) => {
		let res = params.name
		const { taskTotal, taskUnDone } = params.value
		const ratio = divide(taskUnDone, taskTotal) // part / total
		const percent = multiply(ratio, 100) // ratio * 100
		const unDoneRate = round(percent, 2) + '%' // 保留两位小数
		res += `
			<br/>
			<div style="display: flex;align-items: center;">
				<div style="width:10px;height:10px;background-color:#7aade1;border-radius:50%;"></div>
				<div style="margin-left:5px;">任务总数</div>
				<div style="margin-left:5px;">${taskTotal}</div>
			</div>
			<div style="display: flex;align-items: center;">
				<div style="width:10px;height:10px;background-color:#89c756;border-radius:50%;"></div>
				<div style="margin-left:5px;">未完成</div>
				<div style="margin-left:5px;">${taskUnDone} 占比 ${unDoneRate}</div>
			</div>
		`
		return res
	}

	return config
})
/**
 * 图表配置-项目进展
 */
const setProgressChartConfig = (legendData, dataset) => {
	// 展示数据
	const series = () => {
		const data = legendData.map((v, index) => {
			const itemObj = {
				type: 'bar',
				smooth: true,
				name: v,
				lineStyle: {
					normal: {
						width: 2,
					},
				},
				itemStyle: {
					color: '#89c756',
				},
				barMaxWidth: 60,
				z: index + 1, // 层级
			}
			if (index === 0) {
				// itemObj.barGap = '-100%'
				itemObj.itemStyle = {
					color: '#7aade1',
				}
			}

			return itemObj
		})

		return data
	}

	return {
		legendData,
		dataset,
		series,
	}
}
/**
 * 获取项目进展数据
 */
const getProjectProgressData = async () => {
	try {
		progressLoading.value = true
		const params = {
			teamId: unref($teamId),
		}
		if (unref(projectId)) {
			params.projectId = unref(projectId)
		}
		const { data: res } = await getProjectTaskStatsApi(params)
		console.log(res)
		if (res && res.length > 0) {
			nextTick(() => {
				progressList.value = res
				makeUpEchartData('progress')
			})
			progressVisibleChart.value = false
		} else {
			progressVisibleChart.value = true
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		progressLoading.value = false
	}
}

/********** 逾期任务分布 ************/
// 逾期分布 加载状态
const overdueLoading = ref(false)
// 是否展示图表
const overdueVisibleChart = ref(false)
// 逾期分布列表
const overdueList = ref([])
// 逾期分布图例
const overdueLegend = {
	overdueUnfinishedCount: '逾期任务',
}
// 数据集-逾期分布
const overdueDataSet = ref({
	dimensions: [],
	source: [],
})
/** 图表配置-逾期 */
const overdueChartConfig = computed(() => {
	const config = setOverdueChartConfig([], unref(overdueDataSet))
	config.tooltip = {
		trigger: 'item',
	}
	return config
})
/**
 * 图表配置-逾期分布
 */
const setOverdueChartConfig = (legendData, dataset) => {
	// 展示数据
	const series = () => {
		const itemObj = {
			name: '逾期任务',
			type: 'pie',
			radius: '50%',
			roseType: 'area',
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
			encode: {
				value: 'overdueUnfinishedCount', // 数值字段
				itemName: 'title', // 名称字段（用于 tooltip 和 label）
			},
		}
		return [itemObj]
	}

	return {
		dataset,
		series,
	}
}
/**
 * 获取项目逾期分布数据
 */
const getProjectOverdueData = async () => {
	try {
		overdueLoading.value = true
		const params = {
			teamId: unref($teamId),
		}
		if (unref(projectId)) {
			params.projectId = unref(projectId)
		}
		const { data: res } = await getOverdueUnfinishedTasksApi(params)

		if (res && res.length > 0) {
			nextTick(() => {
				overdueList.value = res || []
				makeUpEchartData('overdue')
			})
			overdueVisibleChart.value = false
		} else {
			overdueVisibleChart.value = true
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		overdueLoading.value = false
	}
}

/********** 其它 ************/

// 项目筛选
const projectId = ref('')

// 项目筛选列表
const projectList = computed(() => {
	return [{ projectName: '所有项目', projectId: '' }, ...unref($projectList)]
})

// 筛选项目 name
const selectLabel = computed(() => {
	return projectList.value.find((item) => item.projectId === unref(projectId))
		?.projectName
})

/**
 * 监听项目
 */
const changeProject = (val) => {
	init()
}

/**
 * 组成 echart 图表数据
 */
const makeUpEchartData = (type) => {
	let datasetData =
		type === 'overdue' ? unref(overdueDataSet) : unref(progressDataSet)
	const chartDataList =
		type === 'overdue' ? unref(overdueList) : unref(progressList)
	const typeList = type === 'overdue' ? overdueLegend : progressLegend

	datasetData = { dimensions: ['title'], source: [] }

	Object.keys(typeList).forEach((key) => {
		datasetData.dimensions.push(key)
	})

	chartDataList.forEach((item) => {
		const newItem = cloneDeep(item)
		const dataObj = {
			title:
				type === 'overdue'
					? item.userName
					: unref(projectId) === ''
						? item.projectName
						: item.userName,
		}

		Object.keys(newItem).forEach((key) => {
			if (typeList[key]) {
				dataObj[key] = parseFloat(newItem[key]) || 0
			}

			if (newItem[key] === null) {
				newItem[key] = undefined
			}
		})

		datasetData.source.push(dataObj)
	})

	if (type === 'overdue') {
		overdueDataSet.value = datasetData
	} else {
		progressDataSet.value = datasetData
	}
}

/**
 * 初始化
 */
const init = async () => {
	// 获取项目任务数据
	getProjectTotalData()
	// 获取进展
	getProjectProgressData()
	// 获取逾期分布
	getProjectOverdueData()
	// 获取项目重点关注数据
	await getProjectEmphasisData()
	handleEmphasisTaskData()
	getProjectEmphasisListData()
}

init()
</script>

<style lang="scss" scoped>
.task-item {
	margin-bottom: 12px;

	&:nth-last-child(-n + 3) {
		margin-bottom: 0px;
	}
}
</style>
