<template>
	<div class="dashboard-index bg-[#f0f7ff] w-[100vw] h-[100vh]">
		<div class="menu-box flex justify-between items-center h-[60px] bg-white">
			<div class="top-title border-r h-[60px] leading-[60px] pl-4 pr-4">
				<PopoverSelect
					v-model="$teamId"
					:search="false"
					:options="$teamList"
					@change="changeTeam">
					<template #reference>
						<div class="w-[220px] truncate cursor-pointer">{{ teamLabel }}</div>
					</template>
				</PopoverSelect>
			</div>

			<div class="top-menu flex-1">
				<el-menu
					:default-active="activeIndex"
					class="el-menu-demo"
					mode="horizontal"
					@select="handleSelect">
					<template
						v-for="(item, index) in menuList"
						:key="`/dashboard/${item.path}`">
						<el-menu-item
							v-if="!item.children"
							:index="`/dashboard/${item.path}`">
							{{ item.meta.title }}
						</el-menu-item>

						<el-sub-menu v-else :index="index">
							<template #title>{{ item.meta.title }}</template>

							<el-menu-item
								v-for="list in item.children"
								:key="`/dashboard/${list.path}`"
								:index="`/dashboard/${list.path}`">
								{{ list.meta.title }}
							</el-menu-item>
						</el-sub-menu>
					</template>
				</el-menu>
			</div>

			<div class="top-base flex items-center justify-center">
				<div class="base-notice mr-[20px] cursor-pointer">
					<el-popover
						ref="popoverNoticeRef"
						placement="bottom"
						:width="300"
						trigger="click">
						<template #reference>
							<el-badge
								:value="noticeList.length"
								:hidden="!noticeList.length"
								:max="99"
								class="item">
								<Icon-ep-bell class="text-[16px]" />
							</el-badge>
						</template>

						<div class="notice-box">
							<div
								class="notice-top flex justify-between items-center pb-[10px] border-b">
								<div class="top-title text-[14px]">
									通知
									<span>（{{ noticeTotal }}）</span>
								</div>

								<el-button
									:loading="loading"
									type="info"
									link
									size="small"
									@click="clearNotice">
									标记全部已读
								</el-button>
							</div>

							<div
								class="notice-content pt-[10px] pb-[10px] h-[200px] overflow-auto">
								<div v-if="noticeList.length" class="content-list">
									<div
										class="flex items-center justify-start mb-[15px] text-[12px] last:mb-0"
										v-for="(item, index) in noticeList"
										:key="item.noticeId">
										<div
											class="item-avatar flex items-center before:content-[''] before:w-[5px] before:h-[5px] before:bg-[#ff0000] before:rounded-full before:mr-[10px]">
											<el-avatar
												:size="32"
												:src="
													findObjectLabel(
														item.sendUserId,
														'userId',
														$teamUserList
													)?.userHead || ''
												" />
										</div>

										<div class="item-content ml-[10px] w-[100%]">
											<div class="content-title">
												<span class="text-[#1677ff]">{{
													$getUserNickName(item.sendUserId)
												}}</span>

												<span>{{ item.noticationContent }}</span>
											</div>

											<div
												class="content-desc flex items-center justify-between">
												<div class="desc-time">
													{{ item.noticationTime.split(' ')[1] }}
												</div>
											</div>
										</div>
									</div>
								</div>

								<div v-else class="content-empty">
									<el-empty :image-size="100" description="暂无通知" />
								</div>
							</div>

							<div class="notice-bottom pt-[10px] border-t">
								<el-button type="info" link size="small" @click="pageToNotice">
									查看全部通知
								</el-button>
							</div>
						</div>
					</el-popover>
				</div>

				<el-popover placement="bottom-end" :width="100" trigger="hover">
					<template #reference>
						<div
							class="base-user flex items-center justify-center pl-[20px] pr-[20px] text-[#ffffff] bg-[#1677ff] h-[60px]">
							<div class="user-avatar mt-[5px] mr-[10px]">
								<el-avatar :size="32" :src="$userInfo.userHead" />
							</div>

							<div class="user-name font-medium">{{ $userInfo.userName }}</div>
						</div>
					</template>

					<div class="user-popover">
						<div
							class="popover-item p-[10px] border-b cursor-pointer hover:bg-blue-100 hover:text-[#ffffff]"
							@click="pageToUserInfo">
							个人中心
						</div>
						<div
							class="popover-item p-[10px] cursor-pointer hover:bg-blue-100 hover:text-[#ffffff]"
							@click="logout">
							退出登录
						</div>
					</div>
				</el-popover>
			</div>
		</div>

		<div
			class="content-box m-[20px] ml-[150px] mr-[150px] h-[calc(100vh-64px-40px)] bg-white shadow-[0_0px_25px_-5px_rgba(0,0,0,0.2),_0_8px_10px_-6px_rgba(0,0,0,0.1)] rounded p-[18px] overflow-hidden">
			<router-view v-if="viewKey"></router-view>
		</div>
	</div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuth } from '@/hooks'
