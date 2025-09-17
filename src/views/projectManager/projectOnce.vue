<template>
	<div class="project-once">
		<div
			class="header pb-[10px] pl-[18px] pr-[18px] flex items-center justify-between border-b">
			<div class="header-left flex-1">
				<div class="title font-medium text-[18px]">{{ projectName }}</div>

				<div class="tabs flex items-center mt-[10px]">
					<div
						v-for="item in tabsList"
						:key="item.id"
						:class="[
							'tab',
							tabId === item.id ? 'font-medium text-[#000000]' : '',
						]"
						class="tab mr-[18px] cursor-pointer last:mr-0 hover:font-medium hover:text-[#000000] text-[#666666] text-[14px]"
						@click="changeTab(item.id)">
						{{ item.value }}
					</div>
				</div>
			</div>

			<div class="header-right flex items-center" v-if="tabId !== '4'">
				<div
					class="member flex items-center cursor-pointer"
					@click="pageToMemberManage('4', false)">
					<div
						class="item ml-[-16px] first:ml-0"
						v-for="(item, index) in projectMemberList"
						:key="index">
						<el-avatar :size="38" :src="item.userHead" />
					</div>
				</div>

				<div
					class="btns ml-[18px]"
					v-if="isProjectManager || $isTeamSupperManager">
					<el-button @click="pageToMemberManage('4', true)">添加成员</el-button>
				</div>
			</div>
		</div>

		<div class="content mt-[18px] h-[calc(100%-105px)]">
			<transition name="el-fade-in">
				<TaskList v-if="tabId === '1'" :projectMemberList="projectMemberList" />
			</transition>

			<transition name="el-fade-in">
				<FileList v-if="tabId === '2'" />
			</transition>

			<transition name="el-fade-in">
				<CalendarList
					v-if="tabId === '3'"
					:projectMemberList="projectMemberList" />
			</transition>

			<transition name="el-fade-in">
				<MemberManager
					v-if="tabId === '4'"
					:projectMemberList="projectMemberList"
					:visibleAddMember="visibleAddMember"
					@save="getProjectMemberList" />
			</transition>
		</div>
	</div>
</template>

<script setup>
import TaskList from './components/taskList.vue'
import FileList from './components/fileList.vue'
import CalendarList from './components/calendarList.vue'
import MemberManager from './components/memberManager.vue'

import { useTask, useAuth } from '@/hooks'
import { getProjectMembersApi } from '@/api/modules/project'

const { $userId, $projectId, $isTeamSupperManager, $projectList } = useAuth()

const { initMemberList } = useTask()

// 项目名称
const projectName = computed(() => {
	return (
		$projectList.value.find((item) => item.projectId === $projectId.value)
			?.projectName || ''
	)
})

// 是否是项目管理员
const isProjectManager = computed(() => {
	const findData = unref(projectMemberList).find(
		(item) => item.userId === $userId.value
	)
	if (!findData) return false
	if (findData.roles.includes(3)) return true
	return false
})

const tabId = ref('1')
const tabsList = ref([
	{ id: '1', value: '列表' },
	{ id: '2', value: '文件' },
	{ id: '3', value: '日历' },
])

// 是否添加成员
const visibleAddMember = ref(false)

/**
 * 切换tab
 */
const changeTab = (id) => {
	tabId.value = id
}

// 项目成员列表
const projectMemberList = ref([])

/**
 * 跳转管理成员
 */
const pageToMemberManage = (id, type) => {
	tabId.value = id
	visibleAddMember.value = type
}

/**
 * 获取项目成员列表
 */
const getProjectMemberList = async () => {
	try {
		const params = {
			projectId: $projectId.value,
		}
		const res = await getProjectMembersApi(params)
		projectMemberList.value = res.data.filter((item) => item.isDelete === 0)
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 初始化
 */
const initial = () => {
	getProjectMemberList()
}

onMounted(() => {
	initial()
})
</script>

<style lang="scss" scoped>
.project-once {
}
</style>
