// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@react-native-async-storage/async-storage": require.resolve(
    "@react-native-async-storage/async-storage"
  ),
};

module.exports = config;

// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require("expo/metro-config");

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// config.resolver.extraNodeModules = {
//   ...config.resolver.extraNodeModules,
//   "@react-native-async-storage/async-storage": require.resolve(
//     "@react-native-async-storage/async-storage"
//   ),
// };

// module.exports = config;
