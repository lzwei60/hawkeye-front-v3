import Mock from 'mockjs'
import { MockParams } from './types/types'
import apis1 from './apis/api1'
import apis2 from './apis/api2'
import apis3 from './apis/api3'
const mocks = [...apis1, ...apis2, ...apis3]
//设置延时时间
Mock.setup({
  timeout: '300'
})

export function mockXHR() {
  let i: MockParams
  for (i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', i.response)
  }
}
