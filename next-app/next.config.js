/** @type {import('next').NextConfig} */
//library imports
// import menu from './src/lib/menu.module.cjs';
const menu = require('./src/lib/menu.module.cjs');

const nextConfig = (phase, { defaultConfig }) => {
  return {
    env: {
      menu: menu.get('src/pages'),
    },
  };
};

module.exports = nextConfig;
