<template>
	<div class="flex items-center">
		<div
			class="px-[10px] py-[5px] rounded-full cursor-pointer hover:opacity-80 mr-[10px]"
			:class="
				tabValue === 'all'
					? 'bg-[#1677ff] text-white'
					: 'bg-[#eff6ff] text-black'
			"
			@click="changeTab('all')">
			所有成员
		</div>

		<div
			class="px-[10px] py-[5px] rounded-full cursor-pointer hover:opacity-80"
			:class="
				tabValue === 'new'
					? 'bg-[#1677ff] text-white'
					: 'bg-[#eff6ff] text-black'
			"
			@click="changeTab('new')">
			新成员
		</div>
	</div>

	<div class="mt-[18px] flex items-center justify-between">
		<div class="flex items-center">
			<div class="font-bold text-[32px] text-[#333]">
				{{ teamInfo.teamName }}
			</div>

			<div class="text-[14px] text-[#777777] ml-[18px]">
				（共 {{ memberList.length }} 人）
			</div>
		</div>

		<el-button :icon="Plus" type="primary" @click="openAddMemberDialog">
			添加成员
		</el-button>
	</div>

	<div
		v-loading="loading"
		class="mt-[18px] h-[calc(100%-120px)] overflow-hidden overflow-y-auto px-[10px]">
		<div
			class="flex items-center justify-between border-t py-[10px] mb-[10px] last:mb-0"
			v-for="(item, index) in memberList"
			:key="item.userId">
			<div class="flex items-center">
				<el-avatar :src="item.userHead" size="large" />

				<div class="ml-[18px] font-bold text-[16px]">{{ item.userName }}</div>
			</div>

			<div class="w-[200px] text-center" v-if="tabValue === 'all'">
				<el-popover
					placement="bottom"
					transition=""
					:width="200"
					trigger="click"
					:disabled="item.roles.includes(1)">
					<template #reference>
						<div>
							<el-tag
								v-for="role in item.roles"
								:key="role"
								class="cursor-pointer mr-[10px] last:mr-0"
								effect="dark"
								type="info"
								disable-transitions
								:color="getRolesData(role, 'color')">
								{{ getRolesData(role, 'roleName') }}
							</el-tag>
						</div>
					</template>

					<div class="list">
						<template v-for="list in initRoleList" :key="list.roleId">
							<div
								v-if="![1, 3].includes(list.roleId)"
								class="item flex items-center justify-between cursor-pointer pt-[10px] pb-[10px] pl-[5px] pr-[5px] hover:bg-[#f5f5f5]"
								@click="changeRole(list.roleId, item)">
								<div class="flex items-center">
									<div
										class="w-[20px] h-[20px] rounded mr-[15px]"
										:style="{ backgroundColor: list.color }"></div>

									<div class="">{{ list.roleName }}</div>
								</div>

								<div
									v-if="item?.roles?.includes(list.roleId)"
									class="before:content-['✔'] before:text-[#51b52f]"></div>
							</div>
						</template>
					</div>
				</el-popover>
			</div>

			<div>{{ item.userEmail }}</div>

			<div v-if="tabValue === 'all'">
				<el-button type="info" link @click="removeMember(item, index)">
					移除
				</el-button>
			</div>

			<div v-else>
				<el-button type="danger" link @click="rejectMember(item, index)">
					拒绝
				</el-button>

				<el-button type="primary" link @click="agreeMember(item, index)">
					通过
				</el-button>
			</div>
		</div>

		<el-empty v-if="!memberList.length" description="暂无新成员"></el-empty>
	</div>

	<el-dialog
		v-model="dialogPropsData.visible"
		:title="dialogPropsData.title"
		:width="dialogPropsData.width">
		<div class="">
			<div class="font-bold text-[#000000] mb-[18px]">
				通过公开团队码，快速邀请
			</div>

			<el-input v-model="dialogPropsData.teamCode" readonly>
				<template #suffix>
					<el-button type="primary" link @click="copyCode">复制</el-button>
				</template>
			</el-input>

			<div class="mt-[18px] text-[#777777] text-[14px]">
				注意：任何看到邀请链接的人，都可以申请加入团队。如果你想让邀请链接失效，请
				<span
					class="text-[#000] cursor-pointer underline underline-offset-4 hover:opacity-60"
					@click="createCode">
					重新生成团队邀请码
				</span>
			</div>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogPropsData.visible = false">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useAuth, useTeam } from '@/hooks'
