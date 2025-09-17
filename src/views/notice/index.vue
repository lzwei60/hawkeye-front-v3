<template>
	<div class="mb-[18px] flex items-center justify-between">
		<div class="flex-1"></div>
		<div class="text-[28px] font-bold">全部通知</div>
		<div
			class="flex-1 flex items-center justify-end text-[#666666] cursor-pointer"
			@click="setAllNoticeRead">
			<Icon-ep-check class="ml-[10px] text-[#999999]" />
			<span class="ml-[6px]">全部标记为已读</span>
		</div>
	</div>

	<div
		v-infinite-scroll="infiniteScroll"
		v-loading="pageLoading"
		class="overflow-auto h-[calc(100%-50px)]">
		<template v-if="noticesData.length">
			<div class="mb-[18px] last:mb-0">
				<div
					v-for="item in noticesData"
					:key="item.noticeId"
					class="flex items-center px-[80px] mb-[18px] last:mb-0"
					:class="[item.isRead === 1 && 'opacity-50']"
					@click="setNoticeRead(item)">
					<div class="text-[#7f7f7f] text-[12px] mr-[18px]">
						{{ item.noticationTime.split(' ')[1] }}
					</div>

					<el-avatar
						class="mr-[18px]"
						:src="
							findObjectLabel(item.sendUserId, 'userId', teamMemberList)
								?.userHead || ''
						"
						:size="50" />

					<div class="text-[14px] font-bold mr-[18px]">
						{{ $getUserNickName(item.sendUserId) }}
					</div>

					<div class="text-[14px] mr-[18px]">
						{{ item.noticationContent }}
					</div>
				</div>
			</div>

			<div v-if="scrollLoading" class="text-[14px] text-center text-[#1677ff]">
				加载中...
			</div>

			<el-divider v-if="noMore">
				<div class="text-[14px] text-center text-[#999999]">我也是有底线的</div>
			</el-divider>
		</template>

		<el-empty v-else description="暂无动态数据"></el-empty>
	</div>
</template>

<script setup>
import { cloneDeep } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { useTeam, useAuth } from '@/hooks'
import {
	getSelectNoticeApi,
	markAllNoticesAsReadApi,
	markOnceNoticesAsReadApi,
} from '@/api/modules/notice.js'
import PopoverSelect from '@/components/popoverSelect/index.vue'
import calendar from '@/utils/lunarDay'

const { initMemberList } = useTeam()

const { $teamId, $teamUserList, $projectList, $getUserNickName, $userMap } =
	useAuth()

const QUERY_FROM_MODEL = {
	page: 1,
	limit: 20,
}

// 筛选数据
const queryFormModel = reactive(cloneDeep({ ...QUERY_FROM_MODEL }))

// 团队成员
const teamMemberList = computed(() => {
	return [
		{ userId: '', userName: '所有成员', headHead: '' },
		...unref($teamUserList),
	]
})

/**
 * 获取对象label
 */
const findObjectLabel = (id, key, options) => {
	const item = options.find((item) => item[key] === id)
	return item
}

// 页面加载
const pageLoading = ref(false)

// 滚动加载状态
const scrollLoading = ref(false)

// 暂无数据
const noMore = ref(false)

// 总数
const total = ref(0)

// 展示的数据
const noticesData = ref([])

/**
 * 滚动加载
 */
const infiniteScroll = () => {
	if (unref(scrollLoading) || unref(noMore)) return
	queryFormModel.page++
	getLoadData()
}

/**
 * 全部标记为已读
 */
const setAllNoticeRead = async () => {
	try {
		pageLoading.value = true
		await markAllNoticesAsReadApi()
		ElMessage.success('全部标记成功')
		queryFormModel.value.page = 1
		noMore.value = false
		await getLoadData()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}

/**
 * 标记单个通知已读
 */
const setNoticeRead = async (notice) => {
	try {
		pageLoading.value = true
		if (notice.isRead === 1) return
		await markOnceNoticesAsReadApi({
			noticeId: notice.noticeId,
		})
		ElMessage.success('标记成功')
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}

/**
 * 获取动态加载数据
 */
const getLoadData = async () => {
	try {
		if (unref(queryFormModel).page === 1) {
			pageLoading.value = true
		} else {
			scrollLoading.value = true
		}

		const params = {
			...unref(queryFormModel),
		}
		if (unref(noMore)) return
		const { data: res } = await getSelectNoticeApi(params)
		noticesData.value.push(...res.list)
		total.value = res.total
		if (unref(noticesData).length === unref(total)) {
			noMore.value = true
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
		scrollLoading.value = false
	}
}

const init = () => {
	getLoadData()
}

onMounted(() => {
	init()
})
</script>

<style lang="scss" scoped></style>
