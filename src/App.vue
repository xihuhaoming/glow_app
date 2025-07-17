<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { usePageAuth } from '@/hooks/usePageAuth'
import { useUserStore } from '@/store'

import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js'
// 在您的页面中导入云对象
const uniIdCo = uniCloud.importObject('uni-id-co', {
  customUI: true, // 可选参数，使用自定义UI
})
usePageAuth()
onLaunch(async () => {
  console.log('App Launch')
  const userStore = useUserStore()

  await uniIdPageInit()

  try {
    console.log('[onLaunch] 准备检查登录状态...')
    if (userStore.checkLoginStatus()) {
      try {
        await userStore.fetchUserInfoFromDB()
        console.log('[onLaunch] 已同步数据库用户信息到store')
      }
      catch (e) {
        console.error('[onLaunch] 同步数据库用户信息失败', e)
      // 可选：userStore.logout(); uni.reLaunch({ url: '/pages/login/login' })
      }
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

// 同步用户信息的方法
// async function syncUserInfo() {
//   try {
//     const result = await uniIdCo.getAccountInfo()
//     console.log('用户信息:', result)
//     return result
//   }
//   catch (error) {
//     console.error('同步用户信息失败', error)
//   }
// }
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
// Tabbar样式
.tabbar,
.u-tabbar,
.bottom-tabbar,
.uni-tabbar,
.uni-tabbar__container {
  background: #fff !important;
  box-shadow: 0 -2rpx 16rpx 0 rgba(0, 0, 0, 0.04);
}
</style>
