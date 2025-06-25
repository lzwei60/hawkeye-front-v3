<template>
	<div
		v-if="!props.visibleEmpty"
		ref="echartRef"
		v-element-size="debouncedResizeCallback"
		class="w-[100%] h-[100%]"></div>

	<div v-else>
		<el-empty description="暂无数据">
			<template #image>
				<Icon-ep-data-line />
			</template>
		</el-empty>
	</div>
</template>

<script setup>
import * as echarts from 'echarts'
import { merge, debounce } from 'lodash-es'

defineOptions({
	name: 'barCharts',
})

const props = defineProps({
	/**
	 * 是否空数据
	 */
	visibleEmpty: {
		type: Boolean,
		default: false,
	},
	/**
	 * 提示框
	 */
	tooltip: {
		type: Object,
		default: () => {},
	},
	/**
	 * tooltip 的 formatter
	 */
	tooltipFormatter: {
		type: Function,
	},
	grid: {
		type: Object,
		default: () => {},
	},
	xAxis: {
		type: Object,
		default: () => {},
	},
	// X轴数据
	xAxisData: {
		type: Array,
		default: null,
	},
	yAxis: {
		type: Object,
		default: () => {},
	},
	legend: {
		type: Object,
		default: () => {},
	},
	// 图例组件数据
	legendData: {
		type: Array,
		default: () => [],
	},
	// 数据展示集
	series: {
		type: Function,
	},
	dataset: {
		type: [Array, Object],
	},
	otherOptions: {
		type: Object,
		default: () => {},
	},
	// 是否需要数据缩放
	dataZoom: {
		type: Boolean,
		default: true,
	},
	// 是否需要工具箱-下载
	toolbox: {
		type: Boolean,
		default: true,
	},
	/** 是否合并数据 */
	notMerge: {
		type: Boolean,
		default: false,
	},
	/** 是否懒加载数据 */
	lazyUpdate: {
		type: Boolean,
		default: false,
	},
	// 是否需要计算数据最小值
	needMin: {
		type: Boolean,
		default: true,
	},
})

// echart实例-dom
const echartRef = ref()

// 图表实例
const echartInstance = ref()

/**
 * 初始化 图表 配置
 */
