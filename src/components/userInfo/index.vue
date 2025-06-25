<template>
	<div class="flex items-center">
		<el-avatar src="" :size="80" />

		<div class="ml-[18px]">
			<div class="text-2xl font-bold mb-[18px]">廖志伟</div>

			<div class="text-gray-500 text-[14px]">462062531@qq.com</div>
		</div>
	</div>

	<el-divider />

	<div class="flex items-center">
		<PopoverSelect v-model="queryModel.projectId" :options="options">
			<template #reference>
				<el-button :icon="Filter" round>
					{{ projectName }}
				</el-button>
			</template>
		</PopoverSelect>

		<PopoverSelect
			v-model="queryModel.projectStatus"
			:search="false"
			:width="150"
			:options="projectStatusList">
			<template #reference>
				<el-button :icon="CollectionTag" round>{{
					projectStatusLabel
				}}</el-button>
			</template>
		</PopoverSelect>
	</div>

	<div class="mt-[18px] h-[calc(100%-180px)]">
		<el-collapse
			v-model="collapseActive"
			expand-icon-position="left"
			class="overflow-hidden overflow-y-auto h-[100%]">
			<el-collapse-item
				v-for="item in 5"
				:key="item"
				:name="item"
				:icon="CaretRight">
				<template #title="{ isActive }">
					<div class="flex items-center">
						<div class="text-[14px] font-bold">鹰眼</div>

						<div
							class="ml-[10px] bg-[#999999] rounded-[10px] m-w-[20px] h-[20px] l-h-[20px] flex items-center text-white px-[4px]">
							30
						</div>
					</div>
				</template>

				<div class="">
					<div class="">
						<OnceTask></OnceTask>

						<div class="ml-[40px]">
							<OnceTask></OnceTask>
						</div>
					</div>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script setup>
import { Filter, CollectionTag, CaretRight } from '@element-plus/icons-vue'
import PopoverSelect from '@/components/popoverSelect/index.vue'
import OnceTask from '@/components/onceTask/index.vue'

defineOptions({
	name: 'UserInfo',
})

const queryModel = reactive({
	projectId: 1,
	projectStatus: 1,
})

const projectName = computed(() => {
	return options.value.find((item) => item.value === queryModel.projectId).label
})
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

const projectStatusList = ref([
	{ label: '未开始', value: 0 },
	{ label: '进行中', value: 1 },
	{ label: '已完成', value: 2 },
	{ label: '已延期', value: 3 },
])
const projectStatusLabel = computed(() => {
	return projectStatusList.value.find(
		(item) => item.value === queryModel.projectStatus
	).label
})

const collapseActive = ref([1])
</script>
