<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@store/user'

defineOptions({
  name: 'v-result-tool'
})

const userStore = useUserStore()

// 获取state使用computed或者使用storeToRefs，直接使用不具备响应式（拿到的永远是初次的值）
const username = computed(() => userStore.userInfo.name)

// 获取getter使用storeToRefs，或者直接使用，在模板里 userStore.namePic
const { namePic, token } = storeToRefs(userStore)
</script>

<template>
  <div class="pl-[12px] border-l-[3px] border-[color:#167fff] mb-[20px]">
    <a class="flex items-center" href="" target="_blank">
      <h3>store</h3>
    </a>
  </div>

  <div>Hello: {{ namePic }}, your name is {{ username }}, your token is {{ token }}</div>

  <div class="pl-[12px] border-l-[3px] border-[color:#167fff] mt-[20px] mb-[20px]">
    <a class="flex items-center" href="" target="_blank">
      <h3>i-ep-icon</h3>
    </a>
  </div>

  <div>
    <el-icon><i-ep-CirclePlus /></el-icon>
    <el-icon><i-ep-Female /></el-icon>
    <el-icon><i-ep-Male /></el-icon>
    <el-icon><i-ep-DeleteFilled /></el-icon>
    <el-icon><i-ep-Management /></el-icon>
    <el-icon><i-ep-Platform /></el-icon>
  </div>

  <div class="pl-[12px] border-l-[3px] border-[color:#167fff] mt-[20px] mb-[20px]">
    <a class="flex items-center" href="" target="_blank">
      <h3>svg-icon</h3>
    </a>
  </div>

  <div class="flex items-center">
    <vd-svg-icon name="github" />
    <vd-svg-icon name="tool" />
    <vd-svg-icon name="personal" />
    <vd-svg-icon name="disk" />
    <vd-svg-icon name="post" />
  </div>
</template>

<style scoped lang="scss"></style>
