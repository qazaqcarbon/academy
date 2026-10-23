import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
  },
  async redirects() {
    return [
      {
        source: '/ru/calculator',
        destination: '/calculator',
        permanent: true,
      },
      {
        source: '/ru/standards',
        destination: '/standards',
        permanent: true,
      },
      {
        source: '/ru/article/:slug*',
        destination: '/article/:slug*',
        permanent: true,
      },
      {
        source: '/ru',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ru/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
