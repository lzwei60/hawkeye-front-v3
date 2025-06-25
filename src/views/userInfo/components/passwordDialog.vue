<template>
	<el-dialog v-model="modalVisible" title="修改密码" width="500">
		<el-form
			label-width="90px"
			:model="formModel"
			:rules="formRules"
			ref="formRef">
			<el-form-item label="旧密码" prop="oldPwd">
				<el-input v-model="formModel.oldPwd" placeholder="请输入旧密码" />
			</el-form-item>

			<el-form-item label="新密码" prop="newPwd">
				<el-input v-model="formModel.newPwd" placeholder="请输入新密码" />
			</el-form-item>

			<el-form-item label="确认密码" prop="towPwd">
				<el-input v-model="formModel.towPwd" placeholder="请输入新密码" />
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="cancle">取消</el-button>

				<el-button :loading="btnLoading" type="primary" @click="confirm">
					确认
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { emailRE } from '@/utils/validate'
defineOptions({
	name: 'passwordDialog',
})

const emits = defineEmits('confirm', 'cancle')

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
})

// 邮箱数据
const formModel = ref({
	oldPwd: '',
	newPwd: '',
	towPwd: '',
})

/**
 * 二次密码确认校验
 */
const checkPwd = (rule, val, callback) => {
	if (!val) callback()

	if (val !== formModel.value.newPwd) {
		callback(new Error('两次密码输入不一致'))
	}
	callback()
}

const formRules = ref({
	oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
	newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
	towPwd: [
		{ required: true, message: '请输入确认密码', trigger: 'blur' },
		{ validator: checkPwd, trigger: 'blur' },
	],
})

// 加载状态
const btnLoading = ref(false)

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
		const { newEmail, newCode } = unref(formModel)
		await formValidate()
		// TODO: 校验密码是否正确
		emits('confirm', formModel.value)
		cancle()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		btnLoading.value = false
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
			formClearValidate()
		}
	},
	{
		immediate: true,
	}
)
</script>
