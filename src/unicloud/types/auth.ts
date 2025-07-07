// src/unicloud/types/auth.ts
export interface UniCloudWeChatLoginParams {
  code: string
  encryptedData: string
  iv: string
}

export interface UniCloudWeChatLoginResult {
  token: string
  userInfo: {
    phoneNumber: string
    // ... 其他用户信息
  }
  // ... 其他返回字段
}
