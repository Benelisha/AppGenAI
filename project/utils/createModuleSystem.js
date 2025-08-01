import React from 'react';
import * as ReactNative from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function createModuleSystem(files) {
  const moduleCache = {};

  // ✅ Core modules
  const coreModules = {
    'react': React,
    'react-native': ReactNative,
    '@react-native-async-storage/async-storage': AsyncStorage,
    'AsyncStorage': AsyncStorage,
    'async-storage': AsyncStorage,
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

    // ✅ Core modules check
    if (coreModules[resolvedPath]) {
      console.log(`✅ Loading core module: ${resolvedPath}`);
      return coreModules[resolvedPath];
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

//   // ✅ Fixed core modules - AsyncStorage should be exposed directly
//   const coreModules = {
//     'react': React,
//     'react-native': ReactNative,
//     '@react-native-async-storage/async-storage': AsyncStorage, // ✅ Direct export, not wrapped
//     'AsyncStorage': AsyncStorage, // ✅ Alternative import name
//     'async-storage': AsyncStorage, // ✅ Another alternative
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

//     // ✅ Enhanced core module checking with debugging
//     if (coreModules[resolvedPath]) {
//       console.log(`✅ Loading core module: ${resolvedPath}`);
//       const module = coreModules[resolvedPath];
      
//       // ✅ Special debugging for AsyncStorage
//       if (resolvedPath.includes('async-storage') || resolvedPath === 'AsyncStorage') {
//         console.log('🔍 AsyncStorage module:', module);
//         console.log('🔍 AsyncStorage methods:', module ? Object.keys(module) : 'undefined');
//         console.log('🔍 getItem method:', module?.getItem);
//       }
      
//       return module;
//     }

//     if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;

//     const possiblePaths = [
//       resolvedPath,
//       resolvedPath.replace(/^\.\//, ''),
//       filePath.replace(/^\.\//, ''),
//     ];

//     let foundPath = possiblePaths.find(path => files[path]);

//     if (!foundPath) {
//       console.error('Available files:', Object.keys(files));
//       console.error('Available core modules:', Object.keys(coreModules));
//       console.error('Trying to require:', filePath);
//       console.error('Resolved to:', resolvedPath);
//       console.error('Current dir:', currentDir);
//       throw new Error(`Module not found: ${filePath}`);
//     }

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
