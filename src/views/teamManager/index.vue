<template>
	<div class="team-manager">
		<div class="team-manager__header">
			<div class="header-left">
				<div class="header-left__logo">
					<img src="@/assets/images/logo.png" alt="" />
				</div>

				<div class="header-left__title">鹰眼任务系统</div>
			</div>

			<div class="header-right">
				<div class="header-right__avatar">
					<el-avatar :size="32" :src="userInfo.userHead" />
				</div>

				<div class="header-right__name">{{ userInfo.userName }}</div>

				<div class="header-right__logout" @click="logout">退出登录</div>
			</div>
		</div>

		<div class="team-manager__content">
			<div class="manager-box">
				<div class="content-tabs">
					<div class="tabs-box">
						<div
							v-if="!tabsCreate"
							class="tabs-item"
							:class="{ 'tabs-active': tabsValue === 'check' }"
							@click="changeTabs('check')">
							选择团队
						</div>

						<div
							v-if="!tabsCreate"
							class="tabs-item"
							:class="{ 'tabs-active': tabsValue === 'join' }"
							@click="changeTabs('join')">
							加入团队？
						</div>

						<div
							v-if="tabsCreate"
							class="tabs-item"
							:class="{ 'tabs-active': tabsValue === 'join' }">
							创建团队
						</div>
					</div>

					<div
						v-if="!tabsCreate"
						class="tabs-button"
						@click="changeTabs('create')">
						创建团队
					</div>
				</div>

				<div class="content-box">
					<el-select
						v-if="tabsCheck"
						v-model="checkTeamId"
						placeholder="请选择团队">
						<el-option
							v-for="item in itemList"
							:label="item._teamName"
							:value="item._itemId" />
					</el-select>

					<div class="content-input" v-else-if="tabsJoin">
						<div class="create-label">团队编码</div>

						<el-input v-model="teamCode" placeholder="请输入团队编码" />
					</div>

					<div v-else class="content-input">
						<div class="create-label">团队名称</div>

						<el-input v-model="teamName" placeholder="请输入团队名称" />
					</div>
				</div>

				<div class="content-button">
					<el-button
						v-if="tabsCheck"
						:loading="loading"
						type="primary"
						@click="clickTeam"
						>进入团队</el-button
					>

					<el-button
						v-else-if="tabsJoin"
						:loading="loading"
						type="primary"
						@click="joinItem"
						>加入团队</el-button
					>

					<template v-else>
						<el-button @click="cancleCreate">取消</el-button>

						<el-button type="primary" :loading="loading" @click="createTeam">
							创建团队
						</el-button>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户基本信息
const userInfo = reactive({
	userName: '廖志伟',
	userHead: '',
})

// 当前操作 tabs 状态，check选择团队 join加入团队 create创建团队
const tabsValue = ref('check')

// 判断当前 tabs 状态是否为选择团队
const tabsCheck = computed(() => unref(tabsValue) === 'check')

// 判断当前 tabs 状态是否为加入团队
const tabsJoin = computed(() => unref(tabsValue) === 'join')

// 判断当前 tabs 状态是否为创建团队
const tabsCreate = computed(() => unref(tabsValue) === 'create')

// 当前用户所属团队列表
const itemList = ref([])

// 选择团队
const checkTeamId = ref('')

// 团队编码
const teamCode = ref('')

// 团队名称
const teamName = ref('')

/**
 * 退出登录
 */
const logout = () => {
	// TODO: 需要清空本地存储
	router.push('/login')
}

// 加载状态
const loading = ref(false)

/**
 * 切换 tabs
 */
const changeTabs = (tab) => {
	tabsValue.value = tab
	teamCode.value = ''
	teamName.value = ''
}

/**
 * 进入团队
 */
const clickTeam = () => {
	try {
		loading.value = true
		router.push('/dashboard/projectManager')
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 加入团队
 */
const joinItem = () => {
	try {
		loading.value = true
		if (unref(teamCode).trim() === '') {
			throw new Error('团队编码不能为空')
		}

		// TODO: 加入团队接口
		// const res = await joinTeam(unref(teamCode))
		if (res.code === 200) {
			changeTabs('check')
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 取消创建团队
 */
const cancleCreate = () => {
	tabsValue.value = 'check'
	teamName.value = ''
}

/**
 * 创建团队
 */
const createTeam = () => {
	loading.value = true
	if (unref(teamName).trim() === '') {
		throw new Error('团队名称不能为空')
	}

	// TODO: 创建团队接口
	// const res = await joinTeam(unref(teamCode))
	if (res.code === 200) {
		changeTabs('check')
	}
}
</script>

<style lang="scss" scoped>
.team-manager {
	width: 100%;
	height: 100%;
	background-color: #f0f7ff;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	.team-manager__header {
		height: 54px;
		width: 100%;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.header-left {
			display: flex;
			padding: 0 20px;
			align-items: center;
			border-right: 1px solid #e0e0e0;
			height: 100%;

			.header-left__logo {
				margin-right: 10px;

				& img {
					width: 32px;
					height: 32px;
				}
			}

			.header-left__title {
				font-size: 16px;
				color: #000000;
			}
		}

		.header-right {
			display: flex;
			align-items: center;

			.header-right__avatar {
				margin-top: 5px;
			}

			.header-right__name {
				font-size: 16px;
				color: #888888;
				margin: 0 10px;
			}

			.header-right__logout {
				height: 100%;
				padding: 15px 30px;
				background-color: #1677ff;
				color: #ffffff;
				cursor: pointer;

				&:hover {
					opacity: 0.8;
				}
			}
		}
	}

	.team-manager__content {
		width: 450px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center; /* 垂直居中 */
		min-height: calc(100% - 54px);

		.manager-box {
			background-color: #ffffff;
			border-radius: 12px;

			.content-tabs {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 20px;
				border-bottom: 1px solid #e0e0e0;

				.tabs-box {
					padding: 20px 20px 0;
					display: flex;
					align-items: center;

					.tabs-item {
						margin-right: 12px;
						cursor: pointer;

						&:hover {
							color: #1677ff;
						}
					}

					.tabs-active {
						color: #1677ff;
					}
				}

				.tabs-button {
					padding: 18px 18px 0;
					font-size: 12px;
					color: #1677ff;
					cursor: pointer;

					&:hover {
						opacity: 0.8;
					}
				}
			}

			.content-box {
				padding: 20px;

				.content-input {
					display: flex;
					align-items: center;

					.create-label {
						min-width: 80px;
					}
				}
			}

			.content-button {
				padding: 0 18px 25px;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
}
</style>
