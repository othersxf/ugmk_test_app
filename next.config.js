const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    dirs: {
      data: path.join(__dirname, 'data')
    }
  }
}

module.exports = nextConfig
