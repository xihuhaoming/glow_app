<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { usePageAuth } from '@/hooks/usePageAuth'
import { useUserStore } from '@/store'

import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js'

usePageAuth()
onLaunch(async () => {
  console.log('App Launch')
  const userStore = useUserStore()

  await uniIdPageInit()

  try {
    console.log('[onLaunch] 准备检查登录状态...')
    if (userStore.checkLoginStatus()) {
      console.log('[onLaunch] 状态为已登录，将通过getUserInfo()验证token...')
      const userInfoRes = await userStore.getUserInfo()
      console.log('[onLaunch] Token验证成功，用户信息:', userInfoRes)
    }
    else {
      console.log('[onLaunch] 状态为未登录，将跳转到登录页。')
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
  catch (error) {
    console.error('[onLaunch] CATCH块：验证登录状态失败:', error)
    console.log('[onLaunch] 将调用logout()清理无效状态...')
    await userStore.logout()
    console.log('[onLaunch] 清理完毕，将跳转到登录页...')
    uni.reLaunch({ url: '/pages/login/login' })
  }
  finally {
    console.log('--- App Launch END ---')
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
