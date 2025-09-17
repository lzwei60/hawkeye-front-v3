// composables/useUserTeamTools.ts
import { useAuthStoreWithOut } from '@/store/modules/auth'
import { useTeamStoreWithOut } from '@/store/modules/team'
import { useProjectStoreWithOut } from '@/store/modules/project'
import { createMap } from '@/utils/utils'
import { isVoid } from '@/utils/validate' //
export function useAuth() {
	const authStore = useAuthStoreWithOut()
	const teamStore = useTeamStoreWithOut()
	const projectStore = useProjectStoreWithOut()

	const $userInfo = computed(() => authStore.$userInfo || {})
	const $userAccount = computed(() => authStore.$userAccount || null)
	const $userId = computed(() => authStore.$userId || null)
	const $userName = computed(() => authStore.$userName || null)
	const $userEmail = computed(() => authStore.$userEmail || null)

	const $teamId = computed(() => teamStore.$teamId || null)
	const $teamUserList = computed(() => teamStore.$teamUserList || [])
	const $teamAllUserList = computed(() => teamStore.$teamAllUserList || [])
	const $teamList = computed(() => teamStore.$teamList || [])
	const $userMap = computed(() => {
		return createMap($teamAllUserList.value, 'userId', 'userName')
	})

	const $projectId = computed(() => projectStore.$projectId || null)
	const $projectList = computed(() => projectStore.$projectList || null)

	const $isTeamSupperManager = computed(() => {
		const findTeam = unref($teamList).find(
			(item) => item.teamId === unref($teamId)
		)
		if (findTeam) {
			return findTeam.superAdmin.includes(unref($userId))
		}
		return false
	})

	const $isTeamManager = computed(() => {
		const findTeam = unref($teamList).find(
			(item) => item.teamId === unref($teamId)
		)
		if (findTeam) {
			return findTeam.teamAdmin.includes(unref($userId))
		}
		return false
	})

	/**
	 * 根据用户 userId 获取 userName
	 */
	function $getUserNickName(options) {
		let userName = options,
			map = $userMap.value,
			character = '，'

		if (typeof options === 'object') {
			const {
				userName: userName_ = '',
				map: map_ = $userMap.value,
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
				nickName += map.get(e)
			} else {
				nickName += e
			}
			nickName += nickName !== '' && index === arr.length - 1 ? '' : character
		})

		return nickName
	}

	/**
	 * 获取团队列表
	 */
	async function $getTeamList(refresh = false) {
		return teamStore.$getTeamList(refresh)
	}

	/**
	 * 获取当前团队所有用户
	 */
	async function $getTeamAllUser(refresh = false) {
		return teamStore.$getTeamAllUser(refresh)
	}

	/**
	 * 获取当前团队存活用户
	 */
	async function $getTeamUser(refresh = false) {
		return teamStore.$getTeamUser(refresh)
	}

	/**
	 * 切换团队
	 */
	function $changeTeamId(teamId) {
		return teamStore.$changeTeamId(teamId)
	}

	/**
	 * 切换项目
	 */
	function $changeProjectId(projectId) {
		return projectStore.$changeProjectId(projectId)
	}

	/**
	 * 切换项目
	 */
	function $changeProjectList(projectList) {
		return projectStore.$changeProjectList(projectList)
	}

	return {
		$userInfo,
		$userAccount,
		$userId,
		$userName,
		$userEmail,

		$teamId,
		$teamUserList,
		$teamAllUserList,
		$teamList,
		$userMap,

		$projectId,
		$projectList,

		$isTeamSupperManager,
		$isTeamManager,

		$getUserNickName,
		$getTeamList,
		$getTeamAllUser,
		$getTeamUser,
		$changeTeamId,

		$changeProjectId,
		$changeProjectList,
	}
}
