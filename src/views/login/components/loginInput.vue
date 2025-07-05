<template>
	<div
		class="login_body"
		:class="visibleRegister ? 'pt-5' : 'pt-10'"
		title="登陆方式">
		<transition :name="transitionName" mode="out-in">
			<div :key="loginType" class="login_body-box">
				<div
					v-if="visibleAccount || visibleRegister || visibleForget"
					class="relative mb-5"
					title="账号">
					<div class="login_body_username">
						<Icon-ep-user class="text-[#b1dcfe] text-2xl mr-2.5" />

						<el-input
							v-model="formModel.userAccount"
							size="large"
							type="text"
							placeholder="请输入账号"
							@blur="validateAccount" />
					</div>

					<div
						v-if="errorModel.countError"
						class="text-red-500 text-[12px] ml-10 absolute">
						{{ errorModel.countError }}
					</div>
				</div>

				<div v-if="visibleRegister" class="relative mb-5" title="名称">
					<div class="login_body_username">
						<Icon-carbon-user-avatar class="text-[#b1dcfe] text-2xl mr-2.5" />

						<el-input
							v-model="formModel.userName"
							size="large"
							type="text"
							placeholder="请输入名称" />
					</div>

					<div
						v-if="errorModel.userNameError"
						class="text-red-500 text-[12px] ml-10 absolute">
						{{ errorModel.userNameError }}
					</div>
				</div>

				<div
					v-if="!visibleAccount || visibleRegister || visibleForget"
					class="relative mb-5"
					title="邮箱">
					<div class="login_body_username">
						<Icon-carbon-email class="text-[#b1dcfe] text-2xl mr-2.5" />

						<el-input
							v-model="formModel.userEmail"
							size="large"
							type="email"
							placeholder="请输入邮箱" />
					</div>

					<div
						v-if="errorModel.emailError"
						class="text-red-500 text-[12px] ml-10 absolute">
						{{ errorModel.emailError }}
					</div>
				</div>

				<div class="relative mb-5" title="密码">
					<div class="login_body_username">
						<Icon-ep-lock class="text-[#b1dcfe] text-2xl mr-2.5" />

						<el-input
							v-model="formModel.passWord"
							size="large"
							type="password"
							show-password
							placeholder="请输入密码" />
					</div>

					<div
						v-if="errorModel.passwordError"
						class="text-red-500 text-[12px] ml-10 absolute">
						{{ errorModel.passwordError }}
					</div>
				</div>

				<div
					v-if="visibleRegister || visibleForget"
					class="relative mb-5"
					title="验证码">
					<div class="login_body_username">
						<Icon-carbon-status-resolved
							class="text-[#b1dcfe] text-2xl mr-2.5 min-w-[26px] w-[26px]" />

						<el-input
							class="mr-2"
							v-model="formModel.code"
							size="large"
							placeholder="请输入验证码" />

						<el-button
							:disabled="countdown > 0"
							:loading="loading"
							type="primary"
							link
							@click="sendCode">
							{{ countdown > 0 ? `${countdown}s后可重发` : '发送验证码' }}
						</el-button>
					</div>

					<div
						v-if="errorModel.codeError"
						class="text-red-500 text-[12px] ml-10 absolute">
						{{ errorModel.codeError }}
					</div>
				</div>
			</div>
		</transition>

		<div
			v-if="!visibleRegister && !visibleForget"
			class="login_body_forget text-4 mb-[30px]"
			@click="forgetPassword">
			忘记密码？
		</div>

		<div class="login_body_button">
			<el-button
				:loading="loading"
				type="primary"
				class="login_body_quicklogin"
				@click="loginOrRegister">
				{{ textModel.buttonText }}
			</el-button>
		</div>

		<div class="login_body_register mt-5">
			<div class="text-[#8e8e8e] text-3">{{ textModel.tipsText }}</div>

			<el-button
				class="login_body_reg_register"
				type="primary"
				link
				@click="pageToOtherPage">
				{{ textModel.tipsButton }}
			</el-button>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import _, { cloneDeep } from 'lodash-es'
import {
	loginApi,
	registerApi,
	sendEmailCodeApi,
	resetPasswordApi,
} from '@/api/modules/login'
import { useAuthStore } from '@/store/modules/auth'
import { ConstanEnum } from '@/enums'

const router = useRouter()

const authStore = useAuthStore()

const props = defineProps({
	// 状态
	statusType: {
		type: String,
		default: 'login',
	},
	loginType: {
		type: String,
		default: 1,
	},
})

// 是否账号登录
const visibleAccount = computed(() => props.loginType === 1)

