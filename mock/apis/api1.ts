import Mock from 'mockjs'

export default [
  {
    url: '/upms/user/info',
    type: 'get',
    response: () => {
      return {
        data: {
          code: 200,
          message: '成功',
          data: {
            name: 'testName',
            token: '12d0a0933h3213313hfdaf0adf9asf8s'
          }
        }
      }
    }
  },

  {
    url: '/auth/auth/token',
    type: 'post',
    response: (option: any) => {
      const $name = option.name
      if ($name) {
        return Mock.mock({
          data: {
            code: 200,
            message: '成功',
            data: {
              token: 'testToken'
            }
          }
        })
      } else {
        return Mock.mock({
          data: {
            code: 400,
            message: '未提交参数'
          }
        })
      }
    }
  }
]
