

import React from 'react';
import * as ReactNative from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FileContents {
  [key: string]: string;
}

export function createModuleSystem(files: FileContents): any {
  // Built-in modules
  const builtInModules: { [key: string]: any } = {
    'react': React,
    'react-native': ReactNative,
    '@react-native-async-storage/async-storage': AsyncStorage,
  };

  // Module cache
  const moduleCache: { [key: string]: { exports: any } } = {};

  // Synchronous require
  function requireModule(modulePath: string): any {
    // Built-in modules
    if (builtInModules[modulePath]) return builtInModules[modulePath];

    // Normalize path
    let normalizedPath = modulePath.replace(/^\.\//, '');
    if (files[normalizedPath]) modulePath = normalizedPath;
    else if (files[normalizedPath + '.js']) modulePath = normalizedPath + '.js';
    else if (files[normalizedPath + '/index.js']) modulePath = normalizedPath + '/index.js';
    else throw new Error(`Cannot find module: ${modulePath}`);

    if (moduleCache[modulePath]) return moduleCache[modulePath].exports;

    const code = files[modulePath]; // Code is already transformed in Utils.tsx

    const module = { exports: {} };
    moduleCache[modulePath] = module;

    // Wrap code in a function
    const func = new Function('exports', 'require', 'module', 'React', 'ReactNative', 'AsyncStorage', code);
    func(module.exports, requireModule, module, React, ReactNative, AsyncStorage);
    return module.exports;
  }

  // Entry points
  const entryPoints = ['index.js', 'App.js'];
  let lastError: any = null;
  for (const entry of entryPoints) {
    if (files[entry]) {
      try {
        const exp = requireModule(entry);
        if (typeof exp === 'function') return exp;
        if (exp && typeof exp.default === 'function') return exp.default;
        lastError = new Error(`Entry point ${entry} does not export a valid React component.`);
      } catch (e) {
        lastError = e;
      }
    }
  }
  throw lastError || new Error('No valid entry point found.');
}
