import Mock from 'mockjs'
export default [
  {
    url: '/user/userInfo',
    type: 'get',
    response: () => {
      return Mock.mock({
        id: '@id', //得到随机id
        username: '@cname()', //得到随机姓名
        date: '@date()', //得到随机日期
        avatar: "@image('200*200','red','#fff','avatar')", //得到随机图片
        description: '@paragraph', //得到随机描述
        ip: '@ip()', //得到随机ip
        email: '@email()', //得到随机邮箱
        haha: 'hahha' //自定义
      })
    }
  }
]
