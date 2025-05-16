<template>
	<div
		v-loading="pageLoading"
		class="flex items-center justify-between px-[18px] mb-[18px]">
		<div class="flex items-center">
			<div class="text-[20px] font-bold mr-[10px]">项目成员</div>

			<el-button
				v-if="!visibleAdd"
				size="small"
				class="mt-[4px]"
				@click="visibleAdd = true">
				管理成员
			</el-button>
		</div>

		<el-button
			v-if="!visibleAdd"
			size="small"
			type="danger"
			class="mt-[4px]"
			@click="exitProject">
			退出项目
		</el-button>
	</div>

	<div
		v-if="!visibleAdd"
		class="px-[18px] overflow-hidden overflow-y-auto h-[calc(100vh-300px)]">
		<div class="flex items-center flex-wrap">
			<div
				v-for="item in 10"
				:key="item"
				class="flex items-center mb-[18px] mr-[18px] cursor-pointer">
				<div class="w-[40px] h-[40px] rounded-full overflow-hidden mr-[5px]">
					<img
						src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
						alt="" />
				</div>

				<div>
					<div class="mb-[2px] text-[14px]">廖志伟</div>

					<div class="text-[#f5941d] text-[12px]">超级管理员</div>
				</div>
			</div>
		</div>

		<div class="text-[18px] font-bold mt-[18px]">成员变化记录</div>
		<!-- max-h-[150px] overflow-hidden overflow-y-auto -->
		<div class="my-[18px]">
			<div
				v-for="item in 5"
				:key="item"
				class="text-[12px] text-[#393939] mb-[8px]">
				<span>4月24日&nbsp;</span>

				<span>廖志伟&nbsp;</span>

				<span>邀请了&nbsp;</span>

				<span>张三&nbsp;</span>

				<span>加入项目</span>
			</div>
		</div>
	</div>

	<div v-else class="mt-[32px] px-[18px]">
		<div class="text-[18px] font-bold">选择项目成员</div>

		<div class="text-[12px] text-[#393939] mt-[8px]">
			管理员可以邀请和移除项目成员，只有被邀请的团队成员才能访问该项目的信息。
		</div>

		<el-tabs v-model="addTabsName" class="mt-[18px]">
			<el-tab-pane :label="`团队成员(${projectMember.length})`" name="team">
				<div class="h-[calc(100vh-500px)] overflow-hidden overflow-y-auto">
					<div class="flex items-center mb-[18px]">
						<el-select
							v-model="selectUser"
							placeholder="点击添加成员"
							filterable
							style="width: 200px"
							@change="changeMember">
							<el-option
								v-for="item in initMemberList"
								:key="item.userId"
								:label="item.userName"
								:value="item.userId" />
						</el-select>

						<el-tag
							type="primary"
							:effect="visibleAllMember ? 'dark' : 'light'"
							round
							class="ml-[10px] cursor-pointer hover:opacity-90"
							@click="changeAll">
							所有人
						</el-tag>
					</div>

					<el-checkbox-group v-model="projectMember">
						<el-checkbox
							v-for="item in initMemberList"
							:key="item.userId"
							:label="item.userName" />
					</el-checkbox-group>
				</div>
			</el-tab-pane>
		</el-tabs>

		<div class="flex items-center mt-[18px] border-t pt-[18px]">
			<el-button
				:loading="loading"
				size="small"
				type="primary"
				class="ml-[10px]"
				@click="saveProjectMember">
				保存项目成员
			</el-button>

			<el-button
				:loading="loading"
				size="small"
				link
				@click="cancleProjectMember">
				取消
			</el-button>
		</div>
	</div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTask } from '@/hooks'

defineOptions({
	name: 'MemberManager',
})

const { initMemberList, pageToProjectManager } = useTask()

const props = defineProps({
	visibleAddMember: {
		type: Boolean,
		default: false,
	},
})

// 是否添加成员模式
const visibleAdd = ref(false)

watch(
	() => props.visibleAddMember,
	(val) => {
		visibleAdd.value = val
	},
	{
		deep: true,
		immediate: true,
	}
)

const pageLoading = ref(false)

/**
 * 退出项目
 */
const exitProject = async () => {
	try {
		await ElMessageBox.confirm(`请确认是否退出项目`, '提示', {
			confirmButtonText: '确定',
			type: 'warning',
			closeOnClickModal: false,
			closeOnPressEscape: false,
		})
		// TODO: 退出项目请求
		ElMessage.success('退出成功')
		pageToProjectManager()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}

// 添加成员的tabs
const addTabsName = ref('team')

// 选择的团队成员
const selectUser = ref('')

// 初始化项目成员
const initProjectMember = ref([])

// 当前选中的项目成员
const projectMember = ref([])

// 是否全部选择项目成员
const visibleAllMember = computed(
	() => unref(projectMember).length === unref(initMemberList).length
)

/**
 * 添加所有团队成员
 */
const changeAll = () => {
	if (unref(visibleAllMember)) {
		projectMember.value = []
	} else {
		projectMember.value = unref(initMemberList).map((item) => item.userName)
	}
}

/**
 * 添加成员
 */
const changeMember = (userId) => {
	const member = unref(initMemberList).find((item) => item.userId === userId)
	if (member) {
		projectMember.value.push(member.userName)
	}
	selectUser.value = ''
}

// 按钮加载
const loading = ref(false)

/**
 * 保存项目成员
 */
const saveProjectMember = () => {
	try {
		loading.value = true
		// TODO: 保存项目成员
		ElMessage.success('保存成功')
		cancleProjectMember()
	} catch (err) {
	} finally {
		loading.value = false
	}
}

/**
 * 取消添加项目成员
 */
const cancleProjectMember = () => {
	visibleAdd.value = false
}
</script>

<style lang="scss" scoped></style>
