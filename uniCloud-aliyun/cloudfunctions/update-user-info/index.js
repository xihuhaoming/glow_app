// update-user-info/index.js
'use strict'
const uniID = require('uni-id-common')

const db = uniCloud.database()

exports.main = async (event, context) => {
  // 1. 初始化 uniID 实例，它会自动从 context 中获取必要信息
  const uniIDIns = uniID.createInstance({
    context,
  })

  const {
    uid,
  } = await uniIDIns.checkToken(event.uniIdToken || event.token)

  const {
    userInfo,
  } = event

  if (!userInfo) {
    return {
      code: -1,
      msg: '参数错误',
    }
  }

  try {
    // 更新用户信息
    await db.collection('uni-id-users').doc(uid).update({
      nickname: userInfo.nickname,
      gender: userInfo.gender,
      comment: userInfo.comment,
      avatar: userInfo.avatar,
      // 可以添加其他字段
    })

    return {
      code: 0,
      msg: '更新成功',
    }
  }
  catch (e) {
    console.error(e)
    return {
      code: -3,
      msg: '更新失败',
      error: e.message,
    }
  }
}
