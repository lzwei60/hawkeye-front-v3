import { ElMessage } from 'element-plus'

// 通用上传文件大小限制 10M
export const SYS_UPLOAD_MAX_SIZE = 1024

export const useUpload = () => {
	const acceptImgList = ['.png', '.jpg', '.jpeg']
	const acceptWordList = ['.doc', '.docx']
	const acceptExcelList = ['.xls', '.xlsx']
	const acceptPdfList = ['.pdf']
	const acceptPPTList = ['.ppt', '.pptx']
	const acceptZipList = ['.zip', '.rar', '.tar', '.gz', '.7z', '.bz', '.bz2']
	const acceptList = [
		...acceptImgList,
		...acceptWordList,
		...acceptExcelList,
		...acceptPdfList,
		...acceptPPTList,
		...acceptZipList,
	]

	const beforeUpload = (file, fileType) => {
		const fileSuffix = file.name.split('.').pop().toLocaleLowerCase()
		const isType = fileType.includes(`.${fileSuffix}`)
		const isLimit10M = file.size / 1024 / 1024 < SYS_UPLOAD_MAX_SIZE
		if (!isType) {
			ElMessage.error(
				'附件只能上传图片、pdf、excel、word、ppt、压缩包格式文件',
				'warning'
			)
		}
		if (!isLimit10M) {
			this.$message.error(`上传附件大小不能超过 ${SYS_UPLOAD_MAX_SIZE} MB!`)
		}
		return isType && isLimit10M
	}

	return {
		acceptImgList,
		acceptWordList,
		acceptExcelList,
		acceptPdfList,
		acceptPPTList,
		acceptZipList,
		acceptList,

		beforeUpload,
	}
}
