import dayjs from 'dayjs'
import docx from '@/assets/images/docx.svg'
import pdf from '@/assets/images/pdf.svg'
import xlsx from '@/assets/images/xlsx.svg'
import pptx from '@/assets/images/pptx.svg'
import zip from '@/assets/images/zip.svg'
import folder from '@/assets/images/folder.png'

export const useTeam = () => {
	const initMemberList = ref([
		{ userId: 'liaozhiwei', userName: '廖志伟', headImg: '' },
		{
			userId: 'liaozhiwei1',
			userName: '廖志伟1',
			headImg: docx,
		},
		{
			userId: 'liaozhiwei2',
			userName: '廖志伟2',
			headImg: folder,
		},
		{
			userId: 'liaozhiwei3',
			userName: '廖志伟3',
			headImg: '',
		},
		{
			userId: 'liaozhiwei4',
			userName: '廖志伟4',
			headImg: pdf,
		},
		{
			userId: 'liaozhiwei5',
			userName: '廖志伟5',
			headImg: pptx,
		},
		{
			userId: 'liaozhiwei6',
			userName: '廖志伟6',
			headImg: xlsx,
		},
		{
			userId: 'liaozhiwei7',
			userName: '廖志伟7',
			headImg: zip,
		},
	])

	const initRoleList = ref([
		{
			roleId: '1',
			roleName: '超级管理员',
		},
		{
			roleId: '2',
			roleName: '团队管理员',
		},
		{
			roleId: '3',
			roleName: '项目管理员',
		},
		{
			roleId: '4',
			roleName: '成员',
		},
	])

	return {
		initMemberList,
		initRoleList,
	}
}
