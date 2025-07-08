/**
 * 发送验证码云函数
 */

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { phone, type = 'login' } = event;
  
  try {
    // 输入验证
    if (!phone) {
      return {
        errCode: 1001,
        errMsg: '手机号不能为空'
      };
    }

    // 手机号格式验证
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      return {
        errCode: 1002,
        errMsg: '手机号格式不正确'
      };
    }

    // 检查发送频率限制
    const lastSendResult = await db.collection('sms_logs')
      .where({
        phone,
        createTime: db.command.gte(Date.now() - 60000) // 1分钟内
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get();

    if (lastSendResult.data.length > 0) {
      return {
        errCode: 1003,
        errMsg: '发送过于频繁，请稍后再试'
      };
    }

    // 生成6位验证码
    const code = Math.random().toString().slice(-6);
    
    // 调用阿里云短信服务 (需要配置)
    const smsResult = await sendSMS(phone, code, type);
    
    if (!smsResult.success) {
      return {
        errCode: 1004,
        errMsg: '短信发送失败'
      };
    }

    // 保存验证码记录
    await db.collection('sms_logs').add({
      phone,
      code,
      type,
      status: 'sent',
      createTime: Date.now(),
      expireTime: Date.now() + 300000, // 5分钟过期
      clientIP: context.CLIENTIP
    });

    return {
      errCode: 0,
      result: {
        success: true,
        message: '验证码发送成功'
      }
    };

  } catch (error) {
    console.error('发送验证码失败:', error);
    return {
      errCode: 500,
      errMsg: '服务器错误'
    };
  }
};

// 模拟短信发送 (生产环境需要接入真实短信服务)
async function sendSMS(phone, code, type) {
  console.log(`发送验证码到 ${phone}: ${code} (类型: ${type})`);
  
  // 这里应该调用阿里云短信服务或其他短信服务商API
  // 示例: 阿里云短信服务
  /*
  const Core = require('@alicloud/pop-core');
  
  const client = new Core({
    accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });

  const params = {
    PhoneNumbers: phone,
    SignName: '您的签名',
    TemplateCode: 'SMS_123456789',
    TemplateParam: JSON.stringify({ code })
  };

  const result = await client.request('SendSms', params, {
    method: 'POST'
  });
  
  return {
    success: result.Code === 'OK'
  };
  */
  
  // 开发环境模拟成功
  return { success: true };
}