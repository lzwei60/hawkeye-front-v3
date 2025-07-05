import dayjs from 'dayjs'
import docx from '@/assets/images/docx.svg'
import pdf from '@/assets/images/pdf.svg'
import xlsx from '@/assets/images/xlsx.svg'
import pptx from '@/assets/images/pptx.svg'
import zip from '@/assets/images/zip.svg'
import folder from '@/assets/images/folder.png'

export const useTeam = () => {
	const initMemberList = ref([
		{
			userId: 'liaozhiwei',
			userName: '廖志伟',
			headImg:
				'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			roles: ['1', '3'],
		},
		{
			userId: 'liaozhiwei1',
			userName: '廖志伟1',
			headImg: docx,
			roles: ['2', '3'],
		},
		{
			userId: 'liaozhiwei2',
			userName: '廖志伟2',
			headImg: folder,
			roles: ['3', '4'],
		},
		{
			userId: 'liaozhiwei3',
			userName: '廖志伟3',
			headImg:
				'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			roles: ['4'],
		},
		{
			userId: 'liaozhiwei4',
			userName: '廖志伟4',
			headImg: pdf,
			roles: ['4'],
		},
		{
			userId: 'liaozhiwei5',
			userName: '廖志伟5',
			headImg: pptx,
			roles: ['4'],
		},
		{
			userId: 'liaozhiwei6',
			userName: '廖志伟6',
			headImg: xlsx,
			roles: ['4'],
		},
		{
			userId: 'liaozhiwei7',
			userName: '廖志伟7',
			headImg: zip,
			roles: ['4'],
		},
	])

	const initNewMemberList = ref([
		{
			userId: 'liaozhiwei',
			userName: '廖志伟',
			headImg:
				'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			roles: [],
		},
		{
			userId: 'liaozhiwei1',
			userName: '廖志伟1',
			headImg:
				'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			roles: [],
		},
	])

	const initRoleList = ref([
		{
			roleId: 1,
			roleName: '超级管理员',
			color: '#1677ff',
		},
		{
			roleId: 2,
			roleName: '团队管理员',
			color: '#f5941d',
		},
		{
			roleId: 3,
			roleName: '项目管理员',
			color: '#51b52f',
		},
		{
			roleId: 4,
			roleName: '成员',
			color: '#999999',
		},
	])

	return {
		initMemberList,
		initNewMemberList,
		initRoleList,
	}
}
