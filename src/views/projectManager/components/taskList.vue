<template>
	<div class="task-list overflow-hidden overflow-y-auto h-[calc(100vh-230px)]">
		<div class="query-form flex items-start justify-between">
			<div class="query-form-left flex-1">
				<el-form :inline="true" label-width="90px" :model="formModel">
					<el-form-item label="任务名称">
						<el-input
							v-model="formModel.taskName"
							clearable
							style="width: 200px"
							placeholder="请输入"
							@change="searchFilter" />
					</el-form-item>
					<el-form-item label="负责人">
						<el-select
							v-model="formModel.principal"
							style="width: 200px"
							clearable
							placeholder="请选择"
							@change="searchFilter">
							<el-option
								v-for="item in paramsProjectMember"
								:key="item.userId"
								:label="item.userName"
								:value="item.userId" />
						</el-select>
					</el-form-item>
					<el-form-item label="任务状态">
						<el-select
							v-model="formModel.completionStatus"
							clearable
							style="width: 200px"
							placeholder="请选择"
							@change="searchFilter">
							<el-option
								v-for="item in taskStatusOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="优先级">
						<el-select
							v-model="formModel.priority"
							clearable
							style="width: 200px"
							placeholder="请选择"
							@change="searchFilter">
							<el-option
								v-for="item in priorityOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="截止时间">
						<el-date-picker
							v-model="formModel.deadlineTime"
							clearable
							style="width: 200px"
							type="daterange"
							range-separator="-"
							value-format="YYYY-MM-DD"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							@change="searchFilter" />
					</el-form-item>
					<el-form-item label="完成时间">
						<el-date-picker
							v-model="formModel.finishTime"
							clearable
							style="width: 200px"
							type="daterange"
							range-separator="-"
							value-format="YYYY-MM-DD"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							@change="searchFilter" />
					</el-form-item>
				</el-form>
			</div>

			<div class="query-form-right">
				<el-button @click="resetFilter">重置</el-button>
				<el-button type="primary" @click="searchFilter">搜索</el-button>
			</div>
		</div>

		<div class="btns-group mb-[18px]">
			<el-button type="primary" @click="addTask()">添加任务</el-button>
		</div>

		<div
			class="table-container"
			v-infinite-scroll="queryLoad"
			infinite-scroll-disabled="scrollDisabled">
			<el-table
				v-loading="loading"
				ref="taskTableRef"
				:data="tableData"
				style="width: 100%"
				border
				row-key="taskId">
				<el-table-column
					v-for="item in tableItem"
					:key="item.prop"
					:width="item.width"
					:min-width="item.minWidth"
					:label="item.label"
					:align="item.align"
					:fixed="item.fixed"
					:className="item.prop === 'taskName' ? 'task-name' : ''">
					<template #default="{ row, $index }">
						<div class="w-[100%]" @click="editCell($index, item.prop)">
							<template
								v-if="isEditing($index, item.prop, item.visibleEdit, row)">
								<el-input
									v-if="item.type === 'input'"
									ref="inputRef"
									v-model="editValue"
									placeholder="输入标题，回车创建，ESC取消"
									@blur="saveEdit($index, item.prop, row)"
									@keydown.esc="cancleEdit($index, item.prop)"
									@keydown.enter="saveEdit($index, item.prop, row)" />
							</template>

							<template v-else>
								<div
									v-if="item.prop === 'taskName'"
									class="flex items-center justify-between">
									<div class="flex items-center">
										<el-checkbox
											:checked="row.completionStatus === 1"
											@change="(val) => changeTaskStatus($index, val, row)" />
										<div
											class="ml-[6px]"
											:class="{ 'line-through': row.completionStatus === 1 }">
											{{ row[item.prop] }}
										</div>
									</div>

									<el-popover
										ref="taskAllPopoverRef"
										popper-class="task-list-popover"
										placement="bottom"
										width="110"
										trigger="click">
										<div>
											<div
												v-if="row.parentTaskId === '0'"
												class="p-[5px] cursor-pointer hover:bg-[#f5f5f5]"
												@mousedown.prevent="addTask(row.taskId, $index, row)">
												添加子任务
											</div>
											<div
												class="p-[5px] cursor-pointer text-[red] hover:bg-[#f5f5f5]"
												@mousedown.prevent="deleteTask(row.taskId, row)">
												删除
											</div>
										</div>

										<template #reference>
											<Icon-ep-more-filled />
										</template>
									</el-popover>
								</div>

								<div v-else-if="item.prop === 'priority'">
									<el-popover
										:ref="(e) => popoverRef($index, item.prop, e)"
										placement="bottom"
										transition=""
										:width="200"
										trigger="click">
										<template #reference>
											<el-tag
												class="cursor-pointer"
												effect="dark"
												type="info"
												disable-transitions
												:color="
													findObjectLabel(
														row.priority,
														'value',
														priorityOptions
													)?.color || ''
												">
												{{
													findObjectLabel(
														row.priority,
														'value',
														priorityOptions
													)?.label || ''
												}}
											</el-tag>
										</template>

										<div v-if="item.prop === 'priority'" class="list">
											<div
												class="item flex items-center justify-between cursor-pointer pt-[10px] pb-[10px] pl-[5px] pr-[5px] hover:bg-[#f5f5f5]"
												v-for="list in priorityOptions"
												:key="list.value"
												@click="
													changeValue(
														$index,
														item.prop,
														list.value,
														row,
														'priority'
													)
												">
												<div class="flex items-center">
													<div
														class="w-[20px] h-[20px] rounded mr-[15px]"
														:style="{ backgroundColor: list.color }"></div>

													<div class="">{{ list.label }}</div>
												</div>

												<div
													v-if="row.priority === list.value"
													class="before:content-['✔'] before:text-[#51b52f]"></div>
											</div>
										</div>
									</el-popover>
								</div>

								<div v-else-if="item.prop === 'deadlineTime'">
									<el-tag
										v-if="row.deadlineTime"
										class="cursor-pointer"
										effect="dark"
										type="info"
										round
										disable-transitions
										:color="getDeadLineColor(row.deadlineTime, row.finishTime)">
										{{ row[item.prop] }}
									</el-tag>

									<div v-else class="text-[#999999] cursor-pointer">
										设置截止时间
									</div>

									<div class="absolute left-0 top-[-3px] z-[9] opacity-0">
										<el-date-picker
											v-model="row[item.prop]"
											type="date"
											value-format="YYYY-MM-DD"
											@change="
												(val) =>
													changeValue(
														$index,
														item.prop,
														val,
														row,
														'deadlineTime'
													)
											" />
									</div>
								</div>

								<div v-else-if="item.prop === 'principal'">
									<el-popover
										:ref="(e) => popoverRef($index, item.prop, e)"
										placement="bottom"
										:width="260"
										trigger="click">
										<template #reference>
											<div
												class="flex items-center justify-center cursor-pointer">
												<div v-if="row.principal === ''">
													<Icon-ep-userFilled
														class="text-[#999999] text-[20px]" />
												</div>

												<el-avatar
													v-else
													:src="
														findObjectLabel(
															row.principal,
															'userId',
															projectMember
														)?.userHead || ''
													"
													size="small" />
												<span class="ml-[6px]">
													{{
														findObjectLabel(
															row.principal,
															'userId',
															projectMember
														)?.userName || ''
													}}
												</span>
											</div>
										</template>

										<div class="search">
											<div
												class="top flex items-center p-[10px] pt-[0px] border-b">
												<Icon-ep-search
													class="text-[#999999] text-[14px] mr-2.5" />

												<el-input
													class="flex-1"
													v-model="input"
													placeholder="输入搜索" />
											</div>

											<div class="list">
												<div
													v-for="list in projectMember"
													:key="list.userId"
													class="flex items-center justify-between p-[5px] hover:bg-[#f5f5f5]"
													@click="
														changeValue(
															$index,
															item.prop,
															list.userId,
															row,
															'principal'
														)
													">
													<div class="flex items-center cursor-pointer">
														<div class="mt-[5px] mr-[15px]">
															<div v-if="list.userId === ''">
																<Icon-ep-userFilled
																	class="text-[#999999] text-[20px]" />
															</div>

															<el-avatar
																v-else
																:src="
																	findObjectLabel(
																		list.userId,
																		'userId',
																		projectMember
																	)?.userHead || ''
																"
																size="small" />
														</div>
														<div class="">{{ list.userName }}</div>
													</div>

													<div
														v-if="row.principal === list.userId"
														class="before:content-['✔'] before:text-[#51b52f]"></div>
												</div>
											</div>
										</div>
									</el-popover>
								</div>

								<div v-else-if="item.prop === 'creator'">
									<span class="ml-[6px]">
										{{
											findObjectLabel(row.creator, 'userId', projectMember)
												?.userName || ''
										}}
									</span>
								</div>

								<div v-else-if="item.prop === 'consummator'">
									<span class="ml-[6px]">
										{{
											findObjectLabel(
												row.consummator,
												'userId',
												$teamAllUserList
											)?.userName || ''
										}}
									</span>
								</div>

								<div v-else>{{ row[item.prop] }}</div>
							</template>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup name="TaskList">
