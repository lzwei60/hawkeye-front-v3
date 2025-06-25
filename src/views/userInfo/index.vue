<template>
	<div class="m-[20px]">
		<div class="flex items-center justify-between">
			<div class="text-[20px] font-bold">个人设置</div>

			<div class="flex items-center">
				<el-button type="danger" link size="small" @click="quitTeam">
					退出团队
				</el-button>
			</div>
		</div>

		<div class="mt-[20px] flex items-center">
			<el-avatar src="" :size="70" />

			<el-upload
				class="ml-[20px]"
				action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload">
				<el-button type="primary" link>选择新头像</el-button>
				<template #tip>
					<div class="el-upload__tip">你可以选择 png/jpg 图片作为头像</div>
				</template>
			</el-upload>
		</div>

		<div class="mt-[20px] flex items-center">
			<div class="text-[14px] w-[70px] text-right">姓名</div>

			<el-input
				v-model="userInfo.name"
				class="ml-[20px]"
				style="width: 240px"
				placeholder="请输入姓名" />
		</div>

		<div class="mt-[20px] flex items-start">
			<div class="text-[14px] w-[70px] text-right">邮箱</div>

			<div class="flex items-start flex-col flex-start">
				<el-input
					class="ml-[20px]"
					style="width: 240px"
					disabled
					placeholder="请输入邮箱" />

				<el-button
					type="primary"
					link
					class="mt-[10px] ml-[15px]"
					size="small"
					@click="changeEmailDialog(true)">
					修改邮箱
				</el-button>
			</div>
		</div>

		<div class="mt-[20px] flex items-center">
			<div class="text-[14px] w-[70px] text-right">手机</div>

			<div class="ml-[20px] text-[12px] text-[#666666]">暂未开放</div>
		</div>

		<div class="mt-[20px] flex items-start">
			<div class="text-[14px] w-[70px] text-right">密码</div>

			<el-button
				type="primary"
				link
				class="ml-[15px]"
				size="small"
				@click="changePasswordDialog(true)">
				修改密码
			</el-button>
		</div>

		<div class="mt-[20px] flex items-start">
			<div class="text-[14px] w-[70px] text-right">描述</div>

			<el-input
				class="ml-[20px]"
				type="textarea"
				:rows="4"
				style="width: 240px"
				placeholder="请输入描述" />
		</div>

		<div class="mt-[20px] ml-[90px]">
			<el-button
				v-loading="btnLoading"
				type="primary"
				size="large"
				@click="save">
				保存
			</el-button>
		</div>
	</div>

	<EmailDialog
		:visible="emailDialogData.visible"
		@cancle="changeEmailDialog(false)" />

	<passwordDialog
		:visible="passwordDialogData.visible"
		@cancle="changePasswordDialog(false)" />
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps } from 'element-plus'
import EmailDialog from './components/EmailDialog.vue'
import passwordDialog from './components/passwordDialog.vue'

// 用户数据
const userInfo = ref({})

// 页面加载状态
const loading = ref(false)

/**
 * 退出团队
 */
const quitTeam = async () => {
	try {
		await ElMessageBox.confirm('确定要退出团队吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})

		// 获取当前用户所在团队
		// TODO: 接口请求
		// 判断用户是否有其他团队
		// 如果有，则展示下一个团队，否则跳转到加入团队界面
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 上传头像成功
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (
	response,
	uploadFile
) => {
	userInfo.value.headImg = URL.createObjectURL(uploadFile.raw!)
}

/**
 * 上传头像前校验
 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
	const fileType = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
	const fileSuffix = file.name.split('.').pop().toLocaleLowerCase()
	const isType = fileType.includes(`.${fileSuffix}`)
	const isLimit = file.size / 1024 / 1024 < 5
	if (!isType) {
		ElMessage.warning('附件只能上传图片格式文件')
	}
	if (!isLimit) {
		ElMessage.error('上传头像大小不能超过 5MB ！')
		this.$message.error(`上传附件大小不能超过 ${SYS_UPLOAD_MAX_SIZE} MB!`)
	}

	return isType && isLimit
}

// 修改邮箱弹窗配置数据
const emailDialogData = ref({
	visible: false,
})

/**
 * 修改邮箱弹窗状态
 */
const changeEmailDialog = (bool) => {
	emailDialogData.value.visible = bool
}

// 修改密码弹窗配置数据
const passwordDialogData = ref({
	visible: false,
})

/**
 * 修改密码弹窗状态
 */
const changePasswordDialog = (bool) => {
	passwordDialogData.value.visible = bool
}

// 保存按钮加载状态
const btnLoading = ref(false)

/**
 * 保存
 */
const save = async () => {
	try {
		btnLoading.value = true
		// TODO: 接口请求
		ElMessage.success('保存成功')
		await getUserInfo()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		btnLoading.value = false
	}
}

/**
 * 获取用户信息
 */
const getUserInfo = async () => {
	try {
		loading.value = true
		// TODO: 接口请求
		userInfo.value = {}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 初始化
 */
const init = () => {
	getUserInfo()
}

onMounted(() => {
	init()
})
</script>
