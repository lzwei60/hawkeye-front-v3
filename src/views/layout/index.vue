<script setup lang="ts">
import { useDarkMode, useToggleDarkMode, useGetDarkMode } from '@/hooks/useToggleDarkMode'

const route = useRoute()

const router = useRouter()

// 获取整个路由表
const routes = router.options.routes

// 获取菜单栏
const menuItem = ref(routes[0].children)

/**
 * 更改模式
 */
const toggleDark = (event: TouchEvent | MouseEvent) => {
  useToggleDarkMode(event)
}

useGetDarkMode()
</script>

<template>
  <div class="page-wrapper">
    <div class="layout__top flex items-center justify-between">
      <el-menu mode="horizontal" class="layout__menu" :router="true" :default-active="$route.path">
        <el-menu-item v-for="item in menuItem" :key="'/' + item.path" :index="'/' + item.path" :route="item">{{
          item.meta.title
        }}</el-menu-item>
      </el-menu>

      <div class="layout__top--right pr-[10px] cursor-pointer" @click="toggleDark">
        <el-icon size="24" color="var(--vdTextColor)">
          <i-ep-Sunny v-if="useDarkMode()" />

          <i-ep-Moon v-else />
        </el-icon>
      </div>
    </div>

    <div class="layout__content">
      <transition name="fade-transform" mode="out-in">
        <KeepAlive :key="route.path">
          <router-view />
        </KeepAlive>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  &__top {
    height: 56px;
    background-color: var(--vdPageBgColor);
  }

  &__content {
    min-height: calc(100vh - 56px);
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: var(--vdPageBgColor);
    padding: 0px;
  }

  &__menu {
    display: flex;
    justify-content: center;
    width: 100%; /* Ensure it spans the width of the container */

    .el-menu {
      display: flex;
      justify-content: center;
      width: auto; /* Adjust width to fit the items */

      .el-menu-item {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
