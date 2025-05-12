/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.unsplash.com'],
    },
    webpack(config) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
      return config;
    },    env: {
      NEXT_PUBLIC_OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  };
  
  module.exports = nextConfig;