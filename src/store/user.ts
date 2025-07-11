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
    const uniIdCo = uniCloud.importObject('uni-id-co')
    // 设置用户信息
    const setUserInfo = (val) => {
      if (!val.avatar)
        val.avatar = userInfoState.avatar
      userInfo.value = val
    }

    const getUserInfo = async () => {
      console.log('--- getUserInfo START ---')
      const result = await uniIdCo.getAccountInfo()
      console.log('--- getUserInfo END ---')
      return result
    }

    const loginWithWechat = async (userInfo) => {
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

          // 3. 【客户端再次调用】我们新的云函数来更新用户信息
          console.log('正在调用云函数 update-profile...')
          await uniCloud.callFunction({
            name: 'update-profile',
            data: {
              userInfo,
            },
          })
          console.log('用户信息更新成功！')

          // 4. 更新前端 Pinia 的状态
          setUserInfo({
            id: loginResult.uid,
            username: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            token: loginResult.newToken.token,
          })

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
      console.log('--- checkLoginStatus START ---')
      const token = uni.getStorageSync('uni_id_token')
      const tokenExpired = uni.getStorageSync('uni_id_token_expired')
      console.log(`[checkLoginStatus] 检查到 token: ${token || 'null'}`)

      if (token && tokenExpired && tokenExpired > Date.now()) {
        console.log('[checkLoginStatus] 检查结果: true (已登录)')
        console.log('--- checkLoginStatus END ---')
        return true
      }
      console.log('[checkLoginStatus] 检查结果: false (未登录或已过期)')
      console.log('--- checkLoginStatus END ---')
      return false
    }

    // 登出
    const logout = async () => {
      console.log('--- logout START ---')
      try {
        await uniIdCo.logout()
        console.log('[logout] uniIdCo.logout() 调用成功。')
      }
      catch (e) {
        console.error('[logout] uniIdCo.logout() 调用失败:', e)
      }

      console.log('[logout] 正在从storage中清除token...')
      uni.removeStorageSync('uni_id_token')
      uni.removeStorageSync('uni_id_token_expired')
      const tokenAfterLogout = uni.getStorageSync('uni_id_token')
      console.log(`[logout] 清除后检查token: ${tokenAfterLogout || 'null'}`)
      userInfo.value = { ...userInfoState }
      console.log('--- logout END ---')
    }

    return {
      userInfo,
      setUserInfo,
      loginWithWechat,
      checkLoginStatus,
      logout,
      getUserInfo,
    }
  },
  {
    persist: true,
  },
)
