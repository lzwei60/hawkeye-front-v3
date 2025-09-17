<template>
	<el-dialog
		v-model="visible"
		title="请选择移交的成员"
		width="30%"
		@close="reset">
		<el-select v-model="selectedValue" placeholder="请选择" style="width: 100%">
			<el-option
				v-for="item in projectMemberList"
				:key="item.userId"
				:label="item.userName"
				:value="item.userId" />
		</el-select>

		<template #footer>
			<el-button :loading="btnLoading" @click="visible = false">取消</el-button>
			<el-button :loading="btnLoading" type="primary" @click="confirm">
				确定
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuth } from '@/hooks'
import { transferProjectAdminApi } from '@/api/modules/project.js'
import { transferTeamSupperAdminApi } from '@/api/modules/team.js'

const { $userId, $projectId, $teamId } = useAuth()

const visible = ref(false)
const btnLoading = ref(false)
const selectedValue = ref('')

const emits = defineEmits(['confirm'])

const props = defineProps({
	projectMemberList: {
		type: Array,
		default: () => [],
	},
	type: {
		type: String,
		default: 'project',
	},
})

/**
 * 打开弹窗
 */
const open = () => {
	visible.value = true
}

/**
 * 重置状态
 */
const reset = () => {
	selectedValue.value = ''
	btnLoading.value = false
}

/**
 * 确认选择
 */
const confirm = async () => {
	if (!unref(selectedValue)) {
		ElMessage.warning('请选择移交的成员')
		return
	}

	try {
		btnLoading.value = true
		const tips =
			props.type === 'project'
				? '请确认是否移交项目权限'
				: '请确认是否移交团队权限'
		await ElMessageBox.confirm(tips, '提示', {
			confirmButtonText: '确定',
			type: 'warning',
			closeOnClickModal: false,
			closeOnPressEscape: false,
		})

		const params = {
			newAdminId: selectedValue.value,
			oldAdminId: $userId.value,
		}
		if (props.type === 'project') {
			params.projectId = $projectId.value
			await transferProjectAdminApi(params)
		} else {
			params.teamId = $teamId.value
			await transferTeamSupperAdminApi(params)
		}

		ElMessage.success('移交成功')
		emits('confirm')
		visible.value = false
	} catch (err) {
		return Promise.reject(err)
	} finally {
		btnLoading.value = false
	}
}

defineExpose({ open })
</script>
