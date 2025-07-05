import { defineStore } from 'pinia'
import { store } from '@/store'
import { StoreEnum, ConstanEnum } from '@/enums'
import { useTeamStoreWithOut } from './team.js'

import { setLocalStorage, getLocalStorage } from '@/utils/utils'

const initialState = () => {
	const $userInfo = getLocalStorage(ConstanEnum.HAWK_APP_USER, false)
		? getLocalStorage(ConstanEnum.HAWK_APP_USER, true)
		: null

	const $userAccount = $userInfo ? $userInfo.userAccount : null
	const $userEmail = $userInfo ? $userInfo.userEmail : null
	const $userId = $userInfo ? $userInfo.userId : null
	const $userName = $userInfo ? $userInfo.userNo : null

	return {
		$userInfo,
		$userAccount,
		$userEmail,
		$userId,
		$userName,
	}
}

export const useAuthStore = defineStore({
	id: StoreEnum.HAWK_AUTH_STORE,
	state: () => initialState(),
	actions: {
		/**
		 * 登录后初始化
		 */
		authInitial(userInfo) {
			setLocalStorage(ConstanEnum.HAWK_APP_USER, userInfo, true)
			this.$state = initialState()
			return Promise.all([useTeamStoreWithOut().$teamInitial()])
		},

		/**
		 * 用户退出
		 */
		async authLoginOut() {
			this.authClear()
		},

		/**
		 * auth 清除函数
		 */
		authClear() {
			sessionStorage.clear()
			localStorage.clear()
			this.$state = initialState()
			useTeamStoreWithOut().$clearTeamId()
			useTeamStoreWithOut().$clearTeamList()
			useTeamStoreWithOut().$clearTeamUser()
			useTeamStoreWithOut().$clearTeamAllUser()
		},
	},
})

export const useAuthStoreWithOut = () => {
	return useAuthStore(store)
}
