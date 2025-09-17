import { defineStore } from 'pinia'
import { store } from '@/store'
import { StoreEnum, ConstanEnum } from '@/enums'
import {
	setLocalStorage,
	getLocalStorage,
	removeLocalStorage,
	createMap,
} from '@/utils/utils'

const initialState = () => {
	const $projectId = getLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_ID)
		? getLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_ID)
		: null
	const $projectList = getLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_LIST)
		? getLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_LIST, true)
		: null

	return {
		$projectId,
		$projectList,
	}
}

export const useProjectStore = defineStore({
	id: StoreEnum.HAWK_PROJECT_STORE,
	state: () => initialState(),
	actions: {
		/**
		 * 初始化
		 */
		$projectInitial() {},

		/**
		 * 切换项目
		 */
		$changeProjectId(projectId) {
			this.$projectId = projectId
			setLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_ID, projectId)
		},

		/**
		 * 获取项目列表
		 */
		$changeProjectList(projectList) {
			this.$projectList = projectList
			setLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_LIST, projectList, true)
		},

		/**
		 * 清理当前选择的团队id
		 */
		$clearProjectId() {
			this.$projectId = null
			removeLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_ID)
		},

		/**
		 * 清理项目列表
		 */
		$clearProjectList() {
			this.$projectList = null
			removeLocalStorage(ConstanEnum.HAWK_SYS_PROJECT_LIST)
		},
	},
})

export const useProjectStoreWithOut = () => {
	return useProjectStore(store)
}
