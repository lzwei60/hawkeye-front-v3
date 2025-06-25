import { useRouter } from 'vue-router'

import dayjs from 'dayjs'
import docx from '@/assets/images/docx.svg'
import pdf from '@/assets/images/pdf.svg'
import xlsx from '@/assets/images/xlsx.svg'
import pptx from '@/assets/images/pptx.svg'
import zip from '@/assets/images/zip.svg'
import folder from '@/assets/images/folder.png'

export const useTask = () => {
	const router = useRouter()

	const priorityOptions = ref([
		{ value: 0, label: '最高', color: '#df3c2f' },
		{ value: 1, label: '较高', color: '#f5941d' },
		{ value: 2, label: '普通', color: '#999999' },
		{ value: 3, label: '较低', color: '#51b52f' },
	])

	// 放假日期
	const libertyDayOptions = [
		// 元旦（1天）
		'2025-01-01',

		// 春节（7天：1月28日-2月3日，含调休）
		'2025-01-28',
		'2025-01-29',
		'2025-01-30',
		'2025-01-31',
		'2025-02-01',
		'2025-02-02',
		'2025-02-03',
		'2025-02-04',

		// 清明节（3天：4月4日-4月6日，含周末）
		'2025-04-04',
		'2025-04-05',
		'2025-04-06',

		// 劳动节（5天：5月1日-5月5日，含调休）
		'2025-05-01',
		'2025-05-02',
		'2025-05-03',
		'2025-05-04',
		'2025-05-05',

		// 端午节（3天：6月10日-6月12日，含调休）
		'2025-05-31',
		'2025-06-01',
		'2025-06-02',

		// 中秋节（1天：10月06日，含调休）
		'2025-10-06',

		,
		// 国庆节（7天：10月1日-10月8日，含调休）
		'2025-10-01',
		'2025-10-02',
		'2025-10-03',
		'2025-10-04',
		'2025-10-05',
		'2025-10-06',
		'2025-10-07',
		'2025-10-08',
	]
	// 补班日期
	const workingDayOptions = [
		'2025-01-27',
		'2025-02-08',
		'2025-04-27',
		'2025-09-28',
		'2025-10-11',
	]

	const initTableData = ref([
		{
			taskId: 1,
			projectId: 1,
			taskName: '主测试任务',
			priority: 1,
			deadline: '2025-05-10',
			principal: 'liaozhiwei',
			creator: 'liaozhiwei',
			finishTime: '2025-05-10 12:00:00',
			createTime: '2025-05-10 12:00:00',
			taskStatus: 0,
			children: [
				{
					taskId: 2,
					projectId: 1,
					taskName: '子测试任务',
					priority: 1,
					deadline: '2025-05-10',
					principal: 'liaozhiwei',
					creator: 'liaozhiwei',
					finishTime: '2025-05-10 12:00:00',
					createTime: '2025-05-10 12:00:00',
					taskStatus: 0,
				},
			],
		},
		{
			taskId: 3,
			projectId: 1,
			taskName: '其他任务',
			priority: 1,
			deadline: '2025-04-10',
			principal: 'liaozhiwei',
			creator: 'liaozhiwei',
			finishTime: '2025-05-10 12:00:00',
			createTime: '2025-05-10 12:00:00',
			taskStatus: 0,
		},
		{
			taskId: 4,
			projectId: 1,
			taskName: '其他任务1',
			priority: 1,
			deadline: '2025-04-22',
			principal: 'liaozhiwei',
			creator: 'liaozhiwei',
			finishTime: '2025-05-10 12:00:00',
			createTime: '2025-05-10 12:00:00',
			taskStatus: 0,
		},
		{
			taskId: 5,
			projectId: 1,
			taskName: '其他任务2',
			priority: 1,
			deadline: '2025-04-22',
			principal: '',
			creator: 'liaozhiwei',
			finishTime: '2025-05-10 12:00:00',
			createTime: '2025-05-10 12:00:00',
			taskStatus: 0,
		},
		{
			taskId: 6,
			projectId: 1,
			taskName: '其他任务3',
			priority: 1,
			deadline: '',
			principal: '',
			creator: 'liaozhiwei',
			finishTime: '',
			createTime: '2025-05-10 12:00:00',
			taskStatus: 0,
		},
	])

	const initMemberList = ref([
		{ userId: 'liaozhiwei', userName: '廖志伟', headImg: '' },
		{
			userId: 'liaozhiwei1',
			userName: '廖志伟1',
			headImg: docx,
		},
		{
			userId: 'liaozhiwei2',
			userName: '廖志伟2',
			headImg: folder,
		},
		{
			userId: 'liaozhiwei3',
			userName: '廖志伟3',
			headImg: '',
		},
		{
			userId: 'liaozhiwei4',
			userName: '廖志伟4',
			headImg: pdf,
		},
		{
			userId: 'liaozhiwei5',
			userName: '廖志伟5',
			headImg: pptx,
		},
		{
			userId: 'liaozhiwei6',
			userName: '廖志伟6',
			headImg: xlsx,
		},
		{
			userId: 'liaozhiwei7',
			userName: '廖志伟7',
			headImg: zip,
		},
	])

	/**
	 * 判断目标时间是否已经过期（超过今天）
	 * @param targetTime 要判断的时间（字符串、Date 或 Dayjs 对象）
	 * @param mode 判断粒度："datetime" 表示精确到时分秒；"date" 表示只比较是否超过今天
	 * @returns true 表示过期，false 表示未过期
	 */
	const isExpired = (targetTime, mode) => {
		const now = dayjs()
		const target = dayjs(targetTime)

		if (mode === 'datetime') {
			return now.isAfter(target)
		}

		if (mode === 'date') {
			return now.isAfter(target.endOf('day'))
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
		libertyDayOptions,
		workingDayOptions,
		initTableData,
		initMemberList,

		isExpired,
		pageToProjectManager,
	}
}