import { isEmpty, cloneDeep } from 'lodash-es'
import {
	getTaskListApi,
	createTaskApi,
	updateTaskApi,
	deleteTaskApi,
} from '@/api/modules/task.js'
import { isVoid } from '@/utils/validate'
import { useTask, useAuth } from '@/hooks'

const { $userId, $teamId, $projectId, $teamAllUserList } = useAuth()

const { priorityOptions, isExpired } = useTask()

const props = defineProps({
	projectMemberList: {
		type: Array,
		default: () => [],
	},
})

const DEFAULT_FORMMODEL = {
	page: 1,
	limit: 10,
	taskName: '',
	principal: '',
	completionStatus: '',
	priority: '',
	deadlineTime: [],
	finishTime: [],
}

const taskStatusOptions = ref([
	{ value: 0, label: '未开始' },
	{ value: 1, label: '已完成' },
	{ value: 2, label: '已延期' },
])

// 表格选择项目人员列表
const projectMember = ref([{ userId: '', userName: '无负责人', userHead: '' }])

// 筛选项选择项目人员列表
const paramsProjectMember = computed(() => {
	const list = cloneDeep(unref($teamAllUserList))
	list.unshift({ userId: '-1', userName: '无负责人', userHead: '' })
	return list
})

// 筛选项
const formModel = ref(cloneDeep(DEFAULT_FORMMODEL))

