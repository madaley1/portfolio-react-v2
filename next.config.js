/** @type {import('next').NextConfig} */
//library imports
// import menu from './src/lib/menu.module.cjs';
const menu = require('./src/lib/menu.module.cjs');

const nextConfig = (phase, { defaultConfig }) => {
  return {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    env: {
      menu: menu.get('src/pages'),
    },
  };
};

module.exports = nextConfig;
