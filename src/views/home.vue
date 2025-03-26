<script setup lang="ts">
defineOptions({
  name: 'v-home'
})

const contentList = reactive([
  '✅ Vue3 + Vite5',
  '✅ TypeScript',
  '✅ Vue-router 4',
  '✅ Element-Plus 组件库',
  '✅ Pinia 状态管理',
  '✅ Axios 封装',
  '✅ Tailwindcss 原子类框架',
  '✅ 支持深色模式',
  '✅ 集成多种图标方案',
  '✅ 打包资源 gzip 压缩',
  '✅ Eslint',
  '✅ 自动导入插件'
])
</script>

<template>
  <div class="box p-[10px]">
    <div class="pl-[12px] border-l-[3px] border-[color:#167fff]">
      <a class="flex items-center" href="" target="_blank">
        <vd-svg-icon name="github" />

        <h3 class="ml-[8px]" style="user-select: none">Vue3-default-template</h3>

        <el-icon class="ml-[8px]"><i-ep-Link /></el-icon>
      </a>
    </div>

    <div class="border-[1px] mt-[10px]"></div>

    <div class="bg-[color:var(--vdBackgroundColor)] rounded-[4px] mt-[12px] p-[10px]">
      🍀 基于 Vue3 全家桶、TypeScript、Vite、Pinia、Element-Plus、Axios、Eslint、Prettier、Stylelint 等技术栈搭建的 Vue3
      项目基础模板
    </div>

    <div class="mt-[12px]">
      <div v-for="(item, index) in contentList" :key="index" class="p-[10px] border-b-[1px]">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
