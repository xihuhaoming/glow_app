// src/unicloud/types/user.ts
export interface UniCloudLoginParams {
  username: string
  password: string
}

export interface UniCloudLoginResult {
  token: string
  userInfo: {
    // ...
  }
}
