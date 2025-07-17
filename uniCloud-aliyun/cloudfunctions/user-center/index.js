'use strict'
const db = uniCloud.database()
const uniIdCo = uniCloud.importObject('uni-id-co')

exports.main = async (event, context) => {
  const {
    code,
    userInfo, // 客户端通过 uni.getUserProfile() 获取到的用户信息
  } = event

  // 1. 使用 code 调用 uni-id-co 完成登录/注册
  const loginResult = await uniIdCo.loginByWeixin({
    code,
  })

  if (loginResult.errCode !== 0) {
    return loginResult
  }

  // 2. 登录成功后，使用 uid 更新用户的详细信息
  const uid = loginResult.uid
  const dataToUpdate = {
    nickname: userInfo.nickName,
    avatar_file: {
      url: userInfo.avatarUrl,
    },
    gender: userInfo.gender,
    user_info: {
      country: userInfo.country,
      province: userInfo.province,
      city: userInfo.city,
      language: userInfo.language,
    },
  }
  await db.collection('uni-id-users').doc(uid).update(dataToUpdate)

  // 3. 将包含 token 的原始登录结果返回给客户端
  return loginResult
}
