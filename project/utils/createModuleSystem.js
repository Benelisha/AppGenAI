import React from 'react';
import * as ReactNative from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Comprehensive Expo imports with error handling
let Audio, Video, Camera, ImagePicker, MediaLibrary, Notifications, Location, 
    Accelerometer, Gyroscope, Magnetometer, Device, Constants, Contacts, 
    Calendar, DocumentPicker, Sharing, Print, MailComposer, SMS, Haptics, 
    Brightness, Battery, Network, Clipboard, WebBrowser, Linking, 
    BarCodeScanner, FaceDetector, SQLite, SecureStore, Crypto, Random,
    Blur, LinearGradient, Maps, Svg, Animatable, Lottie, Reanimated;

// Audio & Video
try {
  const ExpoAV = require('expo-av');
  Audio = ExpoAV.Audio;
  Video = ExpoAV.Video;
} catch (error) {
  console.warn('expo-av not available:', error.message);
  Audio = { Sound: { createAsync: () => Promise.reject(new Error('expo-av not installed')) } };
  Video = {};
}

// Camera & Media
try {
  Camera = require('expo-camera').Camera;
} catch (error) {
  console.warn('expo-camera not available:', error.message);
  Camera = {};
}

try {
  ImagePicker = require('expo-image-picker');
} catch (error) {
  console.warn('expo-image-picker not available:', error.message);
  ImagePicker = {};
}

try {
  MediaLibrary = require('expo-media-library');
} catch (error) {
  console.warn('expo-media-library not available:', error.message);
  MediaLibrary = {};
}

// Notifications & Location
try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.warn('expo-notifications not available:', error.message);
  Notifications = {};
}

try {
  Location = require('expo-location');
} catch (error) {
  console.warn('expo-location not available:', error.message);
  Location = {};
}

// Sensors
try {
  const Sensors = require('expo-sensors');
  Accelerometer = Sensors.Accelerometer;
  Gyroscope = Sensors.Gyroscope;
  Magnetometer = Sensors.Magnetometer;
} catch (error) {
  console.warn('expo-sensors not available:', error.message);
  Accelerometer = Gyroscope = Magnetometer = {};
}

// Device & System
try {
  Device = require('expo-device');
} catch (error) {
  console.warn('expo-device not available:', error.message);
  Device = {};
}

try {
  Constants = require('expo-constants');
} catch (error) {
  console.warn('expo-constants not available:', error.message);
  Constants = {};
}

// Contacts & Calendar
try {
  Contacts = require('expo-contacts');
} catch (error) {
  console.warn('expo-contacts not available:', error.message);
  Contacts = {};
}

try {
  Calendar = require('expo-calendar');
} catch (error) {
  console.warn('expo-calendar not available:', error.message);
  Calendar = {};
}

// File System & Documents
try {
  DocumentPicker = require('expo-document-picker');
} catch (error) {
  console.warn('expo-document-picker not available:', error.message);
  DocumentPicker = {};
}

try {
  Sharing = require('expo-sharing');
} catch (error) {
  console.warn('expo-sharing not available:', error.message);
  Sharing = {};
}

// Communication
try {
  Print = require('expo-print');
} catch (error) {
  console.warn('expo-print not available:', error.message);
  Print = {};
}

try {
  MailComposer = require('expo-mail-composer');
} catch (error) {
  console.warn('expo-mail-composer not available:', error.message);
  MailComposer = {};
}

try {
  SMS = require('expo-sms');
} catch (error) {
  console.warn('expo-sms not available:', error.message);
  SMS = {};
}

// Hardware Features
try {
  Haptics = require('expo-haptics');
} catch (error) {
  console.warn('expo-haptics not available:', error.message);
  Haptics = {};
}

try {
  Brightness = require('expo-brightness');
} catch (error) {
  console.warn('expo-brightness not available:', error.message);
  Brightness = {};
}

try {
  Battery = require('expo-battery');
} catch (error) {
  console.warn('expo-battery not available:', error.message);
  Battery = {};
}

try {
  Network = require('expo-network');
} catch (error) {
  console.warn('expo-network not available:', error.message);
  Network = {};
}