const chartOptions = computed(() => {
	// 提示框组件
	const tooltip = merge(
		{
			trigger: 'axis',
			backgroundColor: 'rgba(255,255,255)',
			borderColor: 'rgba(147, 235, 248, .8)',
			padding: 10,
			extraCssText: 'box-shadow:  0px 0px 12px 0px rgba(198, 198, 198, 0.25);',
			textStyle: {
				color: '#000000',
			},
			appendToBody: true,
		},
		props.tooltip
	)
	// 直角坐标系内绘图网格
	const grid = merge(
		{
			left: '2%',
			right: '5%',
			bottom: '15%',
			top: '25%',
			containLabel: true,
		},
		props.grid
	)
	// 直角坐标系 grid 中的 x 轴
	const xAxisConfig = {
		type: 'category',
		// 坐标轴轴线相关设置
		axisLine: {
			lineStyle: {
				color: '#979797',
				fontSize: 12,
			},
			onZero: false,
		},
		// 坐标轴刻度标签的相关设置
		axisLabel: {
			color: '#5b6066',
			fontSize: 12,
		},
		// 坐标轴刻度相关设置
		axisTick: {
			show: false,
		},
	}
	if (props.xAxisData) {
		xAxisConfig.data = props.xAxisData
	}
	const xAxis = merge(xAxisConfig, props.xAxis)
	// 直角坐标系 grid 中的 y 轴
	const yAxis = merge(
		{
			type: 'value',
			min: 0,
			minInterval: 1,
			// 坐标轴名称的文字样式
			nameTextStyle: {
				fontSize: 12,
				color: '#5b6066',
				align: 'center',
			},
			// 坐标轴在 grid 区域中的分隔线
			splitLine: {
				lineStyle: {
					color: '#f7f8fa',
					// type: 'dashed', // dotted 虚线
				},
			},
			// 坐标轴在 grid 区域中的分隔区域，默认不显示
			splitArea: { show: false },
			// 坐标轴轴线相关设置
			axisLine: {
				show: false,
			},
			// 坐标轴刻度相关设置
			axisTick: {
				show: false,
			},
			// 坐标轴刻度标签的相关设置
			axisLabel: {
				fontSize: 12,
				fontFamily: 'Bebas',
				color: '#5b6066',
			},
		},
		props.yAxis
	)
	// 图例显示每个系列的名称，让用户知道图表中各个系列代表的内容
	const legend = merge(
		{
			show: true,
			icon: 'circle',
			orient: 'horizontal',
			left: 'left',
			itemWidth: 12,
			itemHeight: 12,
			top: '6%',
			formatter: ['{a|{name}}'].join('\n'),
			// 图例的公用文本样式
			textStyle: {
				fontSize: 12,
				color: '#6A93B9',
				height: 8,
				rich: {
					a: {
						verticalAlign: 'bottom',
					},
				},
			},
			// 图例的数据数组
			// data: props.legendData,
		},
		props.legend
	)
	// 数据集
	const dataset = props.dataset

	// 基础配置
	let chartOptions = {
		// 提示框组件
		tooltip,
		// 直角坐标系内绘图网格
		grid,
		// 直角坐标系 grid 中的 x 轴
		xAxis,
		// 直角坐标系 grid 中的 y 轴
		yAxis,
		// 图例显示每个系列的名称，让用户知道图表中各个系列代表的内容
		legend,
		// 数据集
		dataset,
		// 折线/面积图系列
		series: [],
	}
	// 其它配置
	if (props.otherOptions) {
		chartOptions = merge(chartOptions, props.otherOptions)
	}

	// 设置是否需要缩放
	if (props.dataZoom) {
		chartOptions.dataZoom = [
			{
				show: true,
				realtime: true,
				start: 0,
				end: 100,
			},
			{
				type: 'inside',
				start: 0,
				end: 100,
			},
		]
	}

	// 设置数据集
	if (props.series) {
		chartOptions.series = props.series()
	}

	// 设置 y 轴最小值
	if (props.needMin) {
		const minValues = chartOptions.series.map((item) => {
			const datasetIndex = item.datasetIndex || 0
			const dataItem = Array.isArray(dataset) ? dataset[datasetIndex] : dataset
			const dimensions = item?.dimensions || dataItem?.dimensions || []
			const source = dataItem?.source || []
			const values = source
				.flatMap((it) => dimensions.map((dim) => Number(it[dim])))
				.filter((it) => !isNaN(it))

			return Math.min(...values) || 0
		})

		const min = Math.min(...minValues) || 0
		yAxis.min = min >= 0 ? 0 : Math.floor(min / 10) * 10
	}

	// 设置 tooltip 的 formatter
	if (props.tooltipFormatter) {
		chartOptions.tooltip.formatter = props.tooltipFormatter
	}

	// 设置是否需要保存图表
	if (props.toolbox) {
		chartOptions.toolbox = {
			show: true,
			orient: 'vertical',
			left: 'right',
			feature: {
				// 保存图表
				saveAsImage: {
					show: true,
					title: '下载',
					pixelRatio: 2,
				},
			},
		}
	}

	return chartOptions
})

/**
 * 处理 echart
 */
const handleChart = () => {
	const chartDom = unref(echartRef)
	if (!unref(echartInstance)) {
		echartInstance.value = echarts.init(chartDom)
	}
	unref(echartInstance).setOption(
		unref(chartOptions),
		props.notMerge,
		props.lazyUpdate
	)
}

/**
 * 图表大小变化
 */
const debouncedResizeCallback = debounce(() => {
	unref(echartInstance)?.resize()
}, 300)

watch(
	() => chartOptions.value,
	() => {
		nextTick(() => {
			if (unref(echartRef)) {
				handleChart()
			}
		})
	},
	{
		deep: true,
	}
)

watch(
	() => props.visibleEmpty,
	(bool) => {
		if (!bool) {
			echartInstance.value = null
		}
	}
)

onMounted(() => {
	nextTick(() => {
		if (unref(echartRef)) {
			handleChart()
		}
	})
})
</script>