// 加载状态
const loading = ref(false)

// 是否需要禁用滚动加载
const scrollDisabled = computed(() => {
	return loading.value || tableData.value.length >= tableTotal.value
})

// 表格配置项
const tableItem = ref([
	{
		prop: 'taskName',
		label: '任务标题',
		type: 'input',
		width: '',
		minWidth: '400',
		fixed: true,
		visibleEdit: true,
	},
	{
		prop: 'priority',
		label: '优先级',
		type: 'select',
		width: '120',
		align: 'center',
		options: unref(taskStatusOptions),
	},
	{
		prop: 'deadlineTime',
		label: '截止时间',
		align: 'center',
		type: 'date',
		width: '150',
	},
	{
		prop: 'principal',
		label: '负责人',
		type: 'select',
		width: '160',
		align: 'center',
		options: unref(projectMember),
	},
	{
		prop: 'creator',
		label: '创建人',
		type: 'input',
		align: 'center',
		width: '120',
	},
	{
		prop: 'consummator',
		label: '完成人',
		type: 'input',
		align: 'center',
		width: '120',
	},
	{
		prop: 'finishTime',
		label: '完成时间',
		type: 'date',
		align: 'center',
		width: '200',
	},
	{
		prop: 'createTime',
		label: '创建时间',
		type: 'date',
		align: 'center',
		width: '200',
	},
])

// 任务列表数据
const tableData = ref([])

// 任务列表总数
const tableTotal = ref(0)

const taskTableRef = ref()

/**
 * 滚动加载
 */
const queryLoad = () => {
	formModel.value.page += 1
	getTaskList()
}

/**
 * 搜索筛选项
 */
const searchFilter = () => {
	formModel.value.page = 1
	formModel.value.limit = 10
	getTaskList()
}

/**
 * 重置筛选项
 */
const resetFilter = () => {
	formModel.value = cloneDeep(DEFAULT_FORMMODEL)
	getTaskList()
}