// System APIs
try {
  Clipboard = require('expo-clipboard');
} catch (error) {
  console.warn('expo-clipboard not available:', error.message);
  Clipboard = {};
}

try {
  WebBrowser = require('expo-web-browser');
} catch (error) {
  console.warn('expo-web-browser not available:', error.message);
  WebBrowser = {};
}

try {
  Linking = require('expo-linking');
} catch (error) {
  console.warn('expo-linking not available:', error.message);
  Linking = {};
}

// Scanning & Recognition
try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch (error) {
  console.warn('expo-barcode-scanner not available:', error.message);
  BarCodeScanner = {};
}

try {
  FaceDetector = require('expo-face-detector');
} catch (error) {
  console.warn('expo-face-detector not available:', error.message);
  FaceDetector = {};
}

// Storage & Security
try {
  SQLite = require('expo-sqlite');
} catch (error) {
  console.warn('expo-sqlite not available:', error.message);
  SQLite = {};
}

try {
  SecureStore = require('expo-secure-store');
} catch (error) {
  console.warn('expo-secure-store not available:', error.message);
  SecureStore = {};
}

try {
  Crypto = require('expo-crypto');
} catch (error) {
  console.warn('expo-crypto not available:', error.message);
  Crypto = {};
}

try {
  Random = require('expo-random');
} catch (error) {
  console.warn('expo-random not available:', error.message);
  Random = {};
}

// Visual Effects
try {
  const BlurModule = require('expo-blur');
  Blur = BlurModule.BlurView;
} catch (error) {
  console.warn('expo-blur not available:', error.message);
  Blur = {};
}

try {
  const LinearGradientModule = require('expo-linear-gradient');
  LinearGradient = LinearGradientModule.LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient not available:', error.message);
  LinearGradient = {};
}

// Maps & SVG
try {
  Maps = require('react-native-maps');
} catch (error) {
  console.warn('react-native-maps not available:', error.message);
  Maps = {};
}

try {
  Svg = require('react-native-svg');
} catch (error) {
  console.warn('react-native-svg not available:', error.message);
  Svg = {};
}

// Animation Libraries

try {
  Animatable = require('react-native-animatable');
} catch (error) {
  console.warn('react-native-animatable not available:', error.message);
  Animatable = {};
}

try {
  Lottie = require('lottie-react-native');
} catch (error) {
  console.warn('lottie-react-native not available:', error.message);
  Lottie = {};
}

// React Native Reanimated - with smart environment detection
try {
  // Check if we're running in Expo Go environment
  const Constants = require('expo-constants');
  const isExpoGo = Constants.default?.appOwnership === 'expo';
  const isDevClient = Constants.default?.executionEnvironment === 'bare';
  
  if (isExpoGo && !isDevClient) {
    console.warn('🔧 Expo Go detected - using simplified Reanimated fallback to prevent crashes');
    console.log('💡 To test with full animations, use: npx expo run:ios or npx expo start --dev-client');
    throw new Error('Expo Go environment - using fallback');
  }
  
  Reanimated = require('react-native-reanimated');
  console.log('✅ react-native-reanimated loaded successfully in development build!');
  console.log('🎉 Full animation support available!');
} catch (error) {
  console.warn('react-native-reanimated not available or Expo Go detected:', error.message);
  console.log('🔧 Creating safe Reanimated fallback...');
  
  // Create a comprehensive fallback that mimics react-native-reanimated API
  Reanimated = {
    View: ReactNative.View,
    Text: ReactNative.Text,
    ScrollView: ReactNative.ScrollView,
    Image: ReactNative.Image,
    
    // Mock hooks
    useSharedValue: function(initialValue) {
      const [value, setValue] = React.useState(initialValue);
      return {
        value: value,
        setValue: setValue
      };
    },
    
    useAnimatedStyle: function(styleFunction) {
      try {
        return styleFunction();
      } catch (e) {
        return {};
      }
    },
    
    // Mock animation functions - return values immediately
    withTiming: function(toValue, config) {
      return toValue;
    },
    
    withSpring: function(toValue, config) {
      return toValue;
    },
    
    withRepeat: function(animation, numberOfReps, reverse) {
      return animation;
    },
    
    withSequence: function(...animations) {
      return animations[animations.length - 1] || 0;
    },
    
    withDelay: function(delay, animation) {
      return animation;
    },
    
    // Mock interpolation
    interpolate: function(value, inputRange, outputRange) {
      return outputRange[0] || 0;
    },
    
    interpolateColor: function(value, inputRange, outputRange) {
      return outputRange[0] || '#000000';
    },
    
    // Mock other common functions
    runOnJS: function(fn) {
      return function(...args) {
        fn(...args);
      };
    },
    
    runOnUI: function(fn) {
      return fn;
    }
  };
}

