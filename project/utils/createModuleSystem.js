import React from 'react';
import * as ReactNative from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function createModuleSystem(files) {
  const moduleCache = {};

  // ✅ Fixed core modules - AsyncStorage should be exposed directly
  const coreModules = {
    'react': React,
    'react-native': ReactNative,
    '@react-native-async-storage/async-storage': AsyncStorage, // ✅ Direct export, not wrapped
    'AsyncStorage': AsyncStorage, // ✅ Alternative import name
    'async-storage': AsyncStorage, // ✅ Another alternative
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

    // ✅ Enhanced core module checking with debugging
    if (coreModules[resolvedPath]) {
      console.log(`✅ Loading core module: ${resolvedPath}`);
      const module = coreModules[resolvedPath];
      
      // ✅ Special debugging for AsyncStorage
      if (resolvedPath.includes('async-storage') || resolvedPath === 'AsyncStorage') {
        console.log('🔍 AsyncStorage module:', module);
        console.log('🔍 AsyncStorage methods:', module ? Object.keys(module) : 'undefined');
        console.log('🔍 getItem method:', module?.getItem);
      }
      
      return module;
    }

    if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;

    const possiblePaths = [
      resolvedPath,
      resolvedPath.replace(/^\.\//, ''),
      filePath.replace(/^\.\//, ''),
    ];

    let foundPath = possiblePaths.find(path => files[path]);

    if (!foundPath) {
      console.error('Available files:', Object.keys(files));
      console.error('Available core modules:', Object.keys(coreModules));
      console.error('Trying to require:', filePath);
      console.error('Resolved to:', resolvedPath);
      console.error('Current dir:', currentDir);
      throw new Error(`Module not found: ${filePath}`);
    }

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


// // utils/createModuleSystem.js
// import React from "react";
// import * as ReactNative from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export function createModuleSystem(moduleMap) {
//   const cache = {};

//   // The actual require function that mini apps will use
//   function requireFunc(moduleId) {
//     if (cache[moduleId]) {
//       return cache[moduleId].exports;
//     }

//     const moduleFactory = moduleMap[moduleId];
//     if (!moduleFactory) {
//       throw new Error(`[MiniApp] Cannot find module '${moduleId}'`);
//     }

//     const module = { exports: {} };
//     cache[moduleId] = module;

//     moduleFactory(requireFunc, module, module.exports);

//     return module.exports;
//   }

//   // Inject known globals (external libraries from host app)
//   const preloadedModules = {
//     react: require('react'),
//     'react-native': require('react-native'),
//     '@react-native-async-storage/async-storage': require('@react-native-async-storage/async-storage'),
//     'expo-constants': require('expo-constants'),
//     'expo-file-system': require('expo-file-system'),
//     'expo-asset': require('expo-asset'),
//   };

//   for (const [key, value] of Object.entries(preloadedModules)) {
//     moduleMap[key] = (_, module) => {
//       module.exports = value;
//     };
//   }

//   return {
//     require: requireFunc,
//   };
// }

// // export function createModuleSystem(moduleMap) {
// //   const cache = {};

// //   function customRequire(moduleId) {
// //     if (cache[moduleId]) {
// //       return cache[moduleId].exports;
// //     }

// //     const moduleFactory = moduleMap[moduleId];
// //     if (!moduleFactory) {
// //       throw new Error(`[MiniApp] Cannot find module '${moduleId}'`);
// //     }

// //     const module = { exports: {} };
// //     cache[moduleId] = module;

// //     try {
// //       moduleFactory(customRequire, module, module.exports);
// //     } catch (error) {
// //       delete cache[moduleId]; // remove from cache if it failed
// //       throw new Error(`[MiniApp] Failed to execute module '${moduleId}':\n${error.stack}`);
// //     }

// //     return module.exports;
// //   }

// //   // Preload core modules like react, react-native, async-storage, etc
// //   const preloadGlobals = {
// //     react: require('react'),
// //     'react-native': require('react-native'),
// //     'react-native-async-storage/async-storage': require('@react-native-async-storage/async-storage'),
// //     'expo-file-system': require('expo-file-system'),
// //     'expo-constants': require('expo-constants'),
// //     'expo-asset': require('expo-asset'),
// //   };

// //   Object.entries(preloadGlobals).forEach(([key, value]) => {
// //     moduleMap[key] = (_, module) => {
// //       module.exports = value;
// //     };
// //   });

// //   return {
// //     require: customRequire,
// //   };
// // }

// // export function createModuleSystem(files) {
// //   const moduleCache = {};

// //   // Core modules that should be available to all mini-apps
// //   const coreModules = {
// //     react: React,
// //     "react-native": ReactNative,
// //     // '@react-native-async-storage/async-storage': AsyncStorage,
// //     "@react-native-async-storage/async-storage": { default: AsyncStorage },
// //     // '@react-native-async-storage/async-storage': AsyncStorage
// //   };

// //   // Function to resolve relative paths
// //   function resolvePath(filePath, currentDir = "") {
// //     // Handle core modules
// //     if (coreModules[filePath]) {
// //       return filePath;
// //     }

// //     // Handle relative paths starting with './'
// //     if (filePath.startsWith("./")) {
// //       const resolved = filePath.substring(2); // Remove './'
// //       return currentDir ? `${currentDir}/${resolved}` : resolved;
// //     }

// //     // Handle relative paths starting with '../'
// //     if (filePath.startsWith("../")) {
// //       const pathParts = currentDir.split("/").filter((part) => part.length > 0);
// //       const relativeParts = filePath
// //         .split("/")
// //         .filter((part) => part.length > 0);

// //       let upCount = 0;
// //       for (const part of relativeParts) {
// //         if (part === "..") {
// //           upCount++;
// //         } else {
// //           break;
// //         }
// //       }

// //       const remainingParts = relativeParts.slice(upCount);
// //       const resultParts = pathParts.slice(0, -upCount).concat(remainingParts);

// //       return resultParts.join("/");
// //     }

// //     // Return as-is for absolute paths
// //     return filePath;
// //   }

// //   function customRequire(filePath, currentDir = "") {
// //     const resolvedPath = resolvePath(filePath, currentDir);
// //     console.log(
// //       "customRequire called with:",
// //       filePath,
// //       "resolved to:",
// //       resolvedPath
// //     );

// //     if (coreModules[resolvedPath]) {
// //       console.log("Returning core module:", resolvedPath);
// //       return coreModules[resolvedPath];
// //     }

// //     if (moduleCache[resolvedPath]) {
// //       console.log("Returning cached module:", resolvedPath);
// //       return moduleCache[resolvedPath].exports;
// //     }

// //     if (!files[resolvedPath]) {
// //       console.log("File not found:", resolvedPath);
// //       // Add fallback to check if resolvedPath is directory with index.js
// //       if (files[resolvedPath + "/index.js"]) {
// //         console.log("Found index.js inside directory:", resolvedPath);
// //         return customRequire(resolvedPath + "/index.js", resolvedPath);
// //       }
// //       // existing fallback checks...
// //     }
// //     // Return core module if available
// //     if (coreModules[resolvedPath]) {
// //       return coreModules[resolvedPath];
// //     }

// //     // Check cache
// //     if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;

// //     // Check if file exists
// //     if (!files[resolvedPath]) {
// //       // Try different path variants
// //       const possiblePaths = [
// //         resolvedPath,
// //         resolvedPath.replace(/^\.\//, ""),
// //         filePath.replace(/^\.\//, ""),
// //       ];

// //       let foundPath = null;
// //       for (const path of possiblePaths) {
// //         if (files[path]) {
// //           foundPath = path;
// //           break;
// //         }
// //       }

// //       if (files[resolvedPath + "/index.js"]) {
// //         return customRequire(resolvedPath + "/index.js", resolvedPath);
// //       }

// //       if (!foundPath) {
// //         console.error("Available files:", Object.keys(files));
// //         console.error("Trying to require:", filePath);
// //         console.error("Resolved to:", resolvedPath);
// //         console.error("Current dir:", currentDir);
// //         throw new Error(`Module not found: ${filePath}`);
// //       }

// //       const module = { exports: {} };
// //       moduleCache[resolvedPath] = module;

// //       const pathParts = foundPath.split("/");
// //       const newCurrentDir =
// //         pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "";

// //       const wrappedCode = `
// //         (function(require, module, exports) {
// //           ${files[foundPath]}
// //         })
// //       `;
// //       const fn = eval(wrappedCode);
// //       fn((path) => customRequire(path, newCurrentDir), module, module.exports);

// //       return module.exports;
// //     }

// //     const module = { exports: {} };
// //     moduleCache[resolvedPath] = module;

// //     const pathParts = resolvedPath.split("/");
// //     const newCurrentDir =
// //       pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "";

// //     const wrappedCode = `
// //       (function(require, module, exports) {
// //         ${files[resolvedPath]}
// //       })
// //     `;
// //     const fn = eval(wrappedCode);
// //     fn((path) => customRequire(path, newCurrentDir), module, module.exports);

// //     return module.exports;
// //   }

// //   return customRequire;
// // }

// // import React from 'react';
// // import * as ReactNative from 'react-native';

// // export function createModuleSystem(files) {
// //   const moduleCache = {};

// //   // Core modules that should be available to all mini-apps
// //   const coreModules = {
// //     'react': React,
// //     'react-native': ReactNative,

// //   };

// //   // Function to resolve relative paths
// //   function resolvePath(filePath, currentDir = '') {
// //     // Handle core modules
// //     if (coreModules[filePath]) {
// //       return filePath;
// //     }

// //     // Handle relative paths starting with './'
// //     if (filePath.startsWith('./')) {
// //       const resolved = filePath.substring(2); // Remove './'
// //       return currentDir ? `${currentDir}/${resolved}` : resolved;
// //     }

// //     // Handle relative paths starting with '../'
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

// //     // Return as-is for absolute paths
// //     return filePath;
// //   }

// //   function customRequire(filePath, currentDir = '') {
// //     const resolvedPath = resolvePath(filePath, currentDir);

// //     // Check if it's a core module first
// //     if (coreModules[resolvedPath]) {
// //       return coreModules[resolvedPath];
// //     }

// //     // Check cache
// //     if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;

// //     // Check if file exists
// //     if (!files[resolvedPath]) {
// //       // Try to find the file with different path variations
// //       const possiblePaths = [
// //         resolvedPath,
// //         resolvedPath.replace(/^\.\//, ''), // Remove leading './'
// //         filePath.replace(/^\.\//, ''), // Remove leading './' from original
// //       ];

// //       let foundPath = null;
// //       for (const path of possiblePaths) {
// //         if (files[path]) {
// //           foundPath = path;
// //           break;
// //         }
// //       }

// //       if (!foundPath) {
// //         console.error('Available files:', Object.keys(files));
// //         console.error('Trying to require:', filePath);
// //         console.error('Resolved to:', resolvedPath);
// //         console.error('Current dir:', currentDir);
// //         throw new Error(`Module not found: ${filePath}`);
// //       }

// //       const module = { exports: {} };
// //       moduleCache[resolvedPath] = module;

// //       // Determine the current directory for nested requires
// //       const pathParts = foundPath.split('/');
// //       const newCurrentDir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

// //       const wrappedCode = `
// //         (function(require, module, exports) {
// //           ${files[foundPath]}
// //         })
// //       `;

// //       const fn = eval(wrappedCode);
// //       fn((path) => customRequire(path, newCurrentDir), module, module.exports);

// //       return module.exports;
// //     }

// //     const module = { exports: {} };
// //     moduleCache[resolvedPath] = module;

// //     // Determine the current directory for nested requires
// //     const pathParts = resolvedPath.split('/');
// //     const newCurrentDir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

// //     const wrappedCode = `
// //       (function(require, module, exports) {
// //         ${files[resolvedPath]}
// //       })
// //     `;

// //     const fn = eval(wrappedCode);
// //     fn((path) => customRequire(path, newCurrentDir), module, module.exports);

// //     return module.exports;
// //   }

// //   return customRequire;
// // }
