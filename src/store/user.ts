// src/store/user.ts中添加或修改微信登录相关代码

import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户信息初始状态
const userInfoState = {
  id: 0,
  username: '',
  avatar: '/static/images/default-avatar.png',
  token: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({ ...userInfoState })

    // 设置用户信息
    const setUserInfo = (val) => {
      if (!val.avatar)
        val.avatar = userInfoState.avatar
      userInfo.value = val
    }

    const getUserInfo = async () => {
      const result = await uniCloud.callFunction({
        name: 'uni-id-cf',
        data: { action: 'getUserInfo' },
      })
      return result.result
    }

    // 微信小程序登录
    const wxMiniProgramLogin = async () => {
      try {
        // 获取微信登录凭证
        const { code } = await uni.login({ provider: 'weixin' })

        console.log('code', code)

        // 调用云函数进行登录
        const result = await uniCloud.callFunction({
          name: 'uni-id-cf',
          data: {
            action: 'loginByWeixin',
            params: { code },
          },
        })

        if (result.result.code === 0) {
          // 保存token和用户信息
          uni.setStorageSync('uni_id_token', result.result.token)
          uni.setStorageSync('uni_id_token_expired', result.result.tokenExpired)

          // 更新store中的用户信息
          setUserInfo({
            id: result.result.uid,
            username: result.result.userInfo.nickname || '微信用户',
            avatar: result.result.userInfo.avatar_file?.url || userInfoState.avatar,
            token: result.result.token,
          })

          return result.result
        }
        else {
          throw new Error(result.result.message || '登录失败')
        }
      }
      catch (error) {
        console.error('微信登录失败:', error)
        throw error
      }
    }

    // 检查登录状态
    const checkLoginStatus = () => {
      const token = uni.getStorageSync('uni_id_token')
      const tokenExpired = uni.getStorageSync('uni_id_token_expired')

      // 检查token是否存在且未过期
      if (token && tokenExpired && tokenExpired > Date.now()) {
        return true
      }
      return false
    }

    // 登出
    const logout = async () => {
      await uniCloud.callFunction({
        name: 'uni-id-cf',
        data: { action: 'logout' },
      })

      uni.removeStorageSync('uni_id_token')
      uni.removeStorageSync('uni_id_token_expired')
      userInfo.value = { ...userInfoState }
    }

    return {
      userInfo,
      setUserInfo,
      wxMiniProgramLogin,
      checkLoginStatus,
      logout,
      getUserInfo,
    }
  },
  {
    persist: true,
  },
)