export function createModuleSystem(files) {
  const moduleCache = {};

  // ✅ Ensure Reanimated is properly initialized before creating core modules
  console.log('🔧 Pre-check: Reanimated object exists:', !!Reanimated);
  console.log('🔧 Pre-check: Reanimated.View exists:', !!Reanimated?.View);
  console.log('🔧 Pre-check: Reanimated keys:', Reanimated ? Object.keys(Reanimated).slice(0, 10) : 'undefined');
  
  // ✅ Enhanced safety check - ensure Reanimated has required components
  if (!Reanimated || typeof Reanimated !== 'object' || !Reanimated.View) {
    console.warn('🔧 Reanimated missing or incomplete, creating comprehensive fallback');
    Reanimated = {
      View: ReactNative.View,
      Text: ReactNative.Text,
      ScrollView: ReactNative.ScrollView,
      Image: ReactNative.Image,
      
      useSharedValue: function(initialValue) {
        const [value, setValue] = React.useState(initialValue);
        return {
          value: value,
          setValue: setValue
        };
      },
      
      useAnimatedStyle: function(styleFunction) {
        try {
          return styleFunction();
        } catch (e) {
          return {};
        }
      },
      
      withTiming: function(toValue, config) { return toValue; },
      withSpring: function(toValue, config) { return toValue; },
      withRepeat: function(animation, numberOfReps, reverse) { return animation; },
      withSequence: function(...animations) { return animations[animations.length - 1] || 0; },
      withDelay: function(delay, animation) { return animation; },
      interpolate: function(value, inputRange, outputRange) { return outputRange[0] || 0; },
      interpolateColor: function(value, inputRange, outputRange) { return outputRange[0] || '#000000'; },
      runOnJS: function(fn) { return function(...args) { fn(...args); }; },
      runOnUI: function(fn) { return fn; }
    };
  }

  // ✅ Comprehensive core modules for 98% of mobile app use cases
  const coreModules = {
    // Core React & React Native
    'react': React,
    'react-native': ReactNative,
    
    // Storage
    '@react-native-async-storage/async-storage': AsyncStorage,
    'AsyncStorage': AsyncStorage,
    'async-storage': AsyncStorage,
    'expo-secure-store': SecureStore,
    'expo-sqlite': SQLite,
    
    // Audio & Video
    'expo-av': { Audio, Video },
    'Audio': Audio,
    'Video': Video,
    
    // Camera & Media
    'expo-camera': { Camera },
    'Camera': Camera,
    'expo-image-picker': ImagePicker,
    'expo-media-library': MediaLibrary,
    
    // Notifications & Location
    'expo-notifications': Notifications,
    'expo-location': Location,
    
    // Sensors
    'expo-sensors': { Accelerometer, Gyroscope, Magnetometer },
    'Accelerometer': Accelerometer,
    'Gyroscope': Gyroscope,
    'Magnetometer': Magnetometer,
    
    // Device & System Info
    'expo-device': Device,
    'expo-constants': Constants,
    'expo-network': Network,
    'expo-battery': Battery,
    
    // Contacts & Calendar
    'expo-contacts': Contacts,
    'expo-calendar': Calendar,
    
    // File System & Documents
    'expo-document-picker': DocumentPicker,
    'expo-sharing': Sharing,
    'expo-print': Print,
    
    // Communication
    'expo-mail-composer': MailComposer,
    'expo-sms': SMS,
    
    // Hardware Features
    'expo-haptics': Haptics,
    'expo-brightness': Brightness,
    
    // System APIs
    'expo-clipboard': Clipboard,
    'expo-web-browser': WebBrowser,
    'expo-linking': Linking,
    
    // Scanning & Recognition
    'expo-barcode-scanner': { BarCodeScanner },
    'expo-face-detector': FaceDetector,
    
    // Security & Crypto
    'expo-crypto': Crypto,
    'expo-random': Random,
    
    // Visual Effects
    'expo-blur': { BlurView: Blur },
    'expo-linear-gradient': { LinearGradient },
    
    // Maps & Graphics
    'react-native-maps': Maps,
    'react-native-svg': Svg,
    
    // Animation Libraries
    'react-native-animatable': Animatable,
    'lottie-react-native': Lottie,
    'react-native-reanimated': Reanimated,
    'Reanimated': Reanimated,
    
    // Network
    'fetch': fetch,
    'node-fetch': fetch,
  };

  function resolvePath(filePath, currentDir = '') {
    if (coreModules[filePath]) {
      return filePath;
    }

    if (filePath.startsWith('./')) {
      const resolved = filePath.substring(2);
      return currentDir ? `${currentDir}/${resolved}` : resolved;
    }

    if (filePath.startsWith('../')) {
      const pathParts = currentDir.split('/').filter(part => part.length > 0);
      const relativeParts = filePath.split('/').filter(part => part.length > 0);
      
      let upCount = 0;
      for (const part of relativeParts) {
        if (part === '..') {
          upCount++;
        } else {
          break;
        }
      }
      
      const remainingParts = relativeParts.slice(upCount);
      const resultParts = pathParts.slice(0, -upCount).concat(remainingParts);
      
      return resultParts.join('/');
    }

    return filePath;
  }

  function customRequire(filePath, currentDir = '') {
    const resolvedPath = resolvePath(filePath, currentDir);

    // Core modules check with comprehensive debugging
    if (coreModules[resolvedPath]) {
      console.log(`✅ Loading core module: ${resolvedPath}`);
      const module = coreModules[resolvedPath];
      
      // ✅ Special debugging for major modules
      if (resolvedPath === 'expo-av') {
        console.log('🔍 expo-av module:', module);
        console.log('🔍 expo-av Audio available:', !!module.Audio);
        console.log('🔍 expo-av Video available:', !!module.Video);
      }
      
      if (resolvedPath === 'expo-camera') {
        console.log('🔍 expo-camera module available:', !!module.Camera);
      }
      
      if (resolvedPath === 'expo-notifications') {
        console.log('🔍 expo-notifications module available:', !!module);
      }
      
      if (resolvedPath === 'expo-location') {
        console.log('🔍 expo-location module available:', !!module);
      }
      
      if (resolvedPath === 'node-fetch' || resolvedPath === 'fetch') {
        console.log('🔍 fetch module:', typeof module);
        console.log('🔍 fetch available:', typeof module === 'function');
      }
      
      if (resolvedPath === 'react-native-reanimated' || resolvedPath === 'Reanimated') {
        console.log('🔍 react-native-reanimated module:', module);
        console.log('🔍 Reanimated View available:', !!module.View);
        console.log('🔍 Reanimated useSharedValue available:', !!module.useSharedValue);
        console.log('🔍 Reanimated useAnimatedStyle available:', !!module.useAnimatedStyle);
        console.log('🔍 Reanimated animation functions available:', {
          withTiming: !!module.withTiming,
          withSpring: !!module.withSpring,
          withRepeat: !!module.withRepeat
        });
      }
      
      return module;
    }

    if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;

    // ✅ Enhanced path resolution - try multiple variations
    const possiblePaths = [
      resolvedPath,                           // exact path
      resolvedPath.replace(/^\.\//, ''),      // remove ./
      filePath.replace(/^\.\//, ''),          // remove ./ from original
      resolvedPath + '.js',                   // add .js extension
      (resolvedPath.replace(/^\.\//, '')) + '.js', // remove ./ and add .js
      (filePath.replace(/^\.\//, '')) + '.js'      // remove ./ from original and add .js
    ];

    console.log('🔍 Trying to resolve:', filePath);
    console.log('🔍 Resolved to:', resolvedPath);
    console.log('🔍 Possible paths:', possiblePaths);
    console.log('🔍 Available files:', Object.keys(files));

    let foundPath = possiblePaths.find(path => files[path]);

    if (!foundPath) {
      console.error('Available files:', Object.keys(files));
      console.error('Available core modules:', Object.keys(coreModules));
      console.error('Trying to require:', filePath);
      console.error('Resolved to:', resolvedPath);
      console.error('Current dir:', currentDir);
      throw new Error(`Module not found: ${filePath}`);
    }

    console.log(`✅ Found file: ${foundPath}`);

    const module = { exports: {} };
    moduleCache[resolvedPath] = module;

    const pathParts = foundPath.split('/');
    const newCurrentDir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

    const wrappedCode = `
      (function(require, module, exports) {
        ${files[foundPath]}
      })
    `;

    try {
      const fn = eval(wrappedCode);
      fn((path) => customRequire(path, newCurrentDir), module, module.exports);
    } catch (error) {
      console.error(`❌ Error executing module ${foundPath}:`, error);
      throw error;
    }

    return module.exports;
  }

  return customRequire;
}



// import React from 'react';
// import * as ReactNative from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export function createModuleSystem(files) {
//   const moduleCache = {};

//   // ✅ Core modules
//   const coreModules = {
//     'react': React,
//     'react-native': ReactNative,
//     '@react-native-async-storage/async-storage': AsyncStorage,
//     'AsyncStorage': AsyncStorage,
//     'async-storage': AsyncStorage,
//   };

//   function resolvePath(filePath, currentDir = '') {
//     if (coreModules[filePath]) {
//       return filePath;
//     }

//     if (filePath.startsWith('./')) {
//       const resolved = filePath.substring(2);
//       return currentDir ? `${currentDir}/${resolved}` : resolved;
//     }

//     if (filePath.startsWith('../')) {
//       const pathParts = currentDir.split('/').filter(part => part.length > 0);
//       const relativeParts = filePath.split('/').filter(part => part.length > 0);
      
//       let upCount = 0;
//       for (const part of relativeParts) {
//         if (part === '..') {
//           upCount++;
//         } else {
//           break;
//         }
//       }
      
//       const remainingParts = relativeParts.slice(upCount);
//       const resultParts = pathParts.slice(0, -upCount).concat(remainingParts);
      
//       return resultParts.join('/');
//     }

//     return filePath;
//   }

//   function customRequire(filePath, currentDir = '') {
//     const resolvedPath = resolvePath(filePath, currentDir);

//     // ✅ Core modules check
//     if (coreModules[resolvedPath]) {
//       console.log(`✅ Loading core module: ${resolvedPath}`);
//       return coreModules[resolvedPath];
//     }

//     if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;

//     // ✅ Enhanced path resolution - try multiple variations
//     const possiblePaths = [
//       resolvedPath,                           // exact path
//       resolvedPath.replace(/^\.\//, ''),      // remove ./
//       filePath.replace(/^\.\//, ''),          // remove ./ from original
//       resolvedPath + '.js',                   // add .js extension
//       (resolvedPath.replace(/^\.\//, '')) + '.js', // remove ./ and add .js
//       (filePath.replace(/^\.\//, '')) + '.js'      // remove ./ from original and add .js
//     ];

//     console.log('🔍 Trying to resolve:', filePath);
//     console.log('🔍 Resolved to:', resolvedPath);
//     console.log('🔍 Possible paths:', possiblePaths);
//     console.log('🔍 Available files:', Object.keys(files));

//     let foundPath = possiblePaths.find(path => files[path]);

//     if (!foundPath) {
//       console.error('Available files:', Object.keys(files));
//       console.error('Available core modules:', Object.keys(coreModules));
//       console.error('Trying to require:', filePath);
//       console.error('Resolved to:', resolvedPath);
//       console.error('Current dir:', currentDir);
//       throw new Error(`Module not found: ${filePath}`);
//     }

//     console.log(`✅ Found file: ${foundPath}`);

//     const module = { exports: {} };
//     moduleCache[resolvedPath] = module;

//     const pathParts = foundPath.split('/');
//     const newCurrentDir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

//     const wrappedCode = `
//       (function(require, module, exports) {
//         ${files[foundPath]}
//       })
//     `;

//     try {
//       const fn = eval(wrappedCode);
//       fn((path) => customRequire(path, newCurrentDir), module, module.exports);
//     } catch (error) {
//       console.error(`❌ Error executing module ${foundPath}:`, error);
//       throw error;
//     }

//     return module.exports;
//   }

//   return customRequire;
// }






// // import React from 'react';
// // import * as ReactNative from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // export function createModuleSystem(files) {
// //   const moduleCache = {};

// //   // ✅ Fixed core modules - AsyncStorage should be exposed directly
// //   const coreModules = {
// //     'react': React,
// //     'react-native': ReactNative,
// //     '@react-native-async-storage/async-storage': AsyncStorage, // ✅ Direct export, not wrapped
// //     'AsyncStorage': AsyncStorage, // ✅ Alternative import name
// //     'async-storage': AsyncStorage, // ✅ Another alternative
// //   };

// //   function resolvePath(filePath, currentDir = '') {
// //     if (coreModules[filePath]) {
// //       return filePath;
// //     }

// //     if (filePath.startsWith('./')) {
// //       const resolved = filePath.substring(2);
// //       return currentDir ? `${currentDir}/${resolved}` : resolved;
// //     }

// //     if (filePath.startsWith('../')) {
// //       const pathParts = currentDir.split('/').filter(part => part.length > 0);
// //       const relativeParts = filePath.split('/').filter(part => part.length > 0);
      
// //       let upCount = 0;
// //       for (const part of relativeParts) {
// //         if (part === '..') {
// //           upCount++;
// //         } else {
// //           break;
// //         }
// //       }
      
// //       const remainingParts = relativeParts.slice(upCount);
// //       const resultParts = pathParts.slice(0, -upCount).concat(remainingParts);
      
// //       return resultParts.join('/');
// //     }

// //     return filePath;
// //   }

// //   function customRequire(filePath, currentDir = '') {
// //     const resolvedPath = resolvePath(filePath, currentDir);

// //     // ✅ Enhanced core module checking with debugging
// //     if (coreModules[resolvedPath]) {
// //       console.log(`✅ Loading core module: ${resolvedPath}`);
// //       const module = coreModules[resolvedPath];
      
// //       // ✅ Special debugging for AsyncStorage
// //       if (resolvedPath.includes('async-storage') || resolvedPath === 'AsyncStorage') {
// //         console.log('🔍 AsyncStorage module:', module);
// //         console.log('🔍 AsyncStorage methods:', module ? Object.keys(module) : 'undefined');
// //         console.log('🔍 getItem method:', module?.getItem);
// //       }
      
// //       return module;
// //     }

// //     if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;

// //     const possiblePaths = [
// //       resolvedPath,
// //       resolvedPath.replace(/^\.\//, ''),
// //       filePath.replace(/^\.\//, ''),
// //     ];

// //     let foundPath = possiblePaths.find(path => files[path]);

// //     if (!foundPath) {
// //       console.error('Available files:', Object.keys(files));
// //       console.error('Available core modules:', Object.keys(coreModules));
// //       console.error('Trying to require:', filePath);
// //       console.error('Resolved to:', resolvedPath);
// //       console.error('Current dir:', currentDir);
// //       throw new Error(`Module not found: ${filePath}`);
// //     }

// //     const module = { exports: {} };
// //     moduleCache[resolvedPath] = module;

// //     const pathParts = foundPath.split('/');
// //     const newCurrentDir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

// //     const wrappedCode = `
// //       (function(require, module, exports) {
// //         ${files[foundPath]}
// //       })
// //     `;

// //     try {
// //       const fn = eval(wrappedCode);
// //       fn((path) => customRequire(path, newCurrentDir), module, module.exports);
// //     } catch (error) {
// //       console.error(`❌ Error executing module ${foundPath}:`, error);
// //       throw error;
// //     }

// //     return module.exports;
// //   }

// //   return customRequire;
// // }
