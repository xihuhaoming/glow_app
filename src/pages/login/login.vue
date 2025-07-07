<script setup lang="ts">
import { ref } from 'vue'
import { uniCloudWeChatLogin } from '@/unicloud/cloud-functions/auth' // 假设您会将 UniCloud 认证相关代码放在这里
// 处理微信一键授权的回调
async function getPhoneNumberCallback(e: UniApp.GetPhoneNumberEvent) {
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    // 用户同意授权
    const { code } = await uni.login({ provider: 'weixin' }) // 获取登录凭证 code
    const { encryptedData, iv } = e.detail // 获取手机号加密数据

    try {
      // 调用 UniCloud 云函数进行后端处理
      const result = await uniCloudWeChatLogin({
        code,
        encryptedData,
        iv,
      })
      console.log('微信一键授权登录成功:', result)
      // TODO: 根据后端返回的结果，进行用户状态更新、页面跳转等
    }
    catch (error) {
      console.error('微信一键授权登录失败:', error)
      // TODO: 错误处理，例如提示用户
    }
  }
  else {
    // 用户拒绝授权
    console.log('用户拒绝微信一键授权')
    // TODO: 提示用户或引导用户使用其他登录方式
  }
}

function traditionalLogin() {
  // TODO: 跳转到传统登录页面或执行传统登录逻辑
  console.log('跳转到传统登录')
}
</script>

<template>
  <view class="login-container">
    <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumberCallback">
      微信一键授权登录
    </button>
    <button @click="traditionalLogin">
      传统登录
    </button>
  </view>
</template>

  <style>
  .login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #04be02;
  color: white;
  border-radius: 5px;
}
</style>