// 是否是登录
const visibleLogin = computed(() => props.statusType === 'login')

// 是否是注册
const visibleRegister = computed(() => props.statusType === 'register')

// 是否是忘记密码
const visibleForget = computed(() => props.statusType === 'forget')

// 动画效果
const transitionName = computed(() =>
	unref(visibleAccount) ? 'slide-right' : 'slide-left'
)

// 基础文字数据
const textModel = computed(() => {
	if (unref(visibleLogin))
		return {
			buttonText: '立即登录',
			tipsText: '还没有注册？',
			tipsButton: '立即注册',
		}
	else if (unref(visibleRegister))
		return {
			buttonText: '立即注册',
			tipsText: '已有账号？',
			tipsButton: '立即登录',
		}
	else if (unref(visibleForget))
		return {
			buttonText: '重置密码',
			tipsText: '已有账号？',
			tipsButton: '立即登录',
		}
})

/**
 * 校验账号
 */
const validateAccount = (reset = false) => {
	if (reset) {
		errorModel.value.countError = ''
		return
	}
	if (!unref(formModel).userAccount) {
		errorModel.value.countError = '请输入账号'
		throw new Error('请输入账号')
	}
	errorModel.value.countError = ''
}

/**
 * 校验邮箱
 */
const validateEmail = (reset = false) => {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	if (reset) {
		errorModel.value.emailError = ''
		return
	}
	if (!unref(formModel).userEmail) {
		errorModel.value.emailError = '请输入邮箱地址'
		throw new Error('请输入邮箱地址')
	}
	if (!regex.test(unref(formModel).userEmail)) {
		errorModel.value.emailError = '请输入有效的邮箱地址'
		throw new Error('请输入有效的邮箱地址')
	}
	errorModel.value.emailError = ''
}

/**
 * 校验密码
 */
const validatePassword = (reset = false) => {
	if (reset) {
		errorModel.value.passwordError = ''
		return
	}
	if (!unref(formModel).passWord) {
		errorModel.value.passwordError = '请输入密码'
		throw new Error('请输入密码')
	}
	if (unref(formModel).passWord.length < 6) {
		errorModel.value.passwordError = '密码长度不能少于6位'
		throw new Error('密码长度不能少于6位')
	}
	errorModel.value.passwordError = ''
}

/**
 * 校验用户名
 */
const validateUserName = (reset = false) => {
	if (reset) {
		errorModel.value.userNameError = ''
		return
	}
	if (!unref(formModel).userName) {
		errorModel.value.userNameError = '请输入用户名'
		throw new Error('请输入用户名')
	}
	errorModel.value.userNameError = ''
}

/**
 * 校验验证码
 */
const validateCode = (reset = false) => {
	if (reset) {
		errorModel.value.codeError = ''
		return
	}
	if (!unref(formModel).code) {
		errorModel.value.codeError = '请输入验证码'
		throw new Error('请输入验证码')
	}

	errorModel.value.codeError = ''
}

// 错误提示
const errorModel = ref({
	countError: '',
	emailError: '',
	passwordError: '',
	userNameError: '',
	codeError: '',
})

// 登录 || 注册数据
const formModel = ref({
	userAccount: '', // 账号
	userEmail: '', // 邮箱
	passWord: '', // 密码
	// 注册数据
	userName: '', // 用户名
	code: '', // 验证码
})

// 加载中
const loading = ref(false)

/**
 * 重置表单
 */
const resetFormModel = () => {
	validateAccount(true)
	validateEmail(true)
	validatePassword(true)
	validateUserName(true)
	validateCode(true)
	formModel.value = {
		userAccount: '', // 账号
		userEmail: '', // 邮箱
		passWord: '', // 密码
		userName: '', // 用户名
		code: '', // 验证码
	}
}

/**
 * 忘记密码
 */
const forgetPassword = () => {
	router.push('/forget')
}

// 倒计时秒数
const countdown = ref(0)

// 时间容器
const timer = ref(null)

/**
 * 发送验证码
 */
