<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@store/user'
import { loginApi, sendSuccessApi, sendErrorApi } from '@/api/modules/login'

import vResultTool from './components/result-tool.vue'

defineOptions({
  name: 'v-login'
})

type FormModelType = {
  name: string
  token: string
}

const userStore = useUserStore()

const { userInfo, token } = storeToRefs(userStore)

// 数据
const formModel = ref<FormModelType>({
  name: userInfo.value.name,
  token: token
})

/**
 * 修改用户名
 */
const updateUserName = () => {
  userStore.setUserInfo({
    name: unref(formModel).name
  })
}

/**
 * 发送请求成功
 */
const onSuccess = async () => {
  try {
    const res = await sendSuccessApi()

    if (res.code === 200) {
      ElMessage.success('发送成功')

      formModel.value.name = res.data.name
      formModel.value.token = res.data.token
      updateUserToken()
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const onError = async () => {
  try {
    const options = {}
    const res = await sendErrorApi(options)

    if (res.code !== 200) {
      ElMessage.error(`发送失败，${res.message}`)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * 设置token
 */
const updateUserToken = () => {
  userStore.setToken(unref(formModel).token)
}
</script>

<template>
  <div class="content p-[10px]">
    <div class="pl-[12px] border-l-[3px] border-[color:#167fff] mb-[20px]">
      <a class="flex items-center" href="" target="_blank">
        <h3>mock</h3>
      </a>
    </div>

    <el-form :model="formModel" label-width="auto" style="max-width: 600px">
      <el-form-item label="name">
        <el-input v-model="formModel.name" @input="updateUserName" />
      </el-form-item>

      <el-form-item label="token">
        <el-input v-model="formModel.token" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSuccess">发送成功</el-button>

        <el-button type="danger" @click="onError">发送失败</el-button>
      </el-form-item>
    </el-form>

    <vResultTool></vResultTool>
  </div>
</template>

<style scoped></style>
