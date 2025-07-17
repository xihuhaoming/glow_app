<route lang="json5">
    {
      layout: 'custom',
      style: {
        navigationBarTitleText: '编辑个人资料'
      },
    }
  </route>

<script lang="ts" setup>
import useUpload from '@/hooks/useUpload'
import { useUserStore } from '@/store/user'
import { mutations, store } from '@/uni_modules/uni-id-pages/common/store.js'
// 导入新的上传工具
// import { uploadFileUrl, useUpload } from '@/utils/uploadFile'

defineOptions({
  name: 'UserEditPage',
})

const userStore = useUserStore()
const userInfo = ref(userStore.getUserInfo())
const uniIdCo = uniCloud.importObject('uni-id-co')
// 表单提交状态
const submitting = ref(false)
onLoad(() => {
  // 从 store 中深拷贝一份用户信息用于编辑，避免直接修改 store
  if (userStore.userInfo) {
    userInfo.value = JSON.parse(JSON.stringify(userStore.userInfo))
  }
})
// 上传头像
// const { loading: uploadLoading, run: uploadAvatar } = useUpload({
//   fileType: 'image',
//   maxSize: 5 * 1024 * 1024, // 5MB
//   success: (data) => {
//     // 上传成功后的处理
//     userInfo.value.avatar = data.url // 或者根据实际返回结构调整
//   },
//   error: (err) => {
//     console.error('上传失败:', err)
//     uni.showToast({
//       title: '上传失败，请重试',
//       icon: 'none',
//     })
//   },
// })

// 选择头像
async function chooseAvatar() {
  try {
    const res = await uniCloud.chooseAndUploadFile({
      type: 'image',
      count: 1, // 只选一张图片
      sizeType: ['compressed'], // 使用压缩图
      sourceType: ['album', 'camera'], // 允许从相册或相机获取
      onChooseFile(res) {
        // 可以在这里对图片进行处理，例如裁剪
        console.log('已选择图片:', res)
        return res // 直接返回原始结果
      },
      onUploadProgress(progressEvent) {
        console.log('上传进度:', progressEvent)
      },
    })

    console.log('上传结果:', res)

    // 上传成功后，获取图片URL并更新用户头像
    if (res.tempFiles && res.tempFiles.length > 0) {
      userInfo.value.avatar = res.tempFiles[0].url
      console.log('头像已更新为:', userInfo.value.avatar)
    }
  }
  catch (error) {
    console.error('头像上传失败:', error)
    uni.showToast({
      title: '上传失败，请重试',
      icon: 'none',
    })
  }
}

// 保存用户信息
async function saveUserInfo() {
  if (!userInfo.value.nickname) {
    uni.showToast({
      title: '昵称不能为空',
      icon: 'none',
    })
    return
  }

  submitting.value = true

  try {
    // 获取云数据库对象
    const db = uniCloud.database()

    // 准备要更新的数据
    const userDataToUpdate = {
      nickname: userInfo.value.nickname,
      gender: userInfo.value.gender,
      comment: userInfo.value.comment,
      avatar: userInfo.value.avatar,
    }

    // 如果有修改个人简介
    if (userInfo.value.comment) {
      userDataToUpdate.comment = userInfo.value.comment
    }

    // 如果有修改头像
    if (userInfo.value.avatar && userInfo.value.avatar !== userStore.getUserInfo().avatar) {
      userDataToUpdate.avatar = userInfo.value.avatar
    }

    // 调用云函数更新用户信息
    const result = await uniCloud.callFunction({
      name: 'update-user-info',
      data: {
        userInfo: userDataToUpdate,
      },
    })

    console.log('result', result)

    if (result.result.code === 0) {
      // 更新本地存储
      userStore.setUserInfo({
        ...userStore.getUserInfo(),
        ...userDataToUpdate,
      })

      uni.showToast({
        title: '保存成功',
        icon: 'success',
      })

      // 触发全局事件
      uni.$emit('userProfileUpdated', userDataToUpdate)
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  }
  catch (error) {
    console.error('保存失败', error)
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <up-navbar title="编辑个人资料" :auto-back="true" />
  <view class="edit-page">
    <!-- 头像区域 -->
    <view class="avatar-section">
      <view class="avatar-wrapper" @click="chooseAvatar">
        <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
        <view class="avatar-overlay">
          <up-icon name="camera-fill" size="24" color="#ffffff" />
          <text class="avatar-text">
            更换头像
          </text>
        </view>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-item">
        <view class="form-label">
          昵称
        </view>
        <up-input
          v-model="userInfo.nickname"
          class="form-input"
          type="text"
          placeholder="请输入昵称"
          maxlength="20"
        />
      </view>

      <view class="form-item">
        <view class="form-label">
          性别
        </view>
        <view class="gender-group">
          <view
            class="gender-option"
            :class="{ active: userInfo.gender === '1' }"
            @click="userInfo.gender = '1'"
          >
            <up-icon name="man" size="20" :color="userInfo.gender === '1' ? '#00c38d' : '#999999'" />
            <text>男</text>
          </view>
          <view
            class="gender-option"
            :class="{ active: userInfo.gender === '2' }"
            @click="userInfo.gender = '2'"
          >
            <up-icon name="woman" size="20" :color="userInfo.gender === '2' ? '#00c38d' : '#999999'" />
            <text>女</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <view class="form-label">
          个人简介
        </view>
        <up-textarea v-model="userInfo.comment" placeholder="介绍一下自己吧..." count />
        <!-- <up-textarea
          v-model="userInfo.comment"
          class="form-textarea"
          placeholder="介绍一下自己吧..."
          maxlength="200"
        >
          <template #right>
            <view class="textarea-counter">
              {{ (userInfo.comment || '').length }}/200
            </view>
          </template>
        </up-textarea> -->
      </view>

      <view class="form-item">
        <view class="form-label">
          地区
        </view>
        <view class="form-value">
          {{ userInfo.province || '' }} {{ userInfo.city || '' }}
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <up-button
        class="submit-btn"
        :disabled="submitting"
        :loading="submitting"
        type="success"
        :border-radius="20"
        @click="saveUserInfo"
      >
        保存
      </up-button>
    </view>
  </view>
</template>

  <style lang="scss">
  .edit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.avatar-section {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
}

.avatar-wrapper {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx 0;
}

.avatar-text {
  color: #ffffff;
  font-size: 20rpx;
  margin-top: 4rpx;
}

.form-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin: 0 20rpx;
  padding: 20rpx;
}

.form-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.form-input {
  height: 80rpx;
  font-size: 28rpx;
  padding: 0 20rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

.form-textarea {
  width: 100%;
  height: 300rpx;
  font-size: 28rpx;
  padding: 30rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.textarea-counter {
  text-align: right;
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.gender-group {
  display: flex;
  gap: 40rpx;
}

.gender-option {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 28rpx;
  color: #666666;
  padding: 16rpx 30rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

.gender-option.active {
  background-color: rgba(0, 195, 141, 0.1);
  color: #00c38d;
}

.form-value {
  font-size: 28rpx;
  color: #666666;
}

.submit-section {
  padding: 40rpx 20rpx 0;
}

.submit-btn {
  background-color: #00c38d;
  color: #ffffff;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
}

.submit-btn[disabled] {
  background-color: #cccccc;
  color: #ffffff;
}
</style>
