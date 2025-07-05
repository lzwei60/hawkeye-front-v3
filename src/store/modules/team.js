import { defineStore } from 'pinia'
import { store } from '@/store'
import { StoreEnum, ConstanEnum } from '@/enums'
import {
	setLocalStorage,
	getLocalStorage,
	removeLocalStorage,
	createMap,
} from '@/utils/utils'

import {
	selectUserTeamApi,
	getTeamMembersApi,
	getAllTeamMembersApi,
} from '@/api/modules/team.js'

const initialState = () => {
	const $teamId = getLocalStorage(ConstanEnum.HAWK_SYS_TEAM_ID)
		? getLocalStorage(ConstanEnum.HAWK_SYS_TEAM_ID)
		: null
	const $teamList = getLocalStorage(ConstanEnum.HAWK_SYS_TEAM_LIST)
		? getLocalStorage(ConstanEnum.HAWK_SYS_TEAM_LIST, true)
		: []
	const $teamUserList = getLocalStorage(ConstanEnum.HAWK_TEAM_USER_LIST)
		? getLocalStorage(ConstanEnum.HAWK_TEAM_USER_LIST, true)
		: []
	const $teamAllUserList = getLocalStorage(ConstanEnum.HAWK_TEAM_All_USER_LIST)
		? getLocalStorage(ConstanEnum.HAWK_TEAM_All_USER_LIST, true)
		: []

	return {
		$teamId,
		$teamList,
		$teamUserList,
		$teamAllUserList,
	}
}

export const useTeamStore = defineStore({
	id: StoreEnum.HAWK_TEAM_STORE,
	state: () => initialState(),
	getters: {
		$userMap() {
			const list = useTeamStoreWithOut().$teamAllUserList
			return createMap(list, 'UserId', 'UserName')
		},
	},
	actions: {
		/**
		 * 初始化
		 */
		$teamInitial() {
			return this.$getTeamList()
		},

		/**
		 * 获取团队列表
		 */
		async $getTeamList(refresh = false) {
			try {
				const list = this.$teamList
				if (list && list.length > 0 && !refresh) {
					return list
				}
				const res = await selectUserTeamApi({})
				this.$teamList = res.data.map((item) => {
					item.label = item.teamName
					item.value = item.teamId
					return item
				})
				setLocalStorage(ConstanEnum.HAWK_SYS_TEAM_LIST, this.$teamList, true)
				return this.$teamList
			} catch (err) {
				return Promise.reject(err)
			}
		},

		/**
		 * 获取当前团队所有用户
		 */
		async $getTeamAllUser(refresh = false) {
			try {
				const list = this.$teamAllUserList
				if (list && list.length > 0 && !refresh) {
					return list
				}
				if (this.$teamId) {
					const res = await getAllTeamMembersApi({ teamId: this.$teamId })
					this.$teamAllUserList = res.data.map((item) => {
						item.label = item.userName
						item.value = item.userId
						return item
					})
				} else {
					this.$teamAllUserList = []
				}
				setLocalStorage(
					ConstanEnum.HAWK_TEAM_All_USER_LIST,
					this.$teamAllUserList,
					true
				)
				return this.$teamAllUserList
			} catch (err) {
				return Promise.reject(err)
			}
		},

		/**
		 * 获取当前团队存活用户
		 */
		async $getTeamUser(refresh = false) {
			try {
				const list = this.$teamUserList
				if (list && list.length > 0 && !refresh) {
					return list
				}
				if (this.$teamId) {
					const res = await getTeamMembersApi({ teamId: this.$teamId })
					this.$teamUserList = res.data.map((item) => {
						item.label = item.userName
						item.value = item.userId
						return item
					})
				} else {
					this.$teamUserList = []
				}
				setLocalStorage(
					ConstanEnum.HAWK_TEAM_USER_LIST,
					this.$teamUserList,
					true
				)
				return this.$teamUserList
			} catch (err) {
				return Promise.reject(err)
			}
		},

		/**
		 * 根据用户 userId 获取 userName
		 */
		$getUserNickName(options) {
			let userName = options,
				map = this.$userMap,
				character = '，'

			if (typeof options === 'object') {
				const {
					userName: userName_ = '',
					map: map_ = this.$userMap,
					character: character_ = '，',
				} = options
				userName = userName_
				map = map_
				character = character_
			}

			let nickName = ''

			if (isVoid(userName) || userName.length === 0) return nickName

			let userNameArray = []

			if (Array.isArray(userName)) {
				userNameArray = userName
			} else if (userName.includes('，')) {
				userNameArray = userName.split('，')
			} else {
				userNameArray = userName.split(',')
			}

			userNameArray.forEach((e, index, arr) => {
				if (map.get(e)) {
					nickName += map.get(e) ? map.get(e) : ''
				} else {
					nickName += e
				}
				nickName += nickName !== '' && index === arr.length - 1 ? '' : character
			})

			return nickName
		},

		/**
		 * 切换团队
		 */
		$changeTeamId(itemId) {
			this.$teamId = itemId
			setLocalStorage(ConstanEnum.HAWK_SYS_TEAM_ID, itemId)
			this.$getTeamAllUser(true)
			this.$getTeamUser(true)
		},

		/**
		 * 清理当前选择的团队id
		 */
		$clearTeamId() {
			this.$teamId = null
			removeLocalStorage(ConstanEnum.HAWK_SYS_TEAM_ID)
		},

		/**
		 * 清除函数
		 */
		$clearTeamList() {
			this.$teamList = []
			removeLocalStorage(ConstanEnum.HAWK_SYS_TEAM_LIST)
		},

		/**
		 * 清空当前团队存活用户函数
		 */
		$clearTeamUser() {
			this.$teamUserList = []
			removeLocalStorage(ConstanEnum.HAWK_TEAM_USER_LIST)
		},

		/**
		 * 清空当前团队所有用户函数
		 */
		$clearTeamAllUser() {
			this.$teamAllUserList = []
			removeLocalStorage(ConstanEnum.HAWK_TEAM_All_USER_LIST)
		},
	},
})

export const useTeamStoreWithOut = () => {
	return useTeamStore(store)
}
