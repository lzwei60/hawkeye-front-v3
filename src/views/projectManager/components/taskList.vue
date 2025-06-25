<template>
	<div class="task-list">
		<div class="query-form flex items-start justify-between">
			<div class="query-form-left flex-1">
				<el-form :inline="true" label-width="90px" :model="formModel">
					<el-form-item label="任务名称">
						<el-input
							v-model="formModel.taskName"
							style="width: 220px"
							placeholder="请输入" />
					</el-form-item>
					<el-form-item label="负责人">
						<el-select
							v-model="formModel.principal"
							style="width: 220px"
							placeholder="请选择">
							<el-option
								v-for="item in projectMember"
								:key="item.userId"
								:label="item.userName"
								:value="item.userId" />
						</el-select>
					</el-form-item>
					<el-form-item label="任务状态">
						<el-select
							v-model="formModel.taskStatus"
							style="width: 220px"
							placeholder="请选择">
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
							style="width: 220px"
							placeholder="请选择">
							<el-option
								v-for="item in projectMember"
								:key="item.value"
								:label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="截止时间">
						<el-date-picker
							v-model="formModel.deadline"
							style="width: 220px"
							type="daterange"
							range-separator="-"
							value-format="YYYY-MM-DD"
							start-placeholder="开始时间"
							end-placeholder="结束时间" />
					</el-form-item>
					<el-form-item label="完成时间">
						<el-date-picker
							v-model="formModel.finishTime"
							style="width: 220px"
							type="daterange"
							range-separator="-"
							value-format="YYYY-MM-DD"
							start-placeholder="开始时间"
							end-placeholder="结束时间" />
					</el-form-item>
				</el-form>
			</div>

			<div class="query-form-right">
				<el-button @click="resetFilter">重置</el-button>
				<el-button type="primary" @click="queryFilter">搜索</el-button>
			</div>
		</div>

		<div class="btns-group mb-[18px]">
			<el-button type="primary" @click="addTask">添加任务</el-button>
		</div>

		<div class="table-container">
			<el-table
				v-loading="loading"
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
									@blur="saveEdit($index, item.prop)"
									@keydown.esc="cancleEdit($index, item.prop)"
									@keydown.enter="saveEdit($index, item.prop)" />
							</template>

							<template v-else>
								<div v-if="item.prop === 'taskName'" class="flex items-center">
									<el-checkbox
										:checked="row.taskStatus === 1"
										@change="(val) => changeTaskStatus(val, row)" />
									<div
										class="ml-[6px]"
										:class="{ 'line-through': row.taskStatus === 1 }">
										{{ row[item.prop] }}
									</div>
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
												@click="changeValue($index, item.prop, list.value)">
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

								<div v-else-if="item.prop === 'deadline'">
									<el-tag
										v-if="row.deadline"
										class="cursor-pointer"
										effect="dark"
										type="info"
										round
										disable-transitions
										:color="getDeadLineColor(row.deadline)">
										{{ row[item.prop] }}
									</el-tag>

									<div v-else class="text-[#999999] cursor-pointer">
										设置截止时间
									</div>

									<div class="absolute left-0 top-[-3px] z-[9] opacity-0">
										<el-date-picker
											v-model="row[item.prop]"
											type="date"
											value-format="YYYY-MM-DD" />
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
												<div v-if="row.principal === '-1'">
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
														)?.headImg || ''
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
													@click="changeValue($index, item.prop, list.userId)">
													<div class="flex items-center cursor-pointer">
														<div class="mt-[5px] mr-[15px]">
															<div v-if="list.userId === '-1'">
																<Icon-ep-userFilled
																	class="text-[#999999] text-[20px]" />
															</div>

															<el-avatar
																v-else
																:src="
																	findObjectLabel(
																		list.userName,
																		'userId',
																		projectMember
																	)?.headImg || ''
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
import { useTask } from '@/hooks'

const { priorityOptions, initTableData, isExpired } = useTask()

const DEFAULT_FORMMODEL = {
	taskName: '',
	principal: '',
	taskStatus: '',
	priority: '',
	deadline: [],
	finishTime: [],
}

