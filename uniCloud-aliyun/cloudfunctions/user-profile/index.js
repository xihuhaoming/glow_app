/**
 * 获取用户信息云函数
 */

const db = uniCloud.database();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-jwt-secret-key';

exports.main = async (event, context) => {
  try {
    // 从context中获取token (uniCloud会自动解析Authorization header)
    const token = context.TOKEN || event.token;
    
    if (!token) {
      return {
        errCode: 1001,
        errMsg: '未提供认证令牌'
      };
    }

    // 验证JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return {
        errCode: 1002,
        errMsg: '认证令牌无效'
      };
    }

    // 查询用户信息
    const userResult = await db.collection('users')
      .doc(decoded.userId)
      .field({
        password: false,  // 不返回密码字段
        salt: false       // 不返回盐值字段
      })
      .get();

    if (userResult.data.length === 0) {
      return {
        errCode: 1003,
        errMsg: '用户不存在'
      };
    }

    const user = userResult.data[0];

    // 检查用户状态
    if (user.status === 'disabled') {
      return {
        errCode: 1004,
        errMsg: '账户已被禁用'
      };
    }

    return {
      errCode: 0,
      result: {
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthday: user.birthday,
        realName: user.realName,
        isRealNameAuth: !!user.realName,
        vipLevel: user.vipLevel || 0,
        points: user.points || 0,
        createTime: user.createTime,
        updateTime: user.updateTime
      }
    };

  } catch (error) {
    console.error('获取用户信息失败:', error);
    return {
      errCode: 500,
      errMsg: '服务器错误'
    };
  }
};