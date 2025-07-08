'use strict'

// 引入uni-id-common
const uniID = require('uni-id-common')
// 引入https模块用于请求微信API
const https = require('https')

exports.main = async function (event, context) {
  console.log('wx-login云函数收到参数:', event)
  
  try {
    // 创建uni-id实例，用于生成token等操作
    const uniIDIns = uniID.createInstance({
      context: context
    })
    
    console.log('uni-id实例创建成功')
    
    // 获取uni-id配置
    const config = uniIDIns.config
    console.log('获取到配置:', JSON.stringify({
      hasConfig: !!config
    }))
    
    // 获取微信小程序配置
    const mpWeixinConfig = config && config['mp-weixin'] && config['mp-weixin'].oauth && config['mp-weixin'].oauth.weixin
    if (!mpWeixinConfig || !mpWeixinConfig.appid || !mpWeixinConfig.appsecret) {
      return {
        code: 1,
        message: '微信小程序配置错误，请检查uni-id配置文件'
      }
    }
    
    const { action, params = {} } = event
    
    if (!action) {
      return {
        code: 1,
        message: '缺少action参数'
      }
    }
    
    // 处理各种操作
    switch (action) {
      case 'login':
        // 微信登录
        if (!params.code) {
          return { 
            code: 1,
            message: '缺少code参数' 
          }
        }
        
        try {
          // 使用code获取openid和session_key
          const wxResult = await getWeixinOpenid(params.code, mpWeixinConfig.appid, mpWeixinConfig.appsecret)
          console.log('获取微信openid结果:', wxResult)
          
          if (wxResult.errcode) {
            // 处理常见错误
            let errorMessage = wxResult.errmsg || '获取openid失败'
            
            if (wxResult.errcode === 40125) {
              errorMessage = 'AppSecret错误或已重置，请检查配置'
            } else if (wxResult.errcode === 40029) {
              errorMessage = 'code无效或已过期，请重新获取'
            } else if (wxResult.errcode === 45011) {
              errorMessage = '请求频率限制，请稍后再试'
            } else if (wxResult.errcode === 40163) {
              errorMessage = 'code已被使用，请重新获取'
            }
            
            return {
              code: wxResult.errcode,
              message: `微信登录失败: ${errorMessage}`
            }
          }
          
          // 获取openid成功，创建token
          const tokenResult = await uniIDIns.createToken({
            uid: wxResult.openid // 使用openid作为用户ID

            
          })
          
          if (tokenResult.code !== 0) {
            return tokenResult
          }
          
          // 返回成功结果
          return {
            code: 0,
            message: '登录成功',
            token: tokenResult.token,
            tokenExpired: tokenResult.tokenExpired,
            openid: wxResult.openid,
            uid: wxResult.openid,
            userInfo: {
              openid: wxResult.openid,
              nickname: '微信用户',
              avatar: '/static/images/default-avatar.png'
            }
          }
        } catch (e) {
          console.error('微信登录处理出错:', e)
          return {
            code: 1,
            message: `微信登录处理出错: ${e.message || JSON.stringify(e)}`
          }
        }
      
      case 'getUserInfo':
        // 获取用户信息
        if (!params.uid) {
          return {
            code: 1,
            message: '缺少uid参数'
          }
        }
        
        try {
          const res = await uniIDIns.getUserInfo({
            uid: params.uid,
            field: params.field
          })
          
          return res
        } catch (e) {
          console.error('获取用户信息出错:', e)
          return {
            code: 1,
            message: `获取用户信息失败: ${e.message || JSON.stringify(e)}`
          }
        }
        
      case 'updateUser':
        // 更新用户信息
        if (!params.uid) {
          return {
            code: 1,
            message: '缺少uid参数'
          }
        }
        
        try {
          const res = await uniIDIns.updateUser({
            uid: params.uid,
            nickname: params.nickname,
            gender: params.gender,
            avatar: params.avatar
          })
          
          return res
        } catch (e) {
          console.error('更新用户信息出错:', e)
          return {
            code: 1,
            message: `更新用户信息失败: ${e.message || JSON.stringify(e)}`
          }
        }
      
      case 'checkToken':
        // 校验token
        if (!params.token) {
          return {
            code: 1,
            message: '缺少token参数'
          }
        }
        
        try {
          const res = await uniIDIns.checkToken(params.token)
          return res
        } catch (e) {
          console.error('校验token出错:', e)
          return {
            code: 1,
            message: `校验token失败: ${e.message || JSON.stringify(e)}`
          }
        }
      
      default:
        return {
          code: 1,
          message: `不支持的操作: ${action}`
        }
    }
  } catch (e) {
    console.error('云函数执行出错:', e)
    return {
      code: 1,
      message: `云函数执行出错: ${e.message || JSON.stringify(e)}`
    }
  }
}

// 向微信服务器获取openid和session_key
function getWeixinOpenid(code, appid, appsecret) {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`
    
    https.get(url, (res) => {
      res.setEncoding('utf8')
      let rawData = ''
      
      res.on('data', (chunk) => {
        rawData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          resolve(parsedData)
        } catch (e) {
          reject(new Error(`获取微信openid解析响应失败: ${e.message}`))
        }
      })
    }).on('error', (e) => {
      reject(new Error(`获取微信openid请求失败: ${e.message}`))
    })
  })
}
