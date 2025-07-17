<route lang="json5">
  {
    layout: 'tabbar',
    style: {
      navigationBarTitleText: '我的'
    },
  }
  </route>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

defineOptions({
  name: 'MyPage',
})

const userStore = useUserStore()

const userInfo = ref(userStore.getUserInfo())
const statusBarHeight = ref(0)

console.log('userInfo', userInfo)
onLoad(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight * 2 + 50 // 转换为rpx
  uni.$on('userProfileUpdated', (updatedData) => {
    // 刷新页面数据
    refreshUserInfo()
  })
})

onUnload(() => {
  // 页面卸载时移除监听，避免内存泄漏
  uni.$off('userProfileUpdated')
})

function refreshUserInfo() {
  // 刷新用户信息的方法
  const latest = userStore.getUserInfo()
  // 更新页面数据
  userInfo.value = JSON.parse(JSON.stringify(latest))
}
// 跳转到个人信息编辑页面
function goToUserInfo() {
  uni.navigateTo({
    url: '/pages/my/edit',
  })
}

// 检查登录状态
const isLoggedIn = computed(() => {
  return userStore.checkLoginStatus()
})

// 跳转到登录页
function goToLogin() {
  uni.navigateTo({
    url: '/pages/login/login',
  })
}

function goToVip() {
  uni.navigateTo({
    url: '/pages/my/vip',
  })
}
</script>

<template>
  <view class="my-page">
    <!-- 自定义顶部状态栏 -->
    <view class="status-bar" :style="{ height: `${statusBarHeight}rpx` }" />

    <!-- 用户信息区域 -->
    <view class="user-info-area">
      <!-- 头像和用户名区域 -->
      <view class="user-header" @click="isLoggedIn ? goToUserInfo() : goToLogin()">
        <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
        <view class="user-name">
          <view class="nickname-row">
            <text class="nickname">
              {{ isLoggedIn ? userInfo.nickname || userInfo.username : '美叶e勤川' }}
            </text>
            <text class="vip-tag">
              VIP会员
            </text>
          </view>
          <text class="user-desc">
            {{ isLoggedIn ? userInfo.comment : '普通用户' }}
          </text>
        </view>
        <up-icon name="arrow-right" size="12" color="#ffffff" />
      </view>

      <!-- VIP会员区域 -->
      <view class="vip-area">
        <view class="vip-left">
          <!-- <up-icon name="arrow-right" size="12" color="#ffffff" /> -->
          <text>开通会员享VIP会员</text>
        </view>
        <button class="vip-btn" @click="goToVip">
          立即开通
        </button>
      </view>
    </view>

    <!-- 功能图标区域 -->
    <view class="icon-menu">
      <view class="icon-item">
        <up-icon name="grid" size="30" color="#00c38d" />
        <text class="icon-text">
          海量课程
        </text>
      </view>
      <view class="icon-item">
        <up-icon name="star" size="30" color="#00c38d" />
        <text class="icon-text">
          手速达人
        </text>
      </view>
      <view class="icon-item">
        <up-icon name="man-add" size="30" color="#00c38d" />
        <text class="icon-text">
          专家微咨询
        </text>
      </view>
      <view class="icon-item">
        <up-icon name="calendar" size="30" color="#00c38d" />
        <text class="icon-text">
          每日签到
        </text>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-list">
      <view class="menu-item">
        <view class="menu-left">
          <up-icon name="red-packet" size="22" color="#333333" />
          <text>学习数据</text>
        </view>
        <text class="menu-right">
          看报告
        </text>
      </view>

      <view class="menu-item">
        <view class="menu-left">
          <up-icon name="order" size="22" color="#333333" />
          <text>专属测试</text>
        </view>
        <text class="menu-right" />
      </view>

      <view class="menu-item">
        <view class="menu-left">
          <up-icon name="tags-fill" size="22" color="#333333" />
          <text>我的任务</text>
        </view>
        <text class="menu-right">
          暂无人参与 >
        </text>
      </view>

      <view class="menu-item">
        <view class="menu-left">
          <up-icon name="setting" size="22" color="#333333" />
          <text>组队打卡</text>
        </view>
        <text class="menu-right">
          5/6已达成目标 >
        </text>
      </view>

      <view class="menu-item">
        <view class="menu-left">
          <up-icon name="star" size="22" color="#333333" />
          <text>开发专题</text>
        </view>
        <view class="new-tag">
          NEW
        </view>
      </view>

      <view class="menu-item">
        <view class="menu-left">
          <up-icon name="clock" size="22" color="#333333" />
          <text>学习提醒</text>
        </view>
      </view>

      <view class="menu-item">
        <view class="menu-left">
          <up-icon name="list" size="22" color="#333333" />
          <text>开放活动</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.my-page {
  min-height: calc(100vh - 40rpx);
  background: linear-gradient(135deg, #e0ffe9 0%, #f3eaff 100%);
  padding-bottom: 40rpx;
  box-shadow: 0 -10rpx 10rpx rgba($color: #000000, $alpha: 0.4);
}

.status-bar {
  background: transparent;
}

.user-info-area {
  margin: 24rpx 24rpx 0 24rpx;
  position: relative;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 2rpx solid #ffffff;
  box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.08);
}

.user-name {
  margin-left: 20rpx;
  flex: 1;
}

.nickname-row {
  display: flex;
  align-items: center;
}

.nickname {
  font-size: 32rpx;
  color: #222;
  font-weight: bold;
  margin-right: 15rpx;
}

.vip-tag {
  font-size: 20rpx;
  background: linear-gradient(90deg, #ffe0b2 0%, #ffd600 100%);
  color: #9a6027;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
}

.user-desc {
  font-size: 24rpx;
  color: #888;
  margin-top: 4rpx;
}

.vip-area {
  background: linear-gradient(90deg, #fffbe7 0%, #fff6e0 100%);
  border-radius: 16rpx;
  padding: 24rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.04);
}

.vip-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
  color: #9a6027;
}

.vip-btn {
  background: linear-gradient(90deg, #ffd600 0%, #ffe0b2 100%);
  color: #9a6027;
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  line-height: 1.5;
  margin: auto 0;
  height: auto;
  width: 150rpx;
  box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.06);
}

.icon-menu {
  background: #fff;
  margin: 24rpx 24rpx 0 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.06);
  padding: 30rpx 20rpx;
  display: flex;
  justify-content: space-around;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
}

.icon-text {
  font-size: 24rpx;
  color: #333;
  margin-top: 10rpx;
}

.menu-list {
  background: #fff;
  margin: 24rpx 24rpx 0 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  &:last-child {
    border-bottom: 0;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.menu-right {
  font-size: 26rpx;
  color: #999;
}

.new-tag {
  background: #ff5a5f;
  color: #fff;
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
}

.bottom-tools {
  background: #fff;
  margin: 32rpx 24rpx 24rpx 24rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.06);
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 24rpx;
  z-index: 10;
}

.tool-item {
  display: flex;
  align-items: center;
  width: 45%;
  background: #f8f8f8;
  padding: 20rpx;
  border-radius: 12rpx;
}

.tool-icon {
  margin-right: 15rpx;
}

.tool-text {
  display: flex;
  flex-direction: column;
}

.tool-desc {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}
</style>
