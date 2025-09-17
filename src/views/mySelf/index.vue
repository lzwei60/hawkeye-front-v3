<template>
	<div class="px-[20px] h-[100%]">
		<UserInfo :userId="$userId" />
	</div>
</template>

<script setup>
import UserInfo from '@/components/userInfo/index.vue'
import { useAuth } from '@/hooks'

const { $userId } = useAuth()
</script>
