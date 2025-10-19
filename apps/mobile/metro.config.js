const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { 
  input: './global.css', 
  inlineRem: 16,
  cssInterop: false  // Disable CSS interop to avoid React hook issues
});
