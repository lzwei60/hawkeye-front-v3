<template>
	<div class="flex items-center justify-between px-[18px] mb-[18px]">
		<div class="flex items-center">
			<div class="text-[20px] font-bold mr-[10px]">项目成员</div>

			<el-button
				v-if="!visibleAdd && (isProjectManager || $isTeamSupperManager)"
				size="small"
				class="mt-[4px]"
				@click="openProjectMember">
				管理成员
			</el-button>

			<el-button
				v-if="!visibleAdd && (isProjectManager || $isTeamSupperManager)"
				size="small"
				class="mt-[4px]"
				@click="handoverPermissions">
				移交权限
			</el-button>
		</div>

		<div v-if="!visibleAdd" class="flex items-center">
			<el-button
				v-if="projectMemberList.length > 1"
				size="small"
				type="danger"
				class="mt-[4px]"
				@click="exitProject">
				退出项目
			</el-button>

			<el-button
				v-if="isProjectManager || $isTeamSupperManager"
				size="small"
				type="danger"
				class="mt-[4px]"
				@click="disbandProject">
				解散项目
			</el-button>
		</div>
	</div>

	<div
		v-if="!visibleAdd"
		class="px-[18px] overflow-hidden overflow-y-auto h-[calc(100vh-300px)]">
		<div class="flex items-center flex-wrap">
			<div
				v-for="item in projectMemberList"
				:key="item.userId"
				class="flex items-center mb-[18px] mr-[18px] cursor-pointer">
				<div class="w-[40px] h-[40px] rounded-full overflow-hidden mr-[5px]">
					<img class="h-full" :src="item.userHead" alt="" />
				</div>

				<div>
					<div class="mb-[2px] text-[14px]">{{ item.userName }}</div>

					<div
						class="text-[12px]"
						:style="{ color: getRolesData(item.roles[0], 'color') }">
						{{ getRolesData(item.roles[0], 'roleName') }}
					</div>
				</div>
			</div>
		</div>

		<div class="text-[18px] font-bold mt-[18px]">成员变化记录</div>
		<!-- max-h-[150px] overflow-hidden overflow-y-auto -->
		<div v-loading="pageLoading" class="my-[18px]">
			<div
				v-for="item in projectUserChangeList"
				:key="item.operateId"
				class="text-[12px] text-[#393939] mb-[8px]">
				<span>{{ item.operateTime }}&nbsp;</span>

				<span>{{ item.__operatorName }}&nbsp;</span>

				<span>{{ item.operateContent }}&nbsp;</span>

				<span
					v-if="
						item.operateContent === '邀请了' || item.operateContent === '移除了'
					"
					>{{ item.operateDetails }}&nbsp;</span
				>

				<span
					v-if="
						item.operateContent === '邀请了' || item.operateContent === '移除了'
					">
					{{ item.operateContent === '邀请了' ? '加入项目' : '退出项目' }}
				</span>
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
								v-for="item in teamUserList"
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
							v-for="item in teamUserList"
							:key="item.userId"
							:value="item.userId"
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

	<HandoverSelect
		ref="handoverSelectRef"
		:projectMemberList="props.projectMemberList"
		@confirm="confrimHandover" />
</template>

<script setup>
import HandoverSelect from './HandoverSelect.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { useTask, useAuth, useTeam } from '@/hooks'
import {
	updateProjectMembersApi,
	getUserProjectOperatesApi,
	quitProjectMemberApi,
	dissolveProjectApi,
} from '@/api/modules/project.js'

defineOptions({
	name: 'MemberManager',
})

const {
	$teamUserList,
	$userId,
	$projectId,
	$teamId,
	$isTeamSupperManager,
	$getUserNickName,
} = useAuth()

const { initRoleList, getRolesData } = useTeam()

const { pageToProjectManager } = useTask()

const proxy = getCurrentInstance().proxy

const emits = defineEmits(['save', 'confirm'])

const props = defineProps({
	projectMemberList: {
		type: Array,
		default: () => [],
	},
	visibleAddMember: {
		type: Boolean,
		default: false,
	},
})

// 是否添加成员模式
const visibleAdd = ref(false)

const pageLoading = ref(false)

// 当前团队用户列表
const teamUserList = ref([])

// 初始化团队用户列表
const initTeamUserList = computed(() => cloneDeep($teamUserList.value))

// 是否是项目管理员
const isProjectManager = computed(() => {
	const findData = props.projectMemberList.find(
		(item) => item.userId === $userId.value
	)
	if (!findData) return false
	if (findData.roles.includes(3)) return true
	return false
})

