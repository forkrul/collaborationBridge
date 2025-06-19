/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'App',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Security and i18n headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Vary',
            value: 'Accept-Language',
          },
        ],
      },
    ];
  },
  // Redirects for locale handling
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/en-GB/dashboard',
        permanent: false,
        locale: false,
      },
      {
        source: '/login',
        destination: '/en-GB/login',
        permanent: false,
        locale: false,
      },
    ];
  },
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    // Analyze bundle in production
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
