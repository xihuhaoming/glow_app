'use strict'

const uniID = require('uni-id-common')

const db = uniCloud.database()

exports.main = async function (event, context) {
  // 1. 初始化 uniID 实例，它会自动从 context 中获取必要信息
  const uniIDIns = uniID.createInstance({
    context,
  })
  const {
    uid,
  } = await uniIDIns.checkToken(event.uniIdToken || event.token)

  if (!uid) {
    return {
      code: -1,
      msg: '参数错误',
    }
  }

  try {
    // 更新用户信息
    const userInfo = await db.collection('uni-id-users').doc(uid).get()
    console.log('userInfo', userInfo)
    return userInfo
  }
  catch (e) {
    console.error(e)
    return {
      code: -3,
      msg: '未找到用户信息',
      error: e.message,
    }
  }
}
