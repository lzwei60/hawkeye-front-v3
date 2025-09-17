import { useRouter } from 'vue-router'

import dayjs from 'dayjs'

export const useTask = () => {
	const router = useRouter()

	// 优先级
	const priorityOptions = ref([
		{ value: 0, label: '最高', color: '#df3c2f' },
		{ value: 1, label: '较高', color: '#f5941d' },
		{ value: 2, label: '普通', color: '#999999' },
		{ value: 3, label: '较低', color: '#51b52f' },
	])

	/**
	 * 判断目标时间是否已经过期（超过今天）
	 * @param targetTime 要判断的时间（字符串、Date 或 Dayjs 对象）
	 * @param deadlineTime 可选，截止时间（字符串、Date 或 Dayjs 对象），如果传则以它为判断基准，否则以当前时间
	 * @param mode 判断粒度："datetime" 表示精确到时分秒；"date" 表示只比较是否超过今天
	 * @returns true 表示过期，false 表示未过期
	 */
	const isExpired = (targetTime, deadlineTime, mode) => {
		const baseTime = deadlineTime ? dayjs(deadlineTime) : dayjs()
		const target = dayjs(targetTime)

		if (mode === 'datetime') {
			return baseTime.isAfter(target)
		}

		if (mode === 'date') {
			return baseTime.isAfter(target.endOf('day'))
		}

		return false
	}

	/**
	 * 跳转项目列表
	 */
	const pageToProjectManager = () => {
		router.push({
			path: '/dashboard/projectManager',
		})
	}

	return {
		priorityOptions,

		isExpired,
		pageToProjectManager,
	}
}
