import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cloudflare Workers configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Cloudflare doesn't support Next.js image optimization
  images: {
    unoptimized: true,
  },

  // Mark packages that should not be bundled (handled by Node.js compat layer)
  serverExternalPackages: ['@payloadcms/db-d1-sqlite', 'jose'],

  // TypeScript and ESLint settings
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // Webpack configuration for proper module resolution
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