import { useAuthStoreWithOut } from '@/store/modules/auth'
import PopoverSelect from '@/components/popoverSelect/index.vue'
import {
	getSelectNoticeApi,
	markAllNoticesAsReadApi,
} from '@/api/modules/notice.js'

const route = useRoute()

const router = useRouter()

const {
	$changeTeamId,
	$userInfo,
	$teamList,
	$teamId,
	$teamUserList,
	$getUserNickName,
} = useAuth()

const activeIndex = ref('1')

const menuList = ref([])

const teamLabel = computed(() => {
	return $teamList.value.find((item) => item.value === $teamId.value)?.label
})

/**
 * 获取路由
 */
const getMenuList = () => {
	const routerList = router.getRoutes()
	const list = routerList.find((item) => item.path === '/dashboard')?.children

	const routes = list.filter((item) => item.meta.menu)

	menuList.value = nestRoutes(routes)
}

/**
 * 嵌套路由处理
 */
const nestRoutes = (routes) => {
	const routeMap = new Map()
	const result = []

	// 1. 先构建 routeMap
	for (const route of routes) {
		routeMap.set(route.path, { ...route, children: [] })
	}

	// 2. 构建嵌套结构
	for (const route of routes) {
		const parentId = route.meta?.parentId
		if (parentId && routeMap.has(parentId)) {
			routeMap.get(parentId).children.push(routeMap.get(route.path))
		} else if (!parentId) {
			result.push(routeMap.get(route.path))
		}
	}

	// 3. 清理空 children
	const cleanEmptyChildren = (routes) => {
		return routes.map((route) => {
			const newRoute = { ...route }
			if (newRoute.children && newRoute.children.length === 0) {
				delete newRoute.children
			} else if (newRoute.children) {
				newRoute.children = cleanEmptyChildren(newRoute.children)
			}
			return newRoute
		})
	}

	return cleanEmptyChildren(result)
}

/**
 * 激活菜单
 */
const handleSelect = (item) => {
	router.push(item)
}

const viewKey = ref(true)

/**
 * 切换团队
 */
const changeTeam = (id) => {
	$changeTeamId(id)
	viewKey.value = false
	setTimeout(() => {
		viewKey.value = true
	}, 0)
}

/**
 * 跳转到个人中心页面
 */
const pageToUserInfo = () => {
	router.push('/dashboard/userInfo')
}

/**
 * 退出登录
 */
const logout = () => {
	router.push('/login')
	const authStore = useAuthStoreWithOut()
	authStore.authLoginOut(true)
}

// 动态通知加载状态
const loading = ref(false)

/**
 * 标记已读
 */
const clearNotice = async () => {
	try {
		loading.value = true
		await markAllNoticesAsReadApi()
		ElMessage.success('全部标记成功')
		await getNoticeData()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

// 通知窗口 dom
const popoverNoticeRef = ref()

/**
 * 跳转到通知页面
 */
const pageToNotice = () => {
	popoverNoticeRef.value && popoverNoticeRef.value.hide()
	router.push('/dashboard/notice')
}

// 通知信息
const noticeList = ref([])

// 通知信息总数
const noticeTotal = ref(0)

/**
 * 获取对象label
 */
const findObjectLabel = (id, key, options) => {
	const item = options.find((item) => item[key] === id)
	return item
}

// 通知计时器
const noticeTimer = ref(null)

/**
 * 通知计时器函数
 */
const NoticeSetInterval = async () => {
	try {
		if (unref(noticeTimer)) return // 防止重复启动

		noticeTimer.value = setInterval(async () => {
			await getNoticeData()
		}, 1000 * 60)
	} catch (err) {
		return Promise.reject(err)
	}
}

/**
 * 获取通知数据
 */
const getNoticeData = async () => {
	try {
		const params = {
			page: 1,
			limit: 20,
			isRead: 0,
		}
		const { data: res } = await getSelectNoticeApi(params)
		noticeTotal.value = res.total || 0
		noticeList.value = res.list || []
	} catch (err) {
		return Promise.reject(err)
	}
}

// 初始化
const init = () => {
	getMenuList()
}

onMounted(async () => {
	init()
	await getNoticeData()
	NoticeSetInterval()
})

onBeforeUnmount(() => {
	if (unref(noticeTimer)) {
		clearInterval(noticeTimer.value)
		noticeTimer.value = null
	}
})

watch(
	() => route,
	() => {
		activeIndex.value = route.query?.menuActive || route.path
	},
	{
		deep: true,
		immediate: true,
	}
)
</script>

<style lang="scss" scoped>
.dashboard-index {
	:deep .top-menu {
		.el-menu--horizontal {
			justify-content: center;
			border-bottom: none;
		}
	}

	:deep .top-base {
		.el-popper {
			padding: 0;
		}
	}
}
</style>