const taskStatusOptions = ref([
	{ value: 0, label: '未开始' },
	{ value: 1, label: '已完成' },
	{ value: 2, label: '已延期' },
])

const projectMember = ref([
	{ userId: '-1', userName: '无负责人', headImg: '' },
	{ userId: 'liaozhiwei', userName: '廖志伟', headImg: '' },
])

const formModel = ref(cloneDeep(DEFAULT_FORMMODEL))

const loading = ref(false)

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
		prop: 'deadline',
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

const tableData = ref([])

/**
 * 获取任务列表
 */
const getTaskList = () => {
	try {
		loading.value = true
		// TODO: 请求任务列表
		tableData.value = cloneDeep(initTableData.value)
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
const getDeadLineColor = (deadline) => {
	if (isExpired(deadline, 'date')) {
		return '#df3c2f'
	} else {
		return '#999999'
	}
}

/**
 * 查询
 */
const queryFilter = () => {
	// 深拷贝初始数据
	let filteredData = cloneDeep(unref(initTableData))

	// 获取表单数据
	const { taskName, principal, taskStatus, priority, deadline, finishTime } =
		formModel.value

	// 过滤数据的函数
	const filterData = (data) => {
		return data.filter((item) => {
			// 任务名称筛选
			if (taskName && !item.taskName.includes(taskName)) {
				return false
			}

			// 负责人筛选
			if (principal && item.principal !== principal) {
				return false
			}

			// 任务状态筛选
			if (taskStatus !== '' && item.taskStatus !== taskStatus) {
				return false
			}

			// 优先级筛选
			if (priority !== '' && item.priority !== priority) {
				return false
			}

			// 截止时间筛选
			if (deadline && deadline.length === 2) {
				const [startDate, endDate] = deadline
				if (item.deadline < startDate || item.deadline > endDate) {
					return false
				}
			}

			// 完成时间筛选
			if (finishTime && finishTime.length === 2) {
				const [startDate, endDate] = finishTime
				if (item.finishTime < startDate || item.finishTime > endDate) {
					return false
				}
			}

			// 如果有子任务，递归过滤
			if (item.children && item.children.length) {
				item.children = filterData(item.children)
			}

			return true
		})
	}

	// 执行过滤
	tableData.value = filterData(filteredData)
}

/**
 * 重置
 */
const resetFilter = () => {
	formModel.value = cloneDeep(DEFAULT_FORMMODEL)
	tableData.value = cloneDeep(unref(initTableData))
}

const inputRef = ref()

/**
 * 新增任务
 */
const addTask = () => {
	tableData.value.push({
		taskId: null,
		projectId: 1,
		taskName: '',
		priority: 2,
		deadline: '',
		principal: '-1',
		creator: 'liaozhiwei',
		finishTime: '',
		createTime: '',
		taskStatus: 0,
		children: [],
	})

	editCell(unref(tableData).length, 'taskName')
}

const editingCell = ref({ row: null, colProp: null }) // 当前正在编辑的单元格
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
const saveEdit = (rowIndex, colProp) => {
	tableData.value[rowIndex - 1][colProp] = editValue.value
	cancleEdit(rowIndex, colProp)
}

/**
 * 退出编辑
 */
const cancleEdit = (rowIndex, colProp) => {
	if (isEmpty(tableData.value[rowIndex - 1][colProp])) {
		tableData.value.splice(rowIndex - 1, 1)
	}
	editingCell.value = { row: null, colProp: null }
}

/**
 * 是否完成任务
 */
const changeTaskStatus = (checked, row) => {
	row.taskStatus = checked ? 1 : 0
}

const popoverAllRef = ref({})

const popoverRef = (index, prop, e) => {
	popoverAllRef.value[prop] = popoverAllRef.value[prop] || {}
	popoverAllRef.value[prop][index] = e
}

/**
 * 修改数据
 */
const changeValue = (rowIndex, prop, value) => {
	if (!tableData.value[rowIndex]) return
	tableData.value[rowIndex][prop] = value
	popoverAllRef.value[prop] && popoverAllRef.value[prop][rowIndex].hide()
}

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
