// import Mock from 'mockjs'
function getRandomInRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChineseName() {
	const surnames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴']
	const names = ['伟', '芳', '娜', '敏', '静', '秀英', '丽', '强', '磊', '军']

	const surname = surnames[Math.floor(Math.random() * surnames.length)]
	const name1 = names[Math.floor(Math.random() * names.length)]
	const name2 =
		Math.random() > 0.5 ? names[Math.floor(Math.random() * names.length)] : ''

	return surname + name1 + name2
}

export default [
	{
		url: '/task/projectTotalData',
		type: 'get',
		response: () => {
			return {
				data: {
					code: 200,
					message: '成功',
					data: {
						all: getRandomInRange(200, 500),
						finish: getRandomInRange(100, 200),
						rate: getRandomInRange(1, 100),
						total: getRandomInRange(5, 50),
						avg: getRandomInRange(10, 50),
						none: getRandomInRange(30, 100),
					},
				},
			}
		},
	},

	{
		url: '/task/projectEmphasisData',
		type: 'get',
		response: () => {
			const data: any = []

			for (let i = 0; i < 10; i++) {
				data.push({
					taskId: i,
					executorName: randomChineseName(), // 随机生成
					taskName: '任务' + i,
					priority: getRandomInRange(0, 3),
				})
			}

			return {
				data: {
					code: 200,
					message: '成功',
					data: {
						filter: {
							overdue: getRandomInRange(0, 20),
							unfinish: getRandomInRange(0, 20),
							important: getRandomInRange(0, 20),
						},
						record: data,
					},
				},
			}
		},
	},

	{
		url: '/task/projectProgress',
		type: 'get',
		response: () => {
			const data: any = []

			for (let i = 0; i < 10; i++) {
				const taskTotal = getRandomInRange(50, 100)
				const taskUnDone = getRandomInRange(0, taskTotal)
				const taskDone = taskTotal - taskUnDone

				data.push({
					projectId: i,
					projectName: '项目' + i,
					userName: randomChineseName(), // 随机生成
					taskTotal,
					taskUnDone,
					taskDone,
				})
			}

			return {
				data: {
					code: 200,
					message: '成功',
					data,
				},
			}
		},
	},

	{
		url: '/task/projectOverdue',
		type: 'get',
		response: () => {
			const data: any = []

			for (let i = 0; i < 10; i++) {
				data.push({
					projectId: i,
					projectName: '项目' + i,
					taskOverdue: getRandomInRange(0, 20),
					userName: randomChineseName(), // 随机生成
				})
			}

			return {
				data: {
					code: 200,
					message: '成功',
					data,
				},
			}
		},
	},
]
