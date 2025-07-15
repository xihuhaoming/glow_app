<route lang="json5">
{
  "navigationBarTitleText": "会员中心"
}
</route>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'VipPage',
})

// 金币特权数据
const coinPrivileges = ref([
  { icon: '/static/images/coin-privilege-1.png', name: '创新特权' },
  { icon: '/static/images/coin-privilege-2.png', name: '课程优惠' },
  { icon: '/static/images/coin-privilege-3.png', name: '会员专享' },
  { icon: '/static/images/coin-privilege-4.png', name: '专家咨询' },
  { icon: '/static/images/coin-privilege-5.png', name: '等等' },
])

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 处理支付
function handlePay() {
  uni.showToast({
    title: '正在处理支付...',
    icon: 'loading',
  })
  // 这里添加实际的支付逻辑
}
</script>

<template>
  <view class="vip-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-icon" @click="goBack">
        <text class="icon">
          &#xe60e;
        </text>
      </view>
      <view class="nav-title">
        享专属特权
      </view>
      <view class="share-icon">
        <text class="icon">
          &#xe60f;
        </text>
      </view>
    </view>

    <!-- Keap会员标签 -->
    <view class="keap-member">
      <text>Keap 会员</text>
      <view class="diamond-icon">
        <image src="/static/images/diamond.png" mode="aspectFit" />
      </view>
    </view>

    <!-- 会员特权套餐 -->
    <view class="privilege-section">
      <view class="section-title">
        会员特权
      </view>

      <view class="package-list">
        <view class="package-item active">
          <view class="package-name">
            连续包年
          </view>
          <view class="package-price">
            <text class="price-symbol">
              ¥
            </text>
            <text class="price-value">
              218
            </text>
          </view>
          <view class="package-tag">
            超值套餐
          </view>
        </view>

        <view class="package-item">
          <view class="package-name">
            连续包季
          </view>
          <view class="package-price">
            <text class="price-symbol">
              ¥
            </text>
            <text class="price-value">
              ?
            </text>
          </view>
        </view>

        <view class="package-item">
          <view class="package-name">
            连续包月
          </view>
          <view class="package-price">
            <text class="price-symbol">
              ¥
            </text>
            <text class="price-value">
              9
            </text>
          </view>
        </view>
      </view>

      <view class="notice-text">
        <text>到期自动续费，随时可取消，可享优惠价</text>
      </view>
    </view>

    <!-- 金币特权 -->
    <view class="coin-privilege">
      <view class="section-header">
        <text class="title">
          金币特权
        </text>
        <text class="more">
          更多 >
        </text>
      </view>

      <view class="coin-icons">
        <view v-for="(item, index) in coinPrivileges" :key="index" class="coin-item">
          <view class="coin-icon">
            <image :src="item.icon" mode="aspectFit" />
          </view>
          <text class="coin-name">
            {{ item.name }}
          </text>
        </view>
      </view>
    </view>

    <!-- 会员套餐能测评计划 -->
    <view class="evaluation-plan">
      <image src="/static/images/vip-banner.png" mode="widthFix" class="plan-banner" />
    </view>

    <!-- 底部支付按钮 -->
    <view class="footer">
      <button class="pay-button" @click="handlePay">
        立即支付 218 元
      </button>
    </view>
  </view>
</template>

  <style lang="scss">
  .vip-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  position: relative;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #000;
  color: #fff;
  height: 88rpx;
}

.back-icon,
.share-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: bold;
}

.keap-member {
  background-color: #000;
  color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
}

.diamond-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 10rpx;
}

.diamond-icon image {
  width: 100%;
  height: 100%;
}

.privilege-section {
  background-color: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.package-list {
  display: flex;
  justify-content: space-between;
}

.package-item {
  width: 30%;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 20rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2rpx solid transparent;
}

.package-item.active {
  border-color: #ffd700;
  background-color: #fffde7;
}

.package-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.package-price {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 24rpx;
  color: #ff5252;
}

.price-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff5252;
}

.package-tag {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #ff5252;
  color: white;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.notice-text {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
  text-align: center;
}

.coin-privilege {
  background-color: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-header .title {
  font-size: 28rpx;
  color: #333;
}

.section-header .more {
  font-size: 24rpx;
  color: #999;
}

.coin-icons {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.coin-item {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
}

.coin-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10rpx;
}

.coin-icon image {
  width: 50rpx;
  height: 50rpx;
}

.coin-name {
  font-size: 24rpx;
  color: #666;
}

.evaluation-plan {
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.plan-banner {
  width: 100%;
  height: auto;
  border-radius: 16rpx;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.pay-button {
  background-color: #ffd700;
  color: #333;
  font-size: 32rpx;
  font-weight: bold;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  width: 100%;
}
</style>
