<template>
	<el-popover
		ref="popoverRef"
		:placement="placement"
		:width="width"
		:trigger="trigger"
		:props="popoverProps"
		@after-leave="closePopover">
		<template #reference>
			<slot v-if="hasReferenceSlot" name="reference" />

			<el-button v-else :icon="Filter" round>Search</el-button>
		</template>

		<div class="max-h-[200px] overflow-hidden overflow-y-auto pr-[10px]">
			<div
				v-if="search"
				class="flex items-center pb-[10px] border-b mb-[40px] fixed bg-white"
				:style="{
					width: `${width - 40}px`,
				}">
				<Icon-ep-search class="text-[#999999] text-[14px] mr-2.5" />

				<el-input
					class="flex-1"
					v-model.trim="searchValue"
					placeholder="请输入搜索内容"
					@input="filterValue" />
			</div>

			<div :class="search ? 'mt-[45px]' : ''">
				<template v-for="(item, index) in selectOptions" :key="item[valueKey]">
					<slot v-if="hasItemSlot" name="item" :item="item" :index="index" />

					<div
						v-else
						class="flex items-center justify-between p-[10px] hover:bg-[#f5f5f5] cursor-pointer"
						@click="changeValue(item)">
						<div class="text-[14px]">
							{{ item[labelKey] }}
						</div>

						<div
							v-if="modelValue === item[valueKey]"
							class="before:content-['✔'] before:text-[#1677ff]"></div>
					</div>
				</template>
			</div>
		</div>
	</el-popover>
</template>

<script setup>
import { useSlots } from 'vue'
import { Filter } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'

const slots = useSlots()

const emits = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
	modelValue: {
		type: Number || String,
	},
	options: {
		type: Array,
		default: () => [],
	},
	valueKey: {
		type: String,
		default: 'value',
	},
	labelKey: {
		type: String,
		default: 'label',
	},
	search: {
		type: Boolean,
		default: true,
	},
	placemnet: {
		type: String,
		default: 'bottom',
	},
	width: {
		type: Number,
		default: 260,
	},
	trigger: {
		type: String,
		default: 'click',
	},
	popoverProps: {
		type: Object,
		default: () => ({}),
	},
})

defineOptions({
	name: 'PopoverSelect',
})

// 判断是否存在指定插槽
const hasReferenceSlot = !!slots.reference
const hasItemSlot = !!slots.item

// 选择列表
const selectOptions = ref([])

watch(
	() => props.options,
	(arr) => {
		selectOptions.value = cloneDeep(arr)
	},
	{
		deep: true,
		immediate: true,
	}
)

// 筛选内容
const searchValue = ref('')

/**
 * 模糊搜索
 */
const filterValue = () => {
	// 帮我写一个根据 searchValue 过滤 options的props.labelKey对应属性 的方法，模糊匹配
	// 例如：searchValue为 'a'，则过滤出所有labelKey属性中包含'a'的项
	selectOptions.value = props.options.filter((item) =>
		item[props.labelKey]
			.toLowerCase()
			.includes(unref(searchValue).toLowerCase())
	)
}

// 弹窗 dom
const popoverRef = ref()

/**
 * 选择数据
 */
const changeValue = (item) => {
	emits('update:modelValue', item[props.valueKey])
	emits('change', item[props.valueKey], item)
	hidePopover()
}

/**
 * 隐藏弹窗
 */
const hidePopover = () => {
	popoverRef.value && popoverRef.value.hide()
}

/**
 * 关闭弹窗
 */
const closePopover = () => {
	searchValue.value = ''
	filterValue()
}

defineExpose({
	hide: hidePopover,
})
</script>

<style lang="scss" scoped></style>
