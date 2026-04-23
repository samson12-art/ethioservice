const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: false,
    fs: false,
    crypto: false,
    util: false,
    assert: false
  };
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);
  
  return config;
};