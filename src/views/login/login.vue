<template>
	<div class="login_all">
		<div class="login_box">
			<loginParent
				:statusType="statusText"
				:loginType="loginType"
				@change="changeLoginType" />

			<div class="py-5 px-[100px]">
				<loginInput :statusType="statusText" :loginType="loginType" />
			</div>
		</div>
	</div>
</template>

<script setup>
import loginParent from './components/loginParent.vue'
import loginInput from './components/loginInput.vue'

// 登录、注册状态
const statusText = ref('login')
// 登录类型
const loginType = ref(1)

/**
 * 切换登录类型
 */
const changeLoginType = (type) => {
	loginType.value = type
}
</script>

<style lang="scss" scoped>
.login_all {
	width: 100%;
	height: 100%;
	background-color: #b1dcfe;
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;

	.login_box {
		background-color: #fff;
		border: 1px solid #cdf0ff;
		width: 585px;
		height: 660px;
		position: absolute;
		margin: auto;
		overflow: hidden;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 10px;
	}
}
</style>
