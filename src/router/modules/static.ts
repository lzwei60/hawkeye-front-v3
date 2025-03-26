const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home.vue'),
        meta: {
          title: '主页'
        }
      },
      {
        path: 'tool',
        component: () => import('@/views/tool.vue'), //路由懒加载
        meta: {
          title: '工具'
        }
      },
      {
        path: 'about',
        component: () => import('@/views/about.vue'), //路由懒加载
        meta: {
          title: '关于'
        }
      }
    ]
  }
]

export default routes
