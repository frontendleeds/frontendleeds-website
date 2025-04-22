/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL('https://secure.meetupstatic.com/photos/event/**'), new URL('https://cdn.leonardo.ai/users/**')],
  },
  // Webpack configuration to handle node modules
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