import {
	getTeamMembersApi,
	getPendingTeamMembersApi,
	updateTeamUserStatusApi,
	regenerateTeamInvitationKeyApi,
	updateTeamUserIdentityApi,
} from '@/api/modules/team.js'
import { cloneDeep } from 'lodash-es'

const { initRoleList, initMemberList, initNewMemberList } = useTeam()

const { $teamId, $teamList, $getTeamList, $getTeamAllUser, $getTeamUser } =
	useAuth()

// 用户列表
const memberList = ref([])

// 加载状态
const loading = ref(false)

// 当前标签
const tabValue = ref('all')

// 获取团队信息
const teamInfo = computed(() => {
	return $teamList.value.find((item) => item.teamId === $teamId.value) || {}
})

/**
 * 切换标签
 */
const changeTab = async (type) => {
	if (type === 'all') {
		await getAllMemberList()
	} else {
		await getNewMemberList()
	}
	tabValue.value = type
}

/**
 * 获取所有成员列表
 */
const getAllMemberList = async () => {
	loading.value = true
	try {
		const res = await getTeamMembersApi({ teamId: unref($teamId) })
		memberList.value = res.data
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 获取新成员列表
 */
const getNewMemberList = async () => {
	try {
		loading.value = true
		const res = await getPendingTeamMembersApi({ teamId: unref($teamId) })
		memberList.value = res.data
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

// 弹窗数据
const dialogPropsData = reactive({
	visible: false,
	title: '添加新成员',
	width: '420px',
	teamCode: 'dfafkjsdklfj1231kj312klj3k21',
})

/**
 * 打开添加成员弹窗
 */
const openAddMemberDialog = () => {
	dialogPropsData.visible = true
	dialogPropsData.teamCode = teamInfo.value.teamInvitationKey
}

/**
 * 复制团队码
 */
const copyCode = async () => {
	try {
		await navigator.clipboard.writeText(dialogPropsData.teamCode)
		ElMessage.success('复制成功')
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 重新生成团队码
 */
const createCode = async () => {
	try {
		await ElMessageBox.confirm('确定重新生成团队码吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		const params = {
			teamId: unref($teamId),
		}
		const res = await regenerateTeamInvitationKeyApi(params)
		ElMessage.success('已重新生成')
		dialogPropsData.teamCode = res.data.invitationKey
		$getTeamList(true)
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 获取角色名
 */
const getRolesData = (role, field) => {
	const roleName = initRoleList.value.find((item) => item.roleId === role)
	return roleName ? roleName[field] : ''
}

/**
 * 修改角色
 */
const changeRole = async (roleId, item) => {
	try {
		loading.value = true
		if (item.roles.includes(roleId)) return

		const params = {
			teamId: unref($teamId),
			userId: item.userId,
			teamIdentity: roleId,
		}
		const res = await updateTeamUserIdentityApi(params)
		ElMessage.success('修改成功')
		await getAllMemberList()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 移除成员
 */
const removeMember = async (item, index) => {
	try {
		loading.value = true
		await ElMessageBox.confirm('确定移除该成员吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		memberList.value.splice(index, 1)
		// TODO: 需要移除团队成员所属的项目，项目所属任务，设置执行人为空
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 拒绝加入
 */
const rejectMember = async (item, index) => {
	try {
		await ElMessageBox.confirm('确定拒绝该成员加入吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		loading.value = true
		const params = {
			teamId: unref($teamId),
			userId: item.userId,
			isPass: 2,
		}
		const res = await updateTeamUserStatusApi(params)
		ElMessage.success('已拒绝')
		getNewMemberList()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 同意加入
 */
const agreeMember = async (item, index) => {
	try {
		await ElMessageBox.confirm('确定同意该成员加入吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		loading.value = true
		const params = {
			teamId: unref($teamId),
			userId: item.userId,
			isPass: 1,
		}
		const res = await updateTeamUserStatusApi(params)
		ElMessage.success('已同意')
		await getNewMemberList()
		await $getTeamAllUser(true)
		await $getTeamUser(true)
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

const init = () => {
	changeTab(unref(tabValue))
}

onMounted(() => {
	init()
})
</script>

<style lang="scss" scoped>
:deep .el-tag--info {
	border: unset;
}
</style>
