<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { usePageAuth } from '@/hooks/usePageAuth'
import { useUserStore } from '@/store'

import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

usePageAuth()
onLaunch(async () => {
  console.log('App Launch')
  const userStore = useUserStore()

  try {
    // 检查登录状态
    if (userStore.checkLoginStatus()) {
      const result = await uniCloud.callFunction({
        name: 'uni-id-cf',
        data: { action: 'checkToken' },
      })

      if (result.result.code !== 0) {
        console.log('token无效，准备跳转到登录页')
        // 清除登录状态
        userStore.logout()
        // 明确跳转到登录页
        const loginUrl = '/pages/login/login' // 使用硬编码路径确保正确
        uni.reLaunch({ url: loginUrl }) // 使用reLaunch确保跳转生效
        // 重要：防止后续代码执行
      }
    }
    else {
      // 没有token或已过期，直接跳转
      console.log('没有token或已过期，准备跳转到登录页')
      const loginUrl = '/pages/login/login'
      uni.reLaunch({ url: loginUrl })
    }
  }
  catch (error) {
    console.error('检查登录状态失败:', error)
    // 出错时也跳转登录页
    uni.reLaunch({ url: '/pages/login/login' })
  }
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>
