import { defineStore } from 'pinia'
import { store } from '@/store'
import { UserStateType } from '../types'
import { getToken, setToken } from '@/utils/auth'

// 第一个参数是id，唯一
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken() || 'EFA68205747CB561BB7C0F85D5689856',
      userInfo: { name: 'ahwei', phone: '13512341234' }
    }
  },
  getters: {
    namePic: (state) => state.userInfo.name.substring(0, 1)
  },
  actions: {
    setToken(token: string) {
      this.token = token
      setToken({
        token,
        expires: 30
      })
    },
    setUserInfo(userInfo: UserStateType['userInfo']) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    }
  }
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}
