<template>
	<div class="mb-[18px] flex align-center">
		<div class="text-[14px]">筛选动态：</div>

		<PopoverSelect
			v-model="queryFormModel.projectId"
			:options="options"
			@change="changeProject">
			<template #reference>
				<div class="text-[14px] w-[200px] cursor-pointer hover:opacity-80">
					{{ selectLabel }}
				</div>
			</template>
		</PopoverSelect>

		<PopoverSelect
			ref="popoverUserRef"
			v-model="queryFormModel.userId"
			value-key="userId"
			label-key="userName"
			:options="teamMemberList">
			<template #reference>
				<div class="flex items-center justify-center cursor-pointer">
					<div v-if="!queryFormModel.userId">
						<Icon-ep-userFilled class="text-[#999999] text-[20px]" />
					</div>

					<el-avatar
						v-else
						:src="
							findObjectLabel(queryFormModel.userId, 'userId', teamMemberList)
								?.headImg || ''
						"
						size="small" />

					<span class="ml-[6px] text-[14px]">
						{{
							findObjectLabel(queryFormModel.userId, 'userId', teamMemberList)
								?.userName || ''
						}}
					</span>
				</div>
			</template>

			<template #item="{ item }">
				<div
					:key="item.userId"
					class="flex items-center justify-between p-[5px] hover:bg-[#f5f5f5]"
					@click="changeValue(item.userId)">
					<div class="flex items-center cursor-pointer">
						<div class="mt-[5px] mr-[15px]">
							<div v-if="!item.userId">
								<Icon-ep-userFilled class="text-[#999999] text-[20px]" />
							</div>

							<el-avatar
								v-else
								:src="
									findObjectLabel(item.userId, 'userId', teamMemberList)
										?.headImg || ''
								"
								size="small" />
						</div>
						<div class="">{{ item.userName }}</div>
					</div>

					<div
						v-if="queryFormModel.userId === item.userId"
						class="before:content-['✔'] before:text-[#51b52f]"></div>
				</div>
			</template>
		</PopoverSelect>
	</div>

	<div
		v-infinite-scroll="getLoadData"
		class="overflow-auto h-[calc(100%-50px)]">
		<div v-for="item in count" :key="item" class="mb-[18px] last:mb-0">
			<div class="px-[18px]">
				<div class="flex items-center">
					<div
						class="border-[4px] rounded-[50%] w-[70px] h-[70px] flex flex-col justify-center items-center">
						<div class="font-bold text-[146x] text-[#1677ff]">5/21</div>
						<div class="text-[#666666] text-[14px]">周三</div>
					</div>

					<el-divider class="flex-1" direction="horizontal" />

					<div class="ml-[10px] text-[#7f7f7f] text-[18px] font-bold">鹰眼</div>
				</div>
			</div>

			<div
				v-for="list in 5"
				:key="list"
				class="flex items-center px-[80px] mb-[18px] last:mb-0">
				<div class="text-[#7f7f7f] text-[12px] mr-[18px]">16:20</div>

				<el-avatar class="mr-[18px]" src="" :size="50" />

				<div class="text-[14px] font-bold mr-[18px]">廖志伟</div>

				<div class="text-[14px] mr-[18px]">动态描述：</div>

				<div class="text-[14px]">动态名称</div>
			</div>
		</div>

		<div v-if="pageLoading" class="text-[14px] text-center text-[#1677ff]">
			加载中...
		</div>

		<el-divider v-if="noMore">
			<div class="text-[14px] text-center text-[#999999]">我也是有底线的</div>
		</el-divider>
	</div>
</template>

<script setup>
import { cloneDeep } from 'lodash-es'
import { useTeam } from '@/hooks'
import PopoverSelect from '@/components/popoverSelect/index.vue'

const { initMemberList } = useTeam()

const QUERY_FROM_MODEL = {
	projectId: 1,
	userId: '',
	page: 1,
	limit: 10,
}

const options = ref([
	{ label: '项目1', value: 1 },
	{ label: '项目2', value: 2 },
	{ label: '项目3', value: 3 },
	{ label: '项目4', value: 4 },
	{ label: '项目5', value: 5 },
	{ label: '项目6', value: 6 },
	{ label: '项目7', value: 7 },
	{ label: '项目8', value: 8 },
	{ label: '项目9', value: 9 },
	{ label: '项目10', value: 10 },
])

// 筛选数据
const queryFormModel = reactive(cloneDeep({ ...QUERY_FROM_MODEL }))

// 筛选项目 ref
const popoverProjetRef = ref(null)

// 筛选项目 name
const selectLabel = computed(() => {
	return options.value.find(
		(item) => item.value === unref(queryFormModel).projectId
	)?.label
})

/**
 * 修改项目
 */
const changeProject = (value) => {
	resetFormModel()
}

// 团队成员
const teamMemberList = ref([
	{ userId: '', userName: '所有成员', headImg: '' },
	...unref(initMemberList),
])

// 筛选用户 ref
const popoverUserRef = ref(null)

/**
 * 获取对象label
 */
const findObjectLabel = (id, key, options) => {
	const item = options.find((item) => item[key] === id)
	return item
}

// 加载状态
const pageLoading = ref(false)

// 暂无数据
const noMore = ref(false)

const count = ref(5)

/**
 * 修改数据
 */
const changeValue = (value) => {
	resetFormModel()
	queryFormModel.userId = value
	popoverUserRef.value && popoverUserRef.value.hide()
}

/**
 * 重置表单
 */
const resetFormModel = () => {
	queryFormModel.page = 1
	queryFormModel.limit = 10
}

/**
 * 获取动态加载数据
 */
const getLoadData = async () => {
	try {
		pageLoading.value = true
		await setTimeout(() => {
			count.value += 2
		}, 2000)

		if (count.value >= 20) {
			noMore.value = true
		}
	} catch (err) {
		return Promise.reject(err)
	} finally {
		pageLoading.value = false
	}
}
</script>

<style lang="scss" scoped></style>
