// utils/createModuleSystem.js
import React from 'react';
import * as ReactNative from 'react-native';

export function createModuleSystem(files) {
  const moduleCache = {};

  // Core modules that should be available to all mini-apps
  const coreModules = {
    'react': React,
    'react-native': ReactNative,
  };

  // Function to resolve relative paths
  function resolvePath(filePath, currentDir = '') {
    // Handle core modules
    if (coreModules[filePath]) {
      return filePath;
    }

    // Handle relative paths starting with './'
    if (filePath.startsWith('./')) {
      const resolved = filePath.substring(2); // Remove './'
      return currentDir ? `${currentDir}/${resolved}` : resolved;
    }

    // Handle relative paths starting with '../'
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

    // Return as-is for absolute paths
    return filePath;
  }

  function customRequire(filePath, currentDir = '') {
    const resolvedPath = resolvePath(filePath, currentDir);
    
    // Check if it's a core module first
    if (coreModules[resolvedPath]) {
      return coreModules[resolvedPath];
    }

    // Check cache
    if (moduleCache[resolvedPath]) return moduleCache[resolvedPath].exports;
    
    // Check if file exists
    if (!files[resolvedPath]) {
      // Try to find the file with different path variations
      const possiblePaths = [
        resolvedPath,
        resolvedPath.replace(/^\.\//, ''), // Remove leading './'
        filePath.replace(/^\.\//, ''), // Remove leading './' from original
      ];
      
      let foundPath = null;
      for (const path of possiblePaths) {
        if (files[path]) {
          foundPath = path;
          break;
        }
      }
      
      if (!foundPath) {
        console.error('Available files:', Object.keys(files));
        console.error('Trying to require:', filePath);
        console.error('Resolved to:', resolvedPath);
        console.error('Current dir:', currentDir);
        throw new Error(`Module not found: ${filePath}`);
      }
      
      const module = { exports: {} };
      moduleCache[resolvedPath] = module;

      // Determine the current directory for nested requires
      const pathParts = foundPath.split('/');
      const newCurrentDir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

      const wrappedCode = `
        (function(require, module, exports) {
          ${files[foundPath]}
        })
      `;

      const fn = eval(wrappedCode);
      fn((path) => customRequire(path, newCurrentDir), module, module.exports);

      return module.exports;
    }

    const module = { exports: {} };
    moduleCache[resolvedPath] = module;

    // Determine the current directory for nested requires
    const pathParts = resolvedPath.split('/');
    const newCurrentDir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

    const wrappedCode = `
      (function(require, module, exports) {
        ${files[resolvedPath]}
      })
    `;

    const fn = eval(wrappedCode);
    fn((path) => customRequire(path, newCurrentDir), module, module.exports);

    return module.exports;
  }

  return customRequire;
}
