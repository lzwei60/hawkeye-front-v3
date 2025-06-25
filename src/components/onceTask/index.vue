<template>
	<div class="flex items-center justify-between">
		<el-checkbox v-model="visibleComplete" size="large">
			<div class="flex items-center">
				<span>主任务</span>

				<Icon-ep-operation class="ml-[10px] text-[#999999]" />

				<span class="ml-[10px] text-[#999999] font-[12px]">0/10</span>
			</div>
		</el-checkbox>

		<div class="flex items-center">
			<div class="relative">
				<el-tag
					v-if="task.deadline"
					class="cursor-pointer"
					effect="dark"
					type="info"
					round
					disable-transitions
					:color="getDeadLineColor(task.deadline)">
					5月10日
				</el-tag>

				<div v-else class="text-[#999999] cursor-pointer">设置截止时间</div>

				<div class="absolute left-0 top-[-3px] z-[9] opacity-0 w-[78px]">
					<el-date-picker
						v-model="task.deadline"
						type="date"
						value-format="YYYY-MM-DD" />
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
										?.headImg || ''
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
												?.headImg || ''
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
import { useTask, useTeam } from '@/hooks'

const { isExpired } = useTask()

const { initMemberList } = useTeam()

defineOptions({
	name: 'OnceTask',
})

const props = defineProps({
	task: {
		type: Object,
		default: () => ({}),
	},
})

const priorityOptions = ref([
	{ value: 0, label: '最高', color: '#df3c2f' },
	{ value: 1, label: '较高', color: '#f5941d' },
	{ value: 2, label: '普通', color: '#999999' },
	{ value: 3, label: '较低', color: '#51b52f' },
])

const visibleComplete = ref(false)

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
 * 修改数据
 */
const changeValue = (prop, value) => {
	props.task[prop] = value
	popoverRef.value && popoverRef.value.hide()
	popoverUserRef.value && popoverUserRef.value.hide()
}

// 团队成员
const teamMemberList = ref([
	{ userId: '', userName: '所有成员', headImg: '' },
	...unref(initMemberList),
])
</script>

<style lang="scss" scoped>
:deep .el-date-editor {
	width: 100%;
}
</style>
