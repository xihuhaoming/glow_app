/**
 * UniCloud 云函数示例
 * 用户登录云函数
 */

const db = uniCloud.database();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// JWT密钥 (生产环境应从环境变量获取)
const JWT_SECRET = 'your-jwt-secret-key';

exports.main = async (event, context) => {
  const { username, password } = event;
  
  try {
    // 输入验证
    if (!username || !password) {
      return {
        errCode: 1001,
        errMsg: '用户名和密码不能为空'
      };
    }

    // 查询用户
    const userResult = await db.collection('users')
      .where({
        $or: [
          { username },
          { email: username },
          { phone: username }
        ]
      })
      .get();

    if (userResult.data.length === 0) {
      return {
        errCode: 1002,
        errMsg: '用户不存在'
      };
    }

    const user = userResult.data[0];

    // 验证密码
    const passwordHash = crypto.createHash('md5').update(password + user.salt).digest('hex');
    if (passwordHash !== user.password) {
      return {
        errCode: 1003,
        errMsg: '密码错误'
      };
    }

    // 检查用户状态
    if (user.status === 'disabled') {
      return {
        errCode: 1004,
        errMsg: '账户已被禁用'
      };
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 更新最后登录时间
    await db.collection('users').doc(user._id).update({
      lastLoginTime: Date.now(),
      lastLoginIP: context.CLIENTIP
    });

    // 返回用户信息 (不包含敏感信息)
    return {
      errCode: 0,
      result: {
        token,
        userInfo: {
          id: user._id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          birthday: user.birthday,
          createTime: user.createTime
        }
      }
    };

  } catch (error) {
    console.error('登录失败:', error);
    return {
      errCode: 500,
      errMsg: '服务器错误'
    };
  }
};