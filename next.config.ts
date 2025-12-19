import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cloudflare Workers configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable optimized package imports for better code splitting
    optimizePackageImports: ['lucide-react', 'sonner'],
  },

  // Cloudflare doesn't support Next.js image optimization
  // For production image optimization, consider Cloudflare Images or external CDN
  images: {
    unoptimized: true,
    // Allow images from external domains (when needed)
    remotePatterns: [
      // Add external image domains here as needed
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'images.example.com',
      //   pathname: '/**',
      // },
    ],
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

  // Production optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
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
