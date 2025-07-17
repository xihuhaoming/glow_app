<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
  {
    "layout": "default",
    "style": {
      "navigationBarTitleText": "登录"
    }
  }
</route>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

// 处理微信登录
async function handleWeixinLogin() {
  try {
    uni.showLoading({ title: '登录中...' })

    // const userProfileRes = await uni.getUserProfile({
    //   desc: '用于完善会员资料',
    //   lang: 'zh_CN',
    // })

    // 2. 授权成功后，将获取到的 userInfo 交给 store 处理后续的登录流程
    await userStore.loginWithWechat()

    uni.hideLoading()
    // 登录成功后跳转
    uni.switchTab({
      url: '/pages/index/index',
    })
  }
  catch (error) {
    console.error('微信登录出错:', error)
    uni.showToast({
      title: '登录失败，请稍后再试',
      icon: 'none',
    })
  }
}

// 获取手机号(通过微信开放能力)
async function getPhoneNumberCallback(e) {
  console.log('getPhoneNumberCallback', e)
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    // 获取登录凭证
    const { code } = await uni.login({ provider: 'weixin' })
    const { encryptedData, iv } = e.detail

    const uniIdCo = uniCloud.importObject('uni-id-co')
    const result = await uniIdCo.bindMobileByMpWeixin({
      code,
      encryptedData,
      iv,
    })

    console.log('绑定手机号结果:', result)
    if (result.result.code === 0) {
      uni.showToast({
        title: '手机号绑定成功',
        icon: 'success',
      })
    }
    else {
      uni.showToast({
        title: result.result.message || '绑定失败',
        icon: 'none',
      })
    }
  }
}
</script>

<template>
  <view class="login-container">
    <!-- 微信登录按钮 -->
    <button type="primary" @click="handleWeixinLogin">
      微信一键登录
    </button>

    <!-- 获取微信手机号按钮 -->
    <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumberCallback">
      微信手机号授权登录
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
  width: 80%;
}
</style>
