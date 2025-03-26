import Mock from 'mockjs'
export default [
  // AddGoods
  {
    url: '/api/addgoods',
    type: 'post',
    response: function (option: any) {
      const $name = JSON.parse(option.body).name
      if ($name) {
        return Mock.mock({
          status: 200,
          message: '提交成功',
          data: {
            goods: [
              {
                name: 'MacbookPro',
                num: 1
              },
              {
                name: 'ipad',
                num: 2
              }
            ]
          }
        })
      } else {
        return Mock.mock({
          status: 400,
          message: '未提交参数'
        })
      }
    }
  }
]
