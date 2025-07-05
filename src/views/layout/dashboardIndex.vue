<template>
	<div class="dashboard-index bg-[#f0f7ff] w-[100vw] h-[100vh]">
		<div class="menu-box flex justify-between items-center h-[60px] bg-white">
			<div class="top-title border-r h-[60px] leading-[60px] pl-4 pr-4">
				<PopoverSelect
					v-model="teamId"
					:search="false"
					:options="teamList"
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
					<el-popover placement="bottom" :width="300" trigger="click">
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
									<span>（5）</span>
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

							<div class="notice-content pt-[10px] pb-[10px]">
								<div v-if="noticeList.length" class="content-list">
									<div
										class="flex items-center justify-start mb-[15px] text-[12px] last:mb-0"
										v-for="(item, index) in noticeList"
										:key="index">
										<div
											class="item-avatar flex items-center before:content-[''] before:w-[5px] before:h-[5px] before:bg-[#ff0000] before:rounded-full before:mr-[10px]">
											<el-avatar :size="32" :src="item.headImg" />
										</div>

										<div class="item-content ml-[10px] w-[100%]">
											<div class="content-title">
												<span class="text-[#1677ff]">{{ item.operator }}</span>

												<span>给你</span>

												<span>{{ item.operateMatters }}</span>
											</div>

											<div
												class="content-desc flex items-center justify-between">
												<div class="desc-title w-[135px] truncate">
													{{ item.operateContent }}
												</div>

												<div class="desc-time">{{ item.operateTime }}</div>
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
import { useAuth } from '@/hooks'
import { useAuthStoreWithOut } from '@/store/modules/auth'
import PopoverSelect from '@/components/popoverSelect/index.vue'

const route = useRoute()

const router = useRouter()

const { $changeTeamId, $userInfo, $teamList, $teamId } = useAuth()

const activeIndex = ref('1')

const menuList = ref([])

const teamId = ref(null)

const teamList = ref([])

const teamLabel = computed(() => {
	return teamList.value.find((item) => item.value === teamId.value)?.label
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

const noticeList = ref([])

const loading = ref(false)

/**
 * 标记已读
 */
const clearNotice = () => {
	try {
		loading.value = true
		// TODO: 请求
		noticeList.value = []
	} catch (err) {
		return Promise.reject(err)
	} finally {
		loading.value = false
	}
}

/**
 * 跳转到通知页面
 */
const pageToNotice = () => {
	router.push('/dashboard/notice')
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

// 初始化
const init = () => {
	getMenuList()
	teamList.value = unref($teamList)
	teamId.value = unref($teamId)
}

onMounted(() => {
	init()
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
