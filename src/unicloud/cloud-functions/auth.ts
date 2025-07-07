import type { UniCloudWeChatLoginParams, UniCloudWeChatLoginResult } from '../types/auth'

export async function uniCloudWeChatLogin(params: UniCloudWeChatLoginParams): Promise<UniCloudWeChatLoginResult> {
  const { code, encryptedData, iv } = params
  const { result } = await uniCloud.callFunction({
    name: 'wechat-login', // 您的云函数名称，例如 'wechat-login'
    data: {
      code,
      encryptedData,
      iv,
    },
  })
  return result as UniCloudWeChatLoginResult
}
