<template>
	<div class="login_head">
		<div class="login_head_title pt-12 pb-12">
			<div class="login_head_title_logo mr-5"></div>

			<div class="login_head_title_text text-2xl">鹰眼任务管理系统</div>
		</div>

		<div class="login_head_mode">
			<div v-if="visibleLogin" class="login_head_mode_tag text-2xl">
				<div
					class="login_head_mode_tag_item"
					:class="{ active: loginType === 1 }"
					@click="changeLoginType(1)">
					账号登录
				</div>

				<div
					class="login_head_mode_tag_item"
					:class="{ active: loginType === 2 }"
					@click="changeLoginType(2)">
					邮箱登录
				</div>
			</div>

			<div v-else class="login_head_mode_log text-2xl">账号注册</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	// 状态
	statusType: {
		type: String,
		default: 'login',
	},
	// 登录类型 1：账号 2：邮箱
	loginType: {
		type: Number,
		default: 1,
	},
})

const emits = defineEmits(['change'])

const visibleLogin = computed(() => props.statusType === 'login')

const changeLoginType = (type) => {
	emits('change', type)
}
</script>

<style lang="scss" scoped>
.login_head {
	width: 100%;
	background-color: #b1dcfe;
	position: relative;

	.login_head_title {
		display: flex;
		justify-content: center;

		.login_head_title_logo {
			width: 60px;
			height: 60px;
			float: left;
			background: url(../../../assets/images/logo1.png) no-repeat;
			background-size: 100%;
		}

		.login_head_title_text {
			color: #fff;
			letter-spacing: 3px;
		}
	}

	.login_head_mode {
		color: #fff;

		.login_head_mode_tag {
			display: flex;
			justify-content: space-around;
			align-items: center;

			.login_head_mode_tag_item {
				cursor: pointer;
				transition: all 0.3s;
				border-bottom: 2px solid #b1dcfe;
				flex: 1;
				text-align: center;
				border-bottom-right-radius: 4px;
				border-bottom-left-radius: 4px;

				&:hover {
					border-bottom: 2px solid #1677ff;
				}
			}

			.active {
				border-bottom: 2px solid #1677ff;
			}
		}

		.login_head_mode_log {
			width: 100%;
			text-align: center;
		}
	}
}
</style>
