/**
 * 验证码登录云函数
 */

const db = uniCloud.database();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-jwt-secret-key';

exports.main = async (event, context) => {
  const { phone, code } = event;
  
  try {
    // 输入验证
    if (!phone || !code) {
      return {
        errCode: 1001,
        errMsg: '手机号和验证码不能为空'
      };
    }

    // 验证验证码
    const smsResult = await db.collection('sms_logs')
      .where({
        phone,
        code,
        status: 'sent',
        expireTime: db.command.gte(Date.now())
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get();

    if (smsResult.data.length === 0) {
      return {
        errCode: 1002,
        errMsg: '验证码错误或已过期'
      };
    }

    // 标记验证码为已使用
    await db.collection('sms_logs').doc(smsResult.data[0]._id).update({
      status: 'used',
      useTime: Date.now()
    });

    // 查找或创建用户
    let userResult = await db.collection('users')
      .where({ phone })
      .get();

    let user;
    if (userResult.data.length === 0) {
      // 创建新用户
      const newUser = {
        phone,
        username: `user_${phone.slice(-4)}_${Date.now()}`,
        nickname: `用户${phone.slice(-4)}`,
        avatar: '',
        status: 'active',
        createTime: Date.now(),
        updateTime: Date.now()
      };

      const addResult = await db.collection('users').add(newUser);
      user = { ...newUser, _id: addResult.id };
    } else {
      user = userResult.data[0];
      
      // 检查用户状态
      if (user.status === 'disabled') {
        return {
          errCode: 1003,
          errMsg: '账户已被禁用'
        };
      }
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        phone: user.phone
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 更新最后登录时间
    await db.collection('users').doc(user._id).update({
      lastLoginTime: Date.now(),
      lastLoginIP: context.CLIENTIP,
      updateTime: Date.now()
    });

    return {
      errCode: 0,
      result: {
        token,
        userInfo: {
          id: user._id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          createTime: user.createTime,
          isNewUser: userResult.data.length === 0
        }
      }
    };

  } catch (error) {
    console.error('验证码登录失败:', error);
    return {
      errCode: 500,
      errMsg: '服务器错误'
    };
  }
};