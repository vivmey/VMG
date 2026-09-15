import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Vitrine
      { protocol: 'https', hostname: 'www.helloasso.com' },
      { protocol: 'https', hostname: 'voisinsmoulingalant.fr' },
      // Fallback Blogspot (au cas où certaines images legacy ne sont pas téléchargées)
      { protocol: 'https', hostname: '*.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.blogspot.com', pathname: '/**' },
      { protocol: 'https', hostname: 'blogger.googleusercontent.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/posts',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/', destination: '/fr', permanent: false },
      { source: '/blog', destination: '/fr/blog', permanent: false },
      { source: '/blog/:slug', destination: '/fr/blog/:slug', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
