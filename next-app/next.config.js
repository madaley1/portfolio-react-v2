/** @type {import('next').NextConfig} */
//library imports
const menu = require('./src/libraries/menu');

const nextConfig = (phase, { defaultConfig }) => {
  return {
    env: {
      menu: menu.get('src/pages')
    }
  };
};

module.exports = nextConfig;
