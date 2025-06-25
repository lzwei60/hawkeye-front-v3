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
			<div class="font-bold text-[32px] text-[#333]">团队名称</div>

			<div class="text-[14px] text-[#777777] ml-[18px]">
				（共 {{ memberList.length }} 人）
			</div>
		</div>

		<el-button
			:icon="Plus"
			type="primary"
			@click="dialogPropsData.visible = true">
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
				<el-avatar
					src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
					size="large" />

				<div class="ml-[18px] font-bold text-[16px]">{{ item.userName }}</div>
			</div>

			<div class="w-[200px] text-center">
				<el-popover
					placement="bottom"
					transition=""
					:width="200"
					trigger="click">
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
								v-if="!['1', '3'].includes(list.roleId)"
								class="item flex items-center justify-between cursor-pointer pt-[10px] pb-[10px] pl-[5px] pr-[5px] hover:bg-[#f5f5f5]"
								@click="changeRole(list.roleId, item.roles)">
								<div class="flex items-center">
									<div
										class="w-[20px] h-[20px] rounded mr-[15px]"
										:style="{ backgroundColor: list.color }"></div>

									<div class="">{{ list.roleName }}</div>
								</div>

								<div
									v-if="item.roles.includes(list.roleId)"
									class="before:content-['✔'] before:text-[#51b52f]"></div>
							</div>
						</template>
					</div>
				</el-popover>
			</div>

			<div>462062531@qq.com</div>

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
import { useTeam } from '@/hooks'
import { cloneDeep } from 'lodash-es'

const { initRoleList, initMemberList, initNewMemberList } = useTeam()

// 用户列表
const memberList = ref(cloneDeep(unref(initMemberList)))

// 加载状态
const loading = ref(false)

// 当前标签
const tabValue = ref('all')

/**
 * 切换标签
 */
const changeTab = (type) => {
	tabValue.value = type
	if (type === 'all') {
		getAllMemberList()
	} else {
		getNewMemberList()
	}
}

/**
 * 获取所有成员列表
 */
const getAllMemberList = async () => {
	loading.value = true
	try {
		memberList.value = cloneDeep(unref(initMemberList))
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
	loading.value = true
	try {
		memberList.value = cloneDeep(unref(initNewMemberList))
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
		// TODO: 请求
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
const changeRole = (roleId, roles) => {
	const teamManagerIndex = roles.findIndex((item) => item === '4')
	if (teamManagerIndex > -1) {
		roles.splice(teamManagerIndex, 1)
	}
	const memberIndex = roles.findIndex((item) => item === '2')
	if (memberIndex > -1) {
		roles.splice(memberIndex, 1)
	}
	roles.push(roleId)
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
		// TODO 请求
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
		// TODO 请求
		getNewMemberList()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}
</script>

<style lang="scss" scoped>
:deep .el-tag--info {
	border: unset;
}
</style>
