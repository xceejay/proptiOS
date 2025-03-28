/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['mui-file-input'],
  trailingSlash: true,
  reactStrictMode: false,

  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    // Add rule to handle SVGs with @svgr/webpack and preserve styles
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false // ✅ disables optimization that strips style/classes
          }
        }
      ]
    })

    return config
  }
}
