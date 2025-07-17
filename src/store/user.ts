// src/store/user.ts中添加或修改微信登录相关代码

import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  mutations,
} from '@/uni_modules/uni-id-pages/common/store.js'
// 用户信息初始状态
const userInfoState = {
  id: 0,
  username: '',
  avatar: '/static/images/default-avatar.png',
  token: '',
  nickname: '',
  gender: '',
  country: '',
  province: '',
  city: '',
  language: '',
  comment: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({ ...userInfoState })
    const uniIdCo = uniCloud.importObject('uni-id-co')
    // 设置用户信息
    const setUserInfo = (val) => {
      if (!val.avatar)
        val.avatar = userInfoState.avatar
      userInfo.value = val
    }

    function getUserInfo() {
      return userInfo.value
    }
    // ... 省略前面代码 ...
    const fetchUserInfoFromDB = async () => {
      try {
        const token = uni.getStorageSync('uni_id_token')
        if (!token)
          throw new Error('未获取到token')
        const result = await uniCloud.callFunction({
          name: 'update-profile',
          data: { uniIdToken: token },
        })
        if (result.result && result.result.data && result.result.data.length > 0) {
          const dbUserInfo = result.result.data[0]
          setUserInfo({
            ...userInfoState,
            ...dbUserInfo,
            token,
          })
          return dbUserInfo
        }
        else {
          throw new Error('未查到用户信息')
        }
      }
      catch (e) {
        console.error('获取数据库用户信息失败', e)
        throw e
      }
    }
    const loginWithWechat = async () => {
      try {
        // 1. 获取登录凭证 code
        const { code } = await uni.login({ provider: 'weixin' })

        // 2. 【客户端直接调用】uni-id-co 完成登录，获取token
        const loginResult = await uniIdCo.loginByWeixin({ code })

        if (loginResult && loginResult.errCode === 0) {
          console.log('登录成功，Token已获取。')
          // 保存token，进入登录状态
          uni.setStorageSync('uni_id_token', loginResult.newToken.token)
          uni.setStorageSync('uni_id_token_expired', loginResult.newToken.tokenExpired)

          console.log('loginResult', loginResult)

          // 登录成功后，拉取数据库用户信息
          await fetchUserInfoFromDB()
          return loginResult
        }
        else {
          throw new Error(loginResult.errMsg || 'uni-id-co登录失败')
        }
      }
      catch (error) {
        console.error('Store登录流程出错:', error)
        throw error
      }
    }

    // 检查登录状态
    const checkLoginStatus = () => {
      const token = uni.getStorageSync('uni_id_token')
      const tokenExpired = uni.getStorageSync('uni_id_token_expired')

      if (token && tokenExpired && tokenExpired > Date.now()) {
        return true
      }
      return false
    }

    // 登出
    const logout = async () => {
      mutations.logout()
    }

    return {
      userInfo,
      setUserInfo,
      loginWithWechat,
      checkLoginStatus,
      logout,
      getUserInfo,
      fetchUserInfoFromDB,
    }
  },
  {
    persist: true,
  },
)
