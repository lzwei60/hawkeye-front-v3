<template>
	<div class="flex items-center justify-between">
		<el-checkbox
			:checked="task.completionStatus === 1"
			@change="(val) => changeTaskStatus(val)">
			<div class="flex items-center">
				<span>{{ task.taskName }}</span>
			</div>
		</el-checkbox>

		<div class="flex items-center w-[300px] justify-end">
			<div class="relative">
				<el-tag
					v-if="task.deadlineTime"
					class="cursor-pointer"
					effect="dark"
					type="info"
					round
					disable-transitions
					:color="getDeadLineColor(task.deadlineTime)">
					{{ task.deadlineTime }}
				</el-tag>

				<div v-else class="text-[#999999] cursor-pointer">设置截止时间</div>

				<div class="absolute left-0 top-[-3px] z-[9] opacity-0 w-[78px]">
					<el-date-picker
						v-model="task.deadlineTime"
						type="date"
						value-format="YYYY-MM-DD"
						@change="changeDeadLineTime" />
				</div>
			</div>

			<div class="ml-[20px]">
				<el-popover
					ref="popoverRef"
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
								findObjectLabel(task.priority, 'value', priorityOptions)
									?.color || ''
							">
							{{
								findObjectLabel(task.priority, 'value', priorityOptions)
									?.label || ''
							}}
						</el-tag>
					</template>

					<div class="list">
						<div
							class="item flex items-center justify-between cursor-pointer pt-[10px] pb-[10px] pl-[5px] pr-[5px] hover:bg-[#f5f5f5]"
							v-for="list in priorityOptions"
							:key="list.value"
							@click="changeValue('priority', list.value)">
							<div class="flex items-center">
								<div
									class="w-[20px] h-[20px] rounded mr-[15px]"
									:style="{ backgroundColor: list.color }"></div>

								<div class="">{{ list.label }}</div>
							</div>

							<div
								v-if="task.priority === list.value"
								class="before:content-['✔'] before:text-[#51b52f]"></div>
						</div>
					</div>
				</el-popover>
			</div>

			<div class="ml-[20px]">
				<PopoverSelect
					ref="popoverUserRef"
					v-model="task.principal"
					value-key="userId"
					label-key="userName"
					:options="teamMemberList">
					<template #reference>
						<div class="flex items-center justify-center cursor-pointer">
							<div v-if="!task.principal">
								<Icon-ep-userFilled class="text-[#999999] text-[20px]" />
							</div>

							<el-avatar
								v-else
								:src="
									findObjectLabel(task.principal, 'userId', teamMemberList)
										?.userHead || ''
								"
								size="small" />

							<span class="ml-[6px] text-[14px]">
								{{
									findObjectLabel(task.principal, 'userId', teamMemberList)
										?.userName || ''
								}}
							</span>
						</div>
					</template>

					<template #item="{ item }">
						<div
							:key="item.userId"
							class="flex items-center justify-between p-[5px] hover:bg-[#f5f5f5]"
							@click="changeValue('principal', item.userId)">
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
								v-if="task.principal === item.userId"
								class="before:content-['✔'] before:text-[#51b52f]"></div>
						</div>
					</template>
				</PopoverSelect>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useTask, useAuth } from '@/hooks'
import { cloneDeep } from 'lodash-es'
import { updateTaskApi } from '@/api/modules/task.js'

const { $userId, $teamUserList } = useAuth()

const { isExpired, priorityOptions } = useTask()

defineOptions({
	name: 'OnceTask',
})

const emits = defineEmits(['update'])

const props = defineProps({
	task: {
		type: Object,
		default: () => ({}),
	},
})

// 团队成员
const teamMemberList = ref([
	{ userId: '', userName: '无负责人', userHead: '' },
	...unref($teamUserList),
])

const popoverRef = ref()
const popoverUserRef = ref()

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
 * 修改任务状态
 */
const changeTaskStatus = async (checked) => {
	try {
		const newTask = cloneDeep(props.task)
		newTask.completionStatus = checked ? 1 : 0
		newTask.consummator = checked ? unref($userId) : ''
		const type = checked ? 'finish' : 'unfinish'

		await updateTask(newTask, type)
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 修改截止时间
 */
const changeDeadLineTime = async (date) => {
	try {
		const newTask = cloneDeep(props.task)
		newTask.deadlineTime = date
		await updateTask(newTask, 'deadlineTime')
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 修改数据
 */
const changeValue = async (prop, value) => {
	try {
		const newTask = cloneDeep(props.task)
		newTask[prop] = value
		popoverRef.value && popoverRef.value.hide()
		popoverUserRef.value && popoverUserRef.value.hide()
		await updateTask(newTask, prop)
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 更新任务
 */
const updateTask = async (newTask, type) => {
	try {
		const params = {
			...newTask,
			type,
		}
		const { data: res } = await updateTaskApi(params)
		emits('update')
	} catch (err) {
		return Promise.reject(err)
	}
}
</script>

<style lang="scss" scoped>
:deep .el-date-editor {
	width: 100%;
}
</style>