/**
 * 获取任务列表
 */
const getTaskList = async () => {
	try {
		loading.value = true
		const params = cloneDeep(unref(formModel))
		params.projectId = unref($projectId)
		const { data: res } = await getTaskListApi(params)
		tableData.value = res.list || []
		tableTotal.value = res.total || 0
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 获取对象label
 */
const findObjectLabel = (id, key, options) => {
	const item = options.find((item) => item[key] === id)
	return item
}

/**
 * 根据截止时间判断颜色
 */
const getDeadLineColor = (deadlineTime, finishTime) => {
	if (isExpired(deadlineTime, finishTime, 'date')) {
		return '#df3c2f'
	}
	return '#999999'
}

const inputRef = ref()

/**
 * 新增任务
 */
const addTask = (pId, index, row) => {
	const newTask = {
		taskId: null,
		taskName: '',
		projectId: unref($projectId),
		teamId: unref($teamId),
		priority: 2,
		deadlineTime: '',
		principal: '',
	}
	let rowIndex = (isVoid(index) ? -1 : index) + 1
	if (pId) {
		const findIndex = tableData.value.findIndex((item) => item.taskId === pId)
		const findData = tableData.value[findIndex]
		findData.children = findData.children || []
		newTask.parentTaskId = pId
		findData.children.unshift(newTask)
		nextTick(() => {
			unref(taskTableRef) && unref(taskTableRef).toggleRowExpansion(row, true)
		})
	} else {
		tableData.value.splice(rowIndex, 0, newTask)
	}
	editCell(rowIndex, 'taskName')
	cancleTaskListPopover(index)
}

// 当前正在编辑的单元格
const editingCell = ref({ row: null, colProp: null })

// 当前正在编辑的单元格的输入内容
const editValue = ref('')

/**
 * 是否编辑单元格
 */
const isEditing = (rowIndex, colProp, visibleEdit, row) => {
	return (
		editingCell.value.row === rowIndex &&
		editingCell.value.colProp === colProp &&
		visibleEdit &&
		isEmpty(row[colProp])
	)
}

/**
 * 编辑单元格
 */
const editCell = (rowIndex, colProp) => {
	editValue.value = ''
	editingCell.value = { row: rowIndex, colProp }
	// 可选：自动聚焦
	nextTick(() => {
		const inputEl = inputRef.value
		inputEl && inputEl[0] && inputEl[0]?.focus()
	})
}

/**
 * 保存编辑
 */
const saveEdit = async (rowIndex, colProp, row) => {
	row[colProp] = editValue.value
	const newTask = row

	try {
		if (isVoid(newTask.taskName)) {
			if (row.parentTaskId) {
				const findIndex = tableData.value.findIndex(
					(item) => item.taskId === row.parentTaskId
				)
				if (findIndex > -1) {
					const childFindIndex = tableData.value[findIndex].children.findIndex(
						(item) => isVoid(item.taskName)
					)
					if (childFindIndex > -1) {
						tableData.value[findIndex].children.splice(childFindIndex, 1)
					}
				}
			} else {
				tableData.value.splice(rowIndex, 1)
			}
			return
		}
		await confirmTask(rowIndex, newTask)
	} catch (err) {
		if (!newTask.taskId) {
			tableData.value.splice(rowIndex, 1)
		}
		return Promise.reject(err)
	}
	cancleEdit(rowIndex, colProp)
}

/**
 * 退出编辑
 */
const cancleEdit = (rowIndex, colProp) => {
	editingCell.value = { row: null, colProp: null }
}

/**
 * 新增任务
 */
const confirmTask = async (rowIndex, newTask) => {
	try {
		const { data: res } = await createTaskApi(newTask)
		const { taskId, parentTaskId } = res
		const index = 0
		succeedUpdateTaskData(res, index, 'add')
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 更新任务
 */
const updateTask = async (rowIndex, newTask, type) => {
	try {
		const params = {
			...newTask,
			type,
		}
		const { data: res } = await updateTaskApi(params)
		succeedUpdateTaskData(res, rowIndex, 'update')
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 成功新建 || 更新 任务
 */
const succeedUpdateTaskData = (res, rowIndex, type) => {
	if (res.parentTaskId === '0') {
		const children = cloneDeep(tableData.value[rowIndex].children)
		tableData.value[rowIndex] = res
		tableData.value[rowIndex].children = children
	} else {
		const findIndex = tableData.value.findIndex(
			(item) => item.taskId === res.parentTaskId
		)
		if (findIndex > -1) {
			if (rowIndex > -1) {
				tableData.value[findIndex].children[rowIndex] = res
			}
		}
	}
}

/**
 * 是否完成任务
 */
const changeTaskStatus = async (rowIndex, checked, row) => {
	let { newTask, index, pIndex } = getCurrentOperatorData(row)
	if (row.parentTaskId === '0') {
		newTask = tableData.value[index]
	} else {
		newTask = tableData.value[pIndex].children[index]
	}
	try {
		newTask.completionStatus = checked ? 1 : 0
		newTask.consummator = checked ? unref($userId) : ''
		const type = checked ? 'finish' : 'unfinish'
		await updateTask(index, newTask, type)
	} catch (err) {
		newTask.completionStatus = !checked ? 1 : 0
		newTask.consummator = !checked ? unref($userId) : ''
		return Promise.reject(err)
	}
}

/**
 * 修改数据
 */
const changeValue = async (rowIndex, prop, value, row, type) => {
	const { newTask, index } = getCurrentOperatorData(row)
	const initValue = cloneDeep(newTask[prop])
	try {
		newTask[prop] = value
		popoverAllRef.value[prop] && popoverAllRef.value[prop][rowIndex].hide()
		await updateTask(index, newTask, type)
	} catch (err) {
		newTask[prop] = initValue
		return Promise.reject(err)
	}
}

/**
 * 当前操作任务
 */
const getCurrentOperatorData = (row) => {
	let newTask = {}
	let pIndex = 0
	let index = 0
	if (row.parentTaskId === '0') {
		index = tableData.value.findIndex((item) => item.taskId === row.taskId)
		newTask = tableData.value[index]
	} else {
		pIndex = tableData.value.findIndex(
			(item) => item.taskId === row.parentTaskId
		)
		const findData = tableData.value[pIndex]
		index = findData.children.findIndex((item) => item.taskId === row.taskId)
		newTask = findData.children[index]
	}

	return { newTask, index, pIndex }
}

/**
 * 操作弹出层tips
 */
const popoverAllRef = ref({})
const popoverRef = (index, prop, e) => {
	popoverAllRef.value[prop] = popoverAllRef.value[prop] || {}
	popoverAllRef.value[prop][index] = e
}

const taskAllPopoverRef = ref()

/**
 * 删除任务
 */
const deleteTask = async (taskId, row) => {
	try {
		const { data: res } = await deleteTaskApi({ taskId })
		ElMessage.success('删除成功')
		const findIndex = tableData.value.findIndex(
			(item) =>
				item.taskId === (row.parentTaskId === '0' ? taskId : row.parentTaskId)
		)

		if (row.parentTaskId === '0') {
			tableData.value.splice(findIndex, 1)
		} else {
			const childFindIndex = tableData.value[findIndex].children.findIndex(
				(item) => item.taskId === taskId
			)
			if (childFindIndex > -1) {
				tableData.value[findIndex].children.splice(childFindIndex, 1)
			}
		}
	} catch (err) {
		return Promise.reject(err)
	}
	cancleTaskListPopover(index)
}

/**
 * 关闭操作列表弹窗
 */
const cancleTaskListPopover = (index) => {
	index &&
		unref(taskAllPopoverRef)[index] &&
		unref(taskAllPopoverRef)[index].hide()
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
 * 初始化
 */
const init = async () => {
	await getTaskList()
}

onMounted(() => {
	init()
})
</script>

<style lang="scss" scoped>
.task-list {
	:deep .table-container {
		.el-input__wrapper {
			box-shadow: none;
			padding: 1px 0px;
		}

		.el-tag--info {
			border: unset;
		}

		.el-date-editor {
			width: 100%;
		}

		.task-name {
			.cell {
				display: flex;
				align-items: center;
			}
		}
	}
}
</style>

<style lang="scss">
.task-list-popover {
	min-width: 110px !important;
}
</style>
