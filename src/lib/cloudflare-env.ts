/**
 * Cloudflare Workers 环境变量桥接器
 *
 * 这个模���解决了在 Cloudflare Workers 环境中环境变量传递的问题
 * 通过多种方式尝试获取环境变量和绑定
 */

interface CloudflareEnv {
  D1: D1Database
  R2: R2Bucket
  PAYLOAD_SECRET: string
  NEXT_PUBLIC_SERVER_URL: string
  NODE_ENV: string
  [key: string]: any
}

/**
 * 获取 Cloudflare Workers 环境变量
 */
export function getCloudflareEnv(): Partial<CloudflareEnv> {
  const env: Partial<CloudflareEnv> = {}

  // 方法 1: 通过 globalThis.__env__ (OpenNext 方式)
  if (typeof globalThis !== 'undefined' && (globalThis as any).__env__) {
    const cloudflareEnv = (globalThis as any).__env__
    env.D1 = cloudflareEnv.D1
    env.R2 = cloudflareEnv.R2
    env.PAYLOAD_SECRET = cloudflareEnv.PAYLOAD_SECRET
    env.NEXT_PUBLIC_SERVER_URL = cloudflareEnv.NEXT_PUBLIC_SERVER_URL
    env.NODE_ENV = cloudflareEnv.NODE_ENV

    console.log('Environment loaded via globalThis.__env__')
    return env
  }

  // 方法 2: 直接从 globalThis 获取
  if (typeof globalThis !== 'undefined') {
    const global = globalThis as any
    if (global.D1Database && global.D1) {
      env.D1 = global.D1
    }
    if (global.R2Bucket && global.R2) {
      env.R2 = global.R2
    }
    if (global.PAYLOAD_SECRET) {
      env.PAYLOAD_SECRET = global.PAYLOAD_SECRET
    }

    if (Object.keys(env).length > 0) {
      console.log('Environment loaded via globalThis')
      return env
    }
  }

  // 方法 3: 开发环境回退
  if (typeof process !== 'undefined' && process.env) {
    console.log('Using Node.js environment variables')
    return {
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    }
  }

  console.warn('No Cloudflare environment variables found')
  return {}
}

/**
 * 安全地获取 PAYLOAD_SECRET
 */
export function getPayloadSecret(): string {
  const env = getCloudflareEnv()

  if (env.PAYLOAD_SECRET) {
    return env.PAYLOAD_SECRET
  }

  // 开发环境回退
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    return 'dev-secret-key-replace-in-production'
  }

  throw new Error('PAYLOAD_SECRET environment variable is not available')
}

/**
 * 获取 D1 数据库绑定
 */
export function getD1Binding(): D1Database | undefined {
  const env = getCloudflareEnv()
  return env.D1
}

/**
 * 获取 R2 存储绑定
 */
export function getR2Binding(): R2Bucket | undefined {
  const env = getCloudflareEnv()
  return env.R2
}