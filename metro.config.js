// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  // Core storage
  "@react-native-async-storage/async-storage": require.resolve(
    "@react-native-async-storage/async-storage"
  ),
  
  // Audio & Video
  "expo-av": require.resolve("expo-av"),
  
  // Camera & Media
  "expo-camera": require.resolve("expo-camera"),
  "expo-image-picker": require.resolve("expo-image-picker"),
  "expo-media-library": require.resolve("expo-media-library"),
  
  // Notifications & Location
  "expo-notifications": require.resolve("expo-notifications"),
  "expo-location": require.resolve("expo-location"),
  
  // Sensors
  "expo-sensors": require.resolve("expo-sensors"),
  
  // Device & System Info
  "expo-device": require.resolve("expo-device"),
  "expo-constants": require.resolve("expo-constants"),
  
  // Contacts & Calendar
  "expo-contacts": require.resolve("expo-contacts"),
  "expo-calendar": require.resolve("expo-calendar"),
  
  // Communication
  "expo-sms": require.resolve("expo-sms"),
  "expo-mail-composer": require.resolve("expo-mail-composer"),
  "expo-web-browser": require.resolve("expo-web-browser"),
  "expo-linking": require.resolve("expo-linking"),
  
  // Security & Authentication
  "expo-local-authentication": require.resolve("expo-local-authentication"),
  "expo-secure-store": require.resolve("expo-secure-store"),
  
  // File System & Documents
  "expo-file-system": require.resolve("expo-file-system"),
  "expo-document-picker": require.resolve("expo-document-picker"),
  "expo-sharing": require.resolve("expo-sharing"),
  "expo-print": require.resolve("expo-print"),
  
  // Hardware Features
  "expo-brightness": require.resolve("expo-brightness"),
  "expo-screen-orientation": require.resolve("expo-screen-orientation"),
  "expo-keep-awake": require.resolve("expo-keep-awake"),
  "expo-haptics": require.resolve("expo-haptics"),
  
  // Visual Effects
  "expo-blur": require.resolve("expo-blur"),
  "expo-linear-gradient": require.resolve("expo-linear-gradient"),
  
  // Maps & Graphics
  "react-native-maps": require.resolve("react-native-maps"),
  "react-native-svg": require.resolve("react-native-svg"),
  
  // Animation Libraries
  "react-native-reanimated": require.resolve("react-native-reanimated"),
  "react-native-animatable": require.resolve("react-native-animatable"),
  "lottie-react-native": require.resolve("lottie-react-native"),
  
  // Firebase
  "firebase/app": require.resolve("firebase/app"),
  "firebase/firestore": require.resolve("firebase/firestore"),
  "firebase/auth": require.resolve("firebase/auth"),
  "firebase/storage": require.resolve("firebase/storage"),
};

module.exports = config;
