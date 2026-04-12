/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bagandshop/shared'],
  // In dev, avoid cache/revalidation responses that some proxies (e.g. older Shopify CLI + Node 22)
  // mishandle when rewriting HTML. Production is unchanged.
  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
};
module.exports = nextConfig;
