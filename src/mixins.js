import { useAuthStoreWithOut } from '@/store/modules/auth'
import { useTeamStoreWithOut } from '@/store/modules/team'
import { createMap } from '@/utils/utils.ts'

const authStore = useAuthStoreWithOut()

const teamStore = useTeamStoreWithOut()

const mixins = {
	computed: {
		$userInfo: () => authStore.$userInfo || {},
		$userAccount: () => authStore.$userAccount || null,
		$userId: () => authStore.$userId || null,
		$userName: () => authStore.$userName || null,
		$userEmail: () => authStore.$userEmail || null,

		$teamId: () => teamStore.$teamId || null,
		$teamUserList: () => teamStore.$teamUserList || [],
		$teamAllUserList: () => teamStore.$teamAllUserList || [],
		$teamList: () => teamStore.$teamList || [],
		$userMap() {
			const list = teamStore.$teamAllUserList
			return createMap(list, 'username', 'nickname')
		},
	},

	methods: {
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
		 * 获取团队列表
		 */
		async $getTeamList(refresh = false) {
			return teamStore.$getTeamList(refresh)
		},

		/**
		 * 获取当前团队所有用户
		 */
		async $getTeamAllUser(refresh = false) {
			return teamStore.$getTeamAllUser(refresh)
		},

		/**
		 * 获取当前团队存活用户
		 */
		async $getTeamUser(refresh = false) {
			return teamStore.$getTeamUser(refresh)
		},

		/**
		 * 切换团队
		 */
		$changeTeamId(teamId) {
			return teamStore.$changeTeamId(teamId)
		},
	},
}

export { mixins }
