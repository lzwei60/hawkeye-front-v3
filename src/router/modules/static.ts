const routes = [
	{
		path: '/',
		redirect: 'home',
		children: [
			{
				path: 'home',
				component: () => import('@/views/layout/index.vue'),
				meta: {
					title: '首页',
				},
			},
			{
				path: 'login',
				component: () => import('@/views/login/login.vue'),
				meta: {
					title: '登录',
				},
			},
			{
				path: 'register',
				component: () => import('@/views/login/register.vue'),
				meta: {
					title: '注册',
				},
			},
			{
				path: 'team',
				component: () => import('@/views/teamManager/index.vue'),
				meta: {
					title: '团队管理',
				},
			},
			{
				path: 'dashboard',
				component: () => import('@/views/layout/dashboardIndex.vue'),
				redirect: '/dashboard/projectManager',
				meta: {},
				children: [
					{
						path: 'projectManager',
						component: () => import('@/views/projectManager/index.vue'),
						meta: {
							title: '项目',
							menu: true,
						},
					},
					{
						path: 'projectOnce',
						component: () => import('@/views/projectManager/projectOnce.vue'),
						meta: {
							title: '单个项目',
						},
					},
					{
						path: 'teamUser',
						component: () => import('@/views/teamUser/index.vue'),
						meta: {
							title: '团队',
							menu: true,
						},
					},
					{
						path: 'teamUynamic',
						component: () => import('@/views/projectManager/index.vue'),
						meta: {
							title: '动态',
							menu: true,
						},
					},
					{
						path: 'teamStatistics',
						component: () => import('@/views/projectManager/index.vue'),
						meta: {
							title: '统计',
							menu: true,
						},
					},
					{
						path: 'mySelf',
						component: () => import('@/views/projectManager/index.vue'),
						meta: {
							title: '我自己',
							menu: true,
						},
					},
				],
			},
		],
	},
]

export default routes