const sendCode = async () => {
	try {
		loading.value = true
		await validateEmail()

		await sendEmailCodeApi({ email: unref(formModel).userEmail })
		ElMessage.success('验证码发送成功')
		const now = _.now() // 更可靠的当前时间戳
		localStorage.setItem(ConstanEnum.STORAGE_KEY, now.toString())
		startCountdown(ConstanEnum.DURATION)
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 开始倒计时
 */
const startCountdown = (remaining) => {
	countdown.value = remaining
	timer.value = setInterval(() => {
		countdown.value--
		if (countdown.value <= 0) {
			clearInterval(timer.value)
			localStorage.removeItem(ConstanEnum.STORAGE_KEY)
		}
	}, 1000)
}

/**
 * 跳转到 登录 | 注册页面
 */
const pageToOtherPage = () => {
	const path =
		unref(visibleRegister) || unref(visibleForget) ? '/login' : '/register'
	router.push(path)
}

/**
 * 登录 | 注册
 */
const loginOrRegister = async () => {
	if (unref(visibleRegister)) {
		await register()
	} else if (unref(visibleLogin)) {
		await login()
	} else {
		await forget()
	}
}

/**
 * 登录
 */
const login = async () => {
	try {
		loading.value = true
		props.loginType === 1 ? validateAccount() : validateEmail()
		validatePassword()
		const params = cloneDeep(unref(formModel))
		params.loginType = props.loginType

		unref(visibleAccount) ? delete params.userEmail : delete params.userAccount
		if (!unref(visibleRegister)) {
			delete params.userName
			delete params.code
		}

		const res = await loginApi(params)

		localStorage.setItem('token', res.data.token)

		ElMessage.success('登录成功')

		await authStore.authInitial(res.data)

		router.push('./team')
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 注册
 */
const register = async () => {
	try {
		await validate()
		loading.value = true

		const params = cloneDeep(unref(formModel))
		params.code = Number(params.code)

		const res = await registerApi(params)

		ElMessage.success('注册成功')
		pageToOtherPage()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 重置密码
 */
const forget = async () => {
	try {
		await validateAccount()
		await validateEmail()
		await validatePassword()
		await validateCode()
		loading.value = true

		const params = cloneDeep(unref(formModel))
		params.code = Number(params.code)

		const res = await resetPasswordApi(params)

		ElMessage.success('重置成功')
		pageToOtherPage()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 校验
 */
const validate = () => {
	validateAccount()
	validateUserName()
	validateEmail()
	validatePassword()
	validateCode()
}

watch(
	() => props.statusType,
	(type) => {
		resetFormModel()
	}
)

watch(
	() => props.loginType,
	(type) => {
		resetFormModel()
	}
)

// 页面加载检查是否需要恢复倒计时
onMounted(() => {
	const lastSend = Number(localStorage.getItem(ConstanEnum.STORAGE_KEY))
	if (_.isNumber(lastSend) && !_.isNaN(lastSend)) {
		const elapsed = Math.floor((_.now() - lastSend) / 1000)
		if (elapsed < ConstanEnum.DURATION) {
			startCountdown(ConstanEnum.DURATION - elapsed)
		} else {
			localStorage.removeItem(ConstanEnum.STORAGE_KEY)
		}
	}
})
</script>

<style lang="scss" scoped>
.login_body {
	:deep .login_body_username {
		display: flex;
		align-items: center;
		transition: all 0.3s;

		.el-input__wrapper {
			box-shadow: none;
			border-bottom: 1px solid #dcdfe6;
			border-radius: 0;

			&:focus-within {
				border-radius: 4px;
				border: 1px solid #1c7ffe;
			}
		}
	}

	.login_body_forget {
		margin-bottom: 30px;
		font-size: 16px;
		color: #8e8e8e;
		text-align: right;
		line-height: 15px;
		cursor: pointer;

		&:hover {
			opacity: 0.8;
		}
	}

	.login_body_button {
		display: flex;
		justify-content: center;

		.login_body_quicklogin {
			width: 280px;
			height: 50px;
		}
	}

	.login_body_register {
		display: flex;
		justify-content: center;
		align-items: center;

		.login_body_reg_register {
			font-size: 14pt;
			color: #1c7ffe;

			&:hover {
				opacity: 0.8;
			}
		}
	}

	/* 动画定义 */
	.slide-left-enter-active,
	.slide-left-leave-active {
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
		width: 100%;
	}
	.slide-left-enter-from {
		transform: translateX(100%);
		opacity: 1;
	}
	.slide-left-enter-to {
		transform: translateX(0);
		opacity: 1;
	}
	.slide-left-leave-from {
		transform: translateX(0);
		opacity: 1;
	}
	.slide-left-leave-to {
		transform: translateX(-100%);
		opacity: 1;
	}

	.slide-right-enter-active,
	.slide-right-leave-active {
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
		width: 100%;
	}
	.slide-right-enter-from {
		transform: translateX(-100%);
		opacity: 1;
	}
	.slide-right-enter-to {
		transform: translateX(0);
		opacity: 1;
	}
	.slide-right-leave-from {
		transform: translateX(0);
		opacity: 1;
	}
	.slide-right-leave-to {
		transform: translateX(100%);
		opacity: 1;
	}
}
</style>
