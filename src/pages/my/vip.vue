<route lang="json5">
  {
      "style": {
          "navigationBarTitleText": "",
          "navigationBarBackgroundColor": "#252525",
          "navigationBarTextStyle": "white"
      }
  }
  </route>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'VipPage',
})

const payPrice = ref(218)

// 金币特权数据
const coinPrivileges = ref([
  { icon: '\uE64F', name: '创新特权' },
  { icon: '\uE602', name: '课程优惠' },
  { icon: '\uE619', name: '会员专享' },
  { icon: '\uE65A', name: '专家咨询' },
  { icon: '\uE60A', name: '等等' },
])
const statusBarHeight = ref(0)
const activeIndex = ref(0)
const packageList = ref([
  {
    name: '连续包年',
    price: 218,
    tag: '超值套餐',
  },
  {
    name: '连续包季',
    price: 34,
  },
  {
    name: '连续包月',
    price: 19.9,
  },
])

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 处理支付
async function handlePay() {
  uni.showToast({
    title: '正在处理支付...',
    icon: 'loading',
  })
  // 这里添加实际的支付逻辑
  // 有云函数

  const uniPay = uniCloud.importObject('uni-pay-co')
  const res = await uniPay.pay({
    price: packageList.value[activeIndex.value].price,
    success: () => {
      uni.showToast({
        title: '支付成功',
        icon: 'success',
      })
    },
  })
  console.log(res)
}

onLoad(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight * 2 + 20 // 转换为rpx
})

function handlePackageClick(index: number) {
  activeIndex.value = index
  payPrice.value = packageList.value[index].price
}
</script>

<template>
  <view class="vip-page">
    <up-navbar :auto-back="true" :placeholder="true" :safe-area-inset-bottom="true" bg-color="#252525" left-icon-color="#fff" />

    <!-- Keap会员标签 -->
    <view class="keap-member">
      <text>Keap 会员</text>
      <view class="diamond-icon">
        <text class="iconfont icon-diamond" />
      </view>
    </view>

    <!-- 会员特权套餐 -->
    <view class="privilege-section">
      <view class="section-title">
        会员特权
      </view>

      <view class="package-list">
        <view v-for="(item, index) in packageList" :key="index" class="package-item" :class="{ active: activeIndex === index }" @click="handlePackageClick(index)">
          <view class="package-name">
            {{ item.name }}
          </view>
          <view class="package-price">
            <text class="price-symbol">
              ¥
            </text>
            <text class="price-value">
              {{ item.price }}
            </text>
          </view>
          <view v-if="item.tag" class="package-tag">
            {{ item.tag }}
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
            <text class="iconfont" :class="`icon-${index}`">
              {{ item.icon }}
            </text>
          </view>
          <text class="coin-name">
            {{ item.name }}
          </text>
        </view>
      </view>
    </view>

    <!-- 会员套餐能测评计划 -->
    <view class="evaluation-plan">
      <view class="plan-content">
        <view class="plan-text">
          <view class="plan-title">
            享受免费智能测评计划
          </view>
          <view class="plan-subtitle">
            完成测评并获得专属分析报告
          </view>
        </view>
        <view class="plan-button">
          <text>立即测评</text>
        </view>
      </view>
    </view>

    <!-- 底部支付按钮 -->
    <view class="footer">
      <button class="pay-button" @click="handlePay">
        立即支付 {{ packageList[activeIndex].price }} 元
      </button>
    </view>
  </view>
</template>

  <style lang="scss">
  /* 加载动画样式 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid rgba(240, 191, 96, 0.3);
  border-radius: 50%;
  border-top-color: #f0bf60;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 其他样式保持不变 */
.vip-page {
  background-color: #f8f8f8;
  position: relative;
  padding-bottom: 130rpx;
}
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #252525;
  color: #fff;
  height: 88rpx;
  padding-top: 60rpx; /* 适配状态栏 */
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
  color: #f0bf60; /* 金色标题 */
}

.iconfont {
  font-family: 'iconfont';
}

.keap-member {
  background-color: #252525;
  color: #fff;
  padding: 20rpx 30rpx;
  padding-top: 10rpx;
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
}

.diamond-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 10rpx;
  color: #f0bf60; /* 金色图标 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.privilege-section {
  background-color: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  border-radius: 20rpx 20rpx 0 0;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 30rpx;
}

.package-list {
  display: flex;
  justify-content: space-between;
}

.package-item {
  width: 23%;
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
  border-color: #f0bf60; /* 金色边框 */
  background-color: #fffde7;
}

.package-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  text-align: center;
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
  margin-top: 2rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
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
  flex-wrap: nowrap;
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
  background-color: #f9f4e6;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10rpx;
  color: #f0bf60; /* 金色图标 */
}

.coin-name {
  font-size: 24rpx;
  color: #666;
}

.evaluation-plan {
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.plan-content {
  width: 100%;
  height: 160rpx;
  border-radius: 16rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-sizing: border-box;
  background: linear-gradient(to right, #f8f8f8, #fff);
}

.plan-text {
  display: flex;
  flex-direction: column;
}

.plan-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.plan-subtitle {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.plan-button {
  background-color: #f0bf60;
  color: #333;
  font-size: 26rpx;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  font-weight: bold;
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
  background-color: #f0bf60; /* 金色按钮 */
  color: #333;
  font-size: 32rpx;
  font-weight: bold;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  width: 100%;
}
</style>
