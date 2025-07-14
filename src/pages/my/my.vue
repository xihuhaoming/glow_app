<route lang="json5">
  {
    layout: 'tabbar',
    style: {
      navigationBarTitleText: '我的',
      navigationStyle: 'custom' // 使用自定义导航栏以匹配截图
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
// const userInfo = userStore.getUserInfo()
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
              {{ isLoggedIn ? userInfo.nickname : '美叶e勤川' }}
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
          <up-icon name="arrow-right" size="12" color="#ffffff" />
          <text>开通会员享VIP会员</text>
        </view>
        <button class="vip-btn">
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

    <!-- 底部工具栏 -->
    <view class="bottom-tools">
      <view class="tool-item">
        <up-icon name="home" size="24" color="#00c38d" class="tool-icon" />
        <view class="tool-text">
          <text>开会WebMeet</text>
          <text class="tool-desc">
            免费视频会议
          </text>
        </view>
      </view>
      <view class="tool-item">
        <up-icon name="chat" size="24" color="#00c38d" class="tool-icon" />
        <view class="tool-text">
          <text>开会Talk</text>
          <text class="tool-desc">
            语音会议沟通
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

  <style lang="scss">
  .my-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.status-bar {
  background-color: #00c38d; /* 绿色状态栏 */
}

.user-info-area {
  background-color: #00c38d; /* 绿色背景 */
  padding: 20rpx 30rpx 0;
  position: relative;
}

.user-header {
  display: flex;
  align-items: center;
  position: relative;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 2rpx solid #ffffff;
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
  color: #ffffff;
  font-weight: bold;
  margin-right: 15rpx;
}

.vip-tag {
  font-size: 20rpx;
  background-color: #9a6027;
  color: #fff8e7;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
}

.user-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.vip-area {
  background: linear-gradient(to left, #333, #111111);
  border-radius: 12rpx 12rpx 0 0;
  padding: 30rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
}

.vip-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
  color: #ffffff;
}

.vip-btn {
  background-color: #ffd600;
  color: #111111;
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  line-height: 1.5;
  margin: auto 0;
  height: auto;
  width: 150rpx;
}

.icon-menu {
  background-color: #ffffff;
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
  background-color: #ffffff;
  margin-top: 20rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
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
  background-color: #ff5a5f;
  color: #ffffff;
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
}

.bottom-tools {
  background-color: #ffffff;
  margin-top: 20rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
}

.tool-item {
  display: flex;
  align-items: center;
  width: 45%;
  background-color: #f8f8f8;
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
