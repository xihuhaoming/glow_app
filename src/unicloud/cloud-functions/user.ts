import type { UniCloudLoginParams, UniCloudLoginResult } from '../types/user'

export async function uniCloudLogin(params: UniCloudLoginParams): Promise<UniCloudLoginResult> {
  const { result } = await uniCloud.callFunction({
    name: 'login', // 您的云函数名称
    data: params,
  })
  return result as UniCloudLoginResult
}

// src/unicloud/cloud-functions/getProduct.ts
export async function uniCloudGetProduct(productId: string) {
  const { result } = await uniCloud.callFunction({
    name: 'getProduct',
    data: { productId },
  })
  return result
}
