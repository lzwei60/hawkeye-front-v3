<template>
	<el-dialog
		v-model="modalVisible"
		:title="stepType === 1 ? '邮箱校验' : '修改邮箱'"
		width="500">
		<el-form
			label-width="90px"
			:model="emailModel"
			:rules="formRules"
			ref="formRef">
			<div class="overflow-hidden relative">
				<transition name="slide-x" mode="out-in">
					<div :key="stepType">
						<template v-if="stepType === 1">
							<el-form-item label="旧邮箱" prop="oldEmail">
								<el-input
									v-model="emailModel.oldEmail"
									placeholder="请输入旧邮箱" />
							</el-form-item>

							<el-form-item label="验证码" prop="oldCode">
								<div class="flex items-center">
									<el-input
										v-model="emailModel.oldCode"
										placeholder="请输入验证码" />

									<el-button
										class="ml-[10px] flex-1"
										:disabled="oldCodeCount.isCounting"
										@click="handleSendCode"
										type="primary">
										{{
											oldCodeCount.isCounting
												? `${oldCodeCount.count}s后重试`
												: '发送验证码'
										}}
									</el-button>
								</div>
							</el-form-item>
						</template>

						<template v-if="stepType === 2">
							<el-form-item label="新邮箱" prop="newEmail">
								<el-input
									v-model="emailModel.newEmail"
									placeholder="请输入信邮箱" />
							</el-form-item>

							<el-form-item label="验证码" prop="newCode">
								<div class="flex items-center">
									<el-input
										v-model="emailModel.newCode"
										placeholder="请输入验证码" />

									<el-button
										class="ml-[10px] flex-1"
										:disabled="newCodeCount.isCounting"
										@click="handleSendCode"
										type="primary">
										{{
											newCodeCount.isCounting
												? `${newCodeCount.count}s后重试`
												: '发送验证码'
										}}
									</el-button>
								</div>
							</el-form-item>
						</template>
					</div>
				</transition>
			</div>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="cancle">取消</el-button>

				<el-button :loading="btnLoading" type="primary" @click="confirm">
					{{ stepType === 1 ? '下一步' : '确认' }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { emailRE } from '@/utils/validate'
import { useAuthStore } from '@/store/modules/auth'
import {
	verifyInitEmailApi,
	updateUserEmailApi,
	getLoginUserInfoApi,
} from '@/api/modules/user.js'
import { sendEmailCodeApi } from '@/api/modules/login'

defineOptions({
	name: 'EmailDialog',
})

const authStore = useAuthStore()

const emits = defineEmits('confirm', 'cancle')

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	email: {
		type: String,
		default: '',
	},
})

// 邮箱数据
const emailModel = ref({
	oldEmail: '',
	oldCode: '',
	newEmail: '',
	newCode: '',
})

/**
 * 邮箱校验
 */
const checkEmail = (rule, val, callback) => {
	if (!val) callback()
	if (!emailRE.test(val)) {
		callback(new Error('当前邮件地址无效'))
	}
	callback()
}

const formRules = ref({
	oldEmail: [
		{ required: true, message: '请输入旧邮箱', trigger: 'blur' },
		{ validator: checkEmail, trigger: 'blur' },
	],
	oldCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
	newEmail: [
		{ required: true, message: '请输入新邮箱', trigger: 'blur' },
		{ validator: checkEmail, trigger: 'blur' },
	],
	newCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

// 加载状态
const btnLoading = ref(false)

// 步骤 1校验 2修改
const stepType = ref(1)

// 旧验证码定时器
const oldCodeCount = ref({
	count: 60,
	isCounting: false,
	timer: null,
})

// 新验证码定时器
const newCodeCount = ref({
	count: 60,
	isCounting: false,
	timer: null,
})

/**
 * 发送验证码-旧
 */
const handleSendCode = async () => {
	const codeCount =
		unref(stepType) === 1 ? oldCodeCount.value : newCodeCount.value
	if (codeCount.isCounting) return

	// 发送验证码逻辑，如请求接口
	await sendCode()

	// 启动倒计时
	codeCount.isCounting = true
	codeCount.count = 60
	codeCount.timer = setInterval(() => {
		codeCount.count--
		if (codeCount.count <= 0) {
			clearInterval(codeCount.timer)
			codeCount.isCounting = false
		}
	}, 1000)
}

/**
 * 发送验证码逻辑
 */
const sendCode = async () => {
	try {
		let email = unref(stepType) === 1 ? 'oldEmail' : 'newEmail'

		await formRef.value?.validateField(email)
		await sendEmailCodeApi({ email: unref(emailModel)[email] })
		ElMessage.success('验证码发送成功')
	} catch (err) {
		return Promise.reject(err)
	}
}

// 表单 dom
const formRef = ref()

/*
 * 表单校验
 */
const formValidate = () => {
	return unref(formRef)?.validate()
}

/**
 * 清除校验
 */
const formClearValidate = () => {
	return unref(formRef)?.clearValidate()
}

/**
 * 确认
 */
const confirm = async () => {
	try {
		btnLoading.value = true

		if (unref(stepType) === 1) {
			await verifyCorrect()
			clearInterval(oldCodeCount.value.timer)
		} else {
			await confirmEmail()
			clearInterval(newCodeCount.value.timer)
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		btnLoading.value = false
	}
}

/**
 * 校验旧邮箱是否正确
 */
const verifyCorrect = async () => {
	try {
		const { oldEmail, oldCode } = unref(emailModel)
		await formValidate()
		const res = await verifyInitEmailApi({
			userEmail: oldEmail,
			code: parseInt(oldCode),
		})
		stepType.value = 2
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 确认修改邮箱
 */
const confirmEmail = async () => {
	try {
		const { newEmail, newCode } = unref(emailModel)
		await formValidate()
		await updateUserEmailApi({ userEmail: newEmail, code: parseInt(newCode) })
		ElMessage.success('修改成功')
		emits('confirm', emailModel.value)
		cancle()
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 关闭
 */
const cancle = () => {
	emits('cancle')
}

const modalVisible = computed(() => props.visible)

watch(
	() => props.visible,
	(val) => {
		if (val) {
			emailModel.value.oldEmail = props.email
			formClearValidate()
		}
	},
	{
		immediate: true,
	}
)

watch(
	() => props.email,
	(val) => {
		if (val) {
			emailModel.value.oldEmail = props.email
		}
	},
	{
		immediate: true,
	}
)
</script>

<style lang="scss" scoped>
/* 横向切换动画定义 */
.slide-x-enter-active,
.slide-x-leave-active {
	transition:
		transform 0.3s ease,
		opacity 0.3s ease;
}
.slide-x-enter-from {
	transform: translateX(100%);
	opacity: 0;
}
.slide-x-enter-to {
	transform: translateX(0);
	opacity: 1;
}
.slide-x-leave-from {
	transform: translateX(0);
	opacity: 1;
}
.slide-x-leave-to {
	transform: translateX(-100%);
	opacity: 0;
}
</style>