const handoverSelectRef = ref()

/**
 * 移交管理员权限
 */
const handoverPermissions = () => {
	handoverSelectRef.value && handoverSelectRef.value.open()
}

/**
 * 确认移交管理员权限
 */
const confrimHandover = () => {
	emits('save')
}

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
		if (unref(isProjectManager)) {
			ElMessage.warning('管理员不能退出项目,请移交管理员权限')
			return
		}

		await quitProjectMemberApi({
			projectId: $projectId.value,
		})

		ElMessage.success('退出成功')
		pageToProjectManager()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}

/**
 * 解散项目
 */
const disbandProject = async () => {
	try {
		await ElMessageBox.confirm(
			`该项目所有的内容都将被删除，确认删除该项目吗？`,
			'提示',
			{
				confirmButtonText: '确定',
				type: 'warning',
				closeOnClickModal: false,
				closeOnPressEscape: false,
			}
		)
		if (!unref(isProjectManager) || !unref($isTeamSupperManager)) {
			ElMessage.warning('你暂无权限解散项目')
			return
		}

		await dissolveProjectApi({
			projectId: $projectId.value,
		})

		ElMessage.success('解散成功')
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

// 当前项目已经选择的项目成员
const initProjectMember = ref([])

// 当前选中的项目成员
const projectMember = ref([])

// 是否全部选择项目成员
const visibleAllMember = computed(() => {
	return unref(projectMember).length === unref(initTeamUserList).length
})

/**
 * 添加所有团队成员
 */
const changeAll = () => {
	if (unref(visibleAllMember)) {
		projectMember.value = props.projectMemberList
			.map((item) => item.userId)
			.filter((item) => item === $userId.value)
	} else {
		projectMember.value = unref(initTeamUserList).map((item) => item.userId)
	}
}

/**
 * 添加成员
 */
const changeMember = (userId) => {
	const member = unref(projectMember).find((item) => item === userId)
	if (!member) {
		projectMember.value.push(userId)
	}
	selectUser.value = ''
}

// 按钮加载
const loading = ref(false)

/**
 * 保存项目成员
 */
const saveProjectMember = async () => {
	try {
		loading.value = true
		const params = getProjectMemberNew()
		if (params.addedId.length === 0 && params.deleteId.length === 0) {
			ElMessage.warning('暂无成员修改')
			return
		}
		params.projectId = $projectId.value
		params.teamId = $teamId.value

		await updateProjectMembersApi(params)
		ElMessage.success('保存成功')
		cancleProjectMember()
		emits('save')
		getMemberChangeList()
	} catch (err) {
	} finally {
		loading.value = false
	}
}

/**
 * 计算新增成员和删除成员
 */
const getProjectMemberNew = () => {
	const deleteId = unref(initProjectMember).filter(
		(item) => !unref(projectMember).includes(item)
	)
	const addedId = unref(projectMember)
		.filter((item) => !unref(initProjectMember).includes(item))
		.map((userId) => {
			const member = unref(initTeamUserList).find(
				(item) => item.userId === userId
			)
			return {
				userId: userId,
				userName: member.userName,
			}
		})

	return {
		addedId,
		deleteId,
	}
}

/**
 * 打开添加项目成员
 */
const openProjectMember = () => {
	visibleAdd.value = true
}

/**
 * 取消添加项目成员
 */
const cancleProjectMember = () => {
	visibleAdd.value = false
}

// 项目用户变更列表
const projectUserChangeList = ref([])

/**
 * 获取项目成员变更列表
 */
const getMemberChangeList = async () => {
	try {
		pageLoading.value = true

		const { data: res } = await getUserProjectOperatesApi({
			projectId: $projectId.value,
		})

		projectUserChangeList.value = res.map((item) => {
			item.__operatorName = $getUserNickName(item.operatorId)
			return item
		})
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}

watch(
	() => props.visibleAddMember,
	(val) => {
		val && openProjectMember()
	},
	{
		deep: true,
		immediate: true,
	}
)

watch(
	() => visibleAdd.value,
	() => {
		teamUserList.value = $teamUserList.value.filter(
			(item) => item.userId !== $userId.value
		)
		projectMember.value = props.projectMemberList.map((item) => item.userId)

		initProjectMember.value = cloneDeep(projectMember.value)
	},
	{
		deep: true,
		immediate: true,
	}
)

onMounted(() => {
	getMemberChangeList()
})
</script>
