'use strict'
const uniID = require('uni-id-common')

const db = uniCloud.database()

exports.main = async (event, context) => {
  // 1. 初始化 uniID 实例，它会自动从 context 中获取必要信息
  const uniIDIns = uniID.createInstance({
    context,
  })

  // 2. 检查 Token，如果无效会直接抛出错误，保护接口
  const {
    uid,
  } = await uniIDIns.checkToken(event.uniIdToken || event.token)

  // 如果代码能执行到这里，说明用户已合法登录
  const {
    userInfo,
  } = event // 从客户端调用时获取传递的 userInfo

  if (!userInfo) {
    return {
      errCode: 'PARAM_ERROR',
      errMsg: '缺少用户信息参数',
    }
  }

  console.log(userInfo)

  // 3. 准备数据并更新数据库
  const dataToUpdate = {
    nickname: userInfo.nickName,
    avatar_file: {
      url: userInfo.avatarUrl,
    },
    gender: userInfo.gender,
    user_info: { // 将其他信息存入一个子对象，保持主表结构清晰
      country: userInfo.country,
      province: userInfo.province,
      city: userInfo.city,
      language: userInfo.language,
    },
  }

  await db.collection('uni-id-users').doc(uid).update(dataToUpdate)

  // 4. 返回成功信息
  return {
    errCode: 0,
    errMsg: '更新成功',
  }
}
