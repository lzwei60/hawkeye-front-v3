<template>
	<div class="flex items-center">
		<div
			class="px-[10px] py-[5px] bg-[#1677ff] text-white rounded-full cursor-pointer hover:opacity-80 mr-[10px]">
			所有成员
		</div>

		<div
			class="px-[10px] py-[5px] bg-[#eff6ff] text-black rounded-full cursor-pointer hover:opacity-80">
			新成员
		</div>
	</div>

	<div class="mt-[18px] flex items-center justify-between">
		<div class="flex items-center">
			<div class="font-bold text-[32px] text-[#333]">团队名称</div>

			<div class="text-[14px] text-[#777777] ml-[18px]">（共 2 人）</div>
		</div>

		<el-button :icon="Plus" type="primary">添加成员</el-button>
	</div>

	<div class="mt-[18px]">
		<div
			class="flex items-center justify-between border-t py-[10px] mb-[10px] first:pt-0 last:mb-0"
			v-for="item in initMemberList"
			:key="item.userId">
			<div class="flex items-center">
				<el-avatar
					src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
					size="large" />

				<div class="ml-[18px] font-bold text-[16px]">廖志伟</div>
			</div>

			<div>
				<el-popover
					placement="bottom"
					transition=""
					:width="200"
					trigger="click">
					<template #reference>
						<div>
							<el-tag
								v-for="item in 2"
								:key="item"
								class="cursor-pointer mr-[10px] last:mr-0"
								effect="dark"
								type="info"
								disable-transitions
								color="#f5941d">
								超级管理员
							</el-tag>
						</div>
					</template>

					<div class="list">
						<template v-for="list in initRoleList" :key="list.roleId">
							<div
								v-if="list.roleId !== '3'"
								class="item flex items-center justify-between cursor-pointer pt-[10px] pb-[10px] pl-[5px] pr-[5px] hover:bg-[#f5f5f5]">
								<div class="flex items-center">
									<div
										class="w-[20px] h-[20px] rounded mr-[15px] bg-[#f5941d]"></div>

									<div class="">{{ list.roleName }}</div>
								</div>

								<div
									v-if="'1' === list.roleId"
									class="before:content-['✔'] before:text-[#51b52f]"></div>
							</div>
						</template>
					</div>
				</el-popover>
			</div>

			<div>462062531@qq.com</div>

			<div class="">
				<el-button type="info" link> 移除 </el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { useTeam } from '@/hooks'

const { initRoleList, initMemberList } = useTeam()
</script>

<style lang="scss" scoped>
:deep .el-tag--info {
	border: unset;
}
</style>
