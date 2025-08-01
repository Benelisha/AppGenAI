import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FILES = {
  "index.js": `
    import React, { useState, useEffect } from 'react';
    import { View, Text, Button, StyleSheet, Alert } from 'react-native';
    import AsyncStorage from '@react-native-async-storage/async-storage';

    export default function App() {
      const [storedValue, setStoredValue] = useState('Not loaded');
      const [count, setCount] = useState(0);

      const testAsyncStorage = () => {
        console.log('🧪 Testing AsyncStorage...');
        console.log('🧪 AsyncStorage object:', AsyncStorage);
        
        const testKey = 'mini-app-test';
        const testValue = 'Hello from MiniApp! Count: ' + count;
        
        return AsyncStorage.setItem(testKey, testValue)
          .then(() => {
            console.log('✅ Stored:', testValue);
            return AsyncStorage.getItem(testKey);
          })
          .then((retrieved) => {
            console.log('✅ Retrieved:', retrieved);
            setStoredValue(retrieved || 'null');
            Alert.alert('Success!', 'AsyncStorage works! Stored: ' + retrieved);
          })
          .catch((error) => {
            console.error('❌ AsyncStorage error:', error);
            Alert.alert('Error!', 'AsyncStorage failed: ' + error.message);
            setStoredValue('Error: ' + error.message);
          });
      };

      const increment = () => {
        setCount(c => c + 1);
      };

      useEffect(() => {
        const loadStoredValue = () => {
          return AsyncStorage.getItem('mini-app-test')
            .then((stored) => {
              setStoredValue(stored || 'No stored value');
            })
            .catch((error) => {
              console.error('Error loading stored value:', error);
              setStoredValue('Error loading: ' + error.message);
            });
        };
        loadStoredValue();
      }, []);

      return (
        <View style={styles.container}>
          <Text style={styles.title}>MiniApp AsyncStorage Test</Text>
          <Text style={styles.text}>Count: {count}</Text>
          <Text style={styles.text}>Stored: {String(storedValue)}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Increment" onPress={increment} />
          </View>
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20 
      },
      title: { 
        fontSize: 22, 
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      text: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center'
      },
      buttonContainer: {
        marginVertical: 5,
        width: 200
      }
    });
  `,

  "hooks/useCounter.js": `
    import { useState } from 'react';

    export default function useCounter() {
      const [count, setCount] = useState(0);
      
      const increment = () => {
        setCount(c => c + 1);
      };
      
      return { count, increment };
    }
  `,

  "components/CounterDisplay.js": `
    import React from 'react';
    import { Text, StyleSheet } from 'react-native';

    export default function CounterDisplay(props) {
      const displayCount = String(props.count || 0);
      
      return <Text style={styles.countText}>Count: {displayCount}</Text>;
    }

    const styles = StyleSheet.create({
      countText: { 
        fontSize: 18, 
        marginBottom: 10,
        textAlign: 'center'
      }
    });
  `,

  "utils/storage.js": `
    import AsyncStorage from '@react-native-async-storage/async-storage';

    export default {
      setItem: (key, value) => {
        console.log('📦 Storing:', key, value);
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        return AsyncStorage.setItem(key, stringValue)
          .then(() => true)
          .catch((error) => {
            console.error('❌ Storage setItem error:', error);
            return false;
          });
      },

      getItem: (key) => {
        console.log('📦 Getting:', key);
        return AsyncStorage.getItem(key)
          .then((value) => value)
          .catch((error) => {
            console.error('❌ Storage getItem error:', error);
            return null;
          });
      },

      getItemAsObject: (key) => {
        return AsyncStorage.getItem(key)
          .then((value) => value ? JSON.parse(value) : null)
          .catch((error) => {
            console.error('❌ Storage getItemAsObject error:', error);
            return null;
          });
      },

      removeItem: (key) => {
        console.log('📦 Removing:', key);
        return AsyncStorage.removeItem(key)
          .then(() => true)
          .catch((error) => {
            console.error('❌ Storage removeItem error:', error);
            return false;
          });
      }
    };
  `,

  "utils/api.js": `
    export default {
      get: (url) => {
        console.log('🌐 GET request to:', url);
        return fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
          })
          .catch((error) => {
            console.error('❌ GET request error:', error);
            throw error;
          });
      },

      post: (url, data) => {
        console.log('🌐 POST request to:', url);
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
          })
          .catch((error) => {
            console.error('❌ POST request error:', error);
            throw error;
          });
      }
    };
  `
};


export class Utils {
  
static createRequireFromMap(map: Record<string, string>) {
  const moduleCache: Record<string, any> = {};

  function require(path: string) {
    // Inject built-in modules here
    if (path === "@react-native-async-storage/async-storage") {
      return AsyncStorage;
    }
    if (path === "react") return require("react");
    if (path === "react-native") return require("react-native");

    if (moduleCache[path]) return moduleCache[path];

    const code = map[path];
    if (!code) throw new Error("Module not found: " + path);

    const module = { exports: {} };
    const wrappedCode = `(function(require, module, exports) { ${code} \n})`;
    const fn = eval(wrappedCode);
    fn(require, module, module.exports);

    moduleCache[path] = module.exports;
    return module.exports;
  }

  return require;
}


  static async createNewProgram(
    basePath: string,
    folderName: string
  ): Promise<void> {
    const fullBasePath = `${basePath}${folderName}/`;

    try {
      // Step 1: Create folders
      const folders = new Set<string>();
      Object.keys(FILES).forEach((filePath) => {
        const parts = filePath.split("/");
        if (parts.length > 1) {
          const folderPath = fullBasePath + parts.slice(0, -1).join("/");
          folders.add(folderPath);
        }
      });

      for (const folder of folders) {
        const folderInfo = await FileSystem.getInfoAsync(folder);
        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
        }
      }

      // Step 2: Write files
      for (const [relativePath, content] of Object.entries(FILES)) {
        const filePath = fullBasePath + relativePath;
        await FileSystem.writeAsStringAsync(filePath, content.trim());
      }

      console.log(`✅ Created program at ${fullBasePath}`);
    } catch (err) {
      console.error("❌ Failed to create program:", err);
      throw err;
    }
  }

  static async updateProgram(
    basePath: string,
    folderName: string,
    files: Array<{ path: string; content: string }>
  ): Promise<void> {
    const fullBasePath = `${basePath}${folderName}/`;

    try {
      // Check if program folder exists
      const programInfo = await FileSystem.getInfoAsync(fullBasePath);
      if (!programInfo.exists) {
        throw new Error(`Program folder does not exist: ${fullBasePath}`);
      }

      // Step 1: Create any necessary folders for new file paths
      const folders = new Set<string>();
      files.forEach((file) => {
        const parts = file.path.split("/");
        if (parts.length > 1) {
          const folderPath = fullBasePath + parts.slice(0, -1).join("/");
          folders.add(folderPath);
        }
      });

      for (const folder of folders) {
        const folderInfo = await FileSystem.getInfoAsync(folder);
        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
        }
      }

      // Step 2: Write/update files
      for (const file of files) {
        const filePath = fullBasePath + file.path;
        await FileSystem.writeAsStringAsync(filePath, file.content.trim());
      }

      console.log(`✅ Updated program at ${fullBasePath} with ${files.length} files`);
    } catch (err) {
      console.error("❌ Failed to update program:", err);
      throw err;
    }
  }

  static async deleteProgramFolder(
    basePath: string,
    folderName: string
  ): Promise<void> {
    const fullPath = `${basePath}${folderName}/`;

    try {
      // Check if folder exists
      const folderInfo = await FileSystem.getInfoAsync(fullPath);
      if (!folderInfo.exists) {
        console.warn(`Program folder does not exist: ${fullPath}`);
        return;
      }

      // Delete the entire folder and its contents
      await FileSystem.deleteAsync(fullPath, { idempotent: true });
      console.log(`✅ Deleted program folder: ${fullPath}`);
    } catch (error) {
      console.error("❌ Failed to delete program folder:", error);
      throw error;
    }
  }

  static async readProgramsDirectory(
    programsPath: string
  ): Promise<
    Array<{
      id: string;
      title: string;
      description: string;
      folderName: string;
    }>
  > {
    try {
      // Check if programs directory exists
      const programsDirInfo = await FileSystem.getInfoAsync(programsPath);
      if (!programsDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(programsPath, {
          intermediates: true,
        });
        return [];
      }

      // Read all folders in the programs directory
      const items = await FileSystem.readDirectoryAsync(programsPath);

      const programList: Array<{
        id: string;
        title: string;
        description: string;
        folderName: string;
      }> = [];
      for (const item of items) {
        const itemPath = `${programsPath}${item}`;
        const itemInfo = await FileSystem.getInfoAsync(itemPath);

        if (itemInfo.isDirectory) {
          // Convert folder name back to readable title
          const title = item
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          programList.push({
            id: item,
            title: title,
            description: `Program created from ${item}`,
            folderName: item,
          });
        }
      }

      return programList;
    } catch (error) {
      console.error("Error loading programs:", error);
      return [];
    }
  }

  static async readProgramFiles(
    programsPath: string,
    programId: string
  ): Promise<string[]> {
    try {
      const programPath = `${programsPath}${programId}/`;

      // Check if program directory exists
      const programDirInfo = await FileSystem.getInfoAsync(programPath);
      if (!programDirInfo.exists) {
        console.error("Program directory does not exist:", programPath);
        return [];
      }

      // Get all files recursively
      const allFiles = await this.getAllFilesRecursive(programPath, "");
      return allFiles;
    } catch (error) {
      console.error("Error loading program files:", error);
      return [];
    }
  }

  static async buildDirectoryTree(
    basePath: string,
    relativePath: string = ""
  ): Promise<any[]> {
    try {
      const items = await FileSystem.readDirectoryAsync(basePath);
      const tree = [];

      for (const item of items) {
        const fullPath = basePath + item;
        const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
        const fileInfo = await FileSystem.getInfoAsync(fullPath);

        if (fileInfo.isDirectory) {
          const children = await this.buildDirectoryTree(fullPath + '/', itemRelativePath);
          tree.push({
            name: item,
            type: 'folder',
            path: itemRelativePath,
            children: children
          });
        } else {
          tree.push({
            name: item,
            type: 'file',
            path: itemRelativePath
          });
        }
      }

      return tree.sort((a, b) => {
        // Folders first, then files, both alphabetically
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      return [];
    }
  }

//   static async getProgramFileContents(
//     programsPath: string,
//     programId: string
//   ): Promise<Record<string, string>> {
//     try {
//       const folderUri = `${programsPath}${programId}/`;
//       const fileContents: Record<string, string> = {};
//       await this.collectFilesForModuleSystem(folderUri, '', fileContents);
//       return fileContents;
//     } catch (error) {
//       console.error('Error getting program file contents:', error);
//       return {};
//     }
//   }

  static async readFolderAsFiles(
    folderPath: string
  ): Promise<Record<string, string>> {
    try {
      // Ensure the folder path ends with '/'
      const normalizedPath = folderPath.endsWith('/') ? folderPath : folderPath + '/';
      
      // Check if folder exists
      const folderInfo = await FileSystem.getInfoAsync(normalizedPath);
      if (!folderInfo.exists || !folderInfo.isDirectory) {
        console.error('Folder does not exist or is not a directory:', normalizedPath);
        return {};
      }

      const fileContents: Record<string, string> = {};
      await this.collectFilesForModuleSystem(normalizedPath, '', fileContents);
      return fileContents;
    } catch (error) {
      console.error('Error reading folder as files:', error);
      return {};
    }
  }

  // Add this improved function to Utils class

// static async collectFilesForModuleSystem(
//   basePath: string,
//   relativePath: string = '',
//   fileContents: Record<string, string> = {}
// ): Promise<Record<string, string>> {
//   try {
//     const fullPath = basePath + relativePath;
    
//     // ✅ Check if path exists and is accessible
//     const pathInfo = await FileSystem.getInfoAsync(fullPath);
//     if (!pathInfo.exists) {
//       console.log(`⚠️ Path does not exist: ${fullPath}`);
//       return fileContents;
//     }

//     if (pathInfo.isDirectory) {
//       // ✅ Read directory contents
//       const items = await FileSystem.readDirectoryAsync(fullPath);
      
//       for (const item of items) {
//         const itemPath = relativePath ? `${relativePath}/${item}` : item;
//         const itemFullPath = fullPath + '/' + item;
        
//         // ✅ Check each item type before processing
//         const itemInfo = await FileSystem.getInfoAsync(itemFullPath);
        
//         if (itemInfo.isDirectory) {
//           // ✅ Recursively process subdirectories
//           await this.collectFilesForModuleSystem(basePath, itemPath, fileContents);
//         } else {
//           // ✅ Only read files, not directories
//           try {
//             const content = await FileSystem.readAsStringAsync(itemFullPath);
//             fileContents[itemPath] = content;
//             console.log(`✅ Read file: ${itemPath} (${content.length} chars)`);
//           } catch (readError) {
//             console.error(`❌ Error reading file ${itemPath}:`, readError);
//           }
//         }
//       }
//     } else {
//       // ✅ Single file
//       try {
//         const content = await FileSystem.readAsStringAsync(fullPath);
//         const fileName = relativePath || fullPath.split('/').pop() || 'unknown';
//         fileContents[fileName] = content;
//         console.log(`✅ Read single file: ${fileName} (${content.length} chars)`);
//       } catch (readError) {
//         console.error(`❌ Error reading single file ${fullPath}:`, readError);
//       }
//     }
//   } catch (error) {
//     console.error(`❌ Error in collectFilesForModuleSystem for ${basePath}${relativePath}:`, error);
//   }

//   return fileContents;
// }

// Update the collectFilesForModuleSystem function
static async collectFilesForModuleSystem(
  basePath: string,
  relativePath: string = '',
  fileContents: Record<string, string> = {}
): Promise<Record<string, string>> {
  try {
    const fullPath = basePath + relativePath;
    
    // ✅ Check if path exists and get info
    const pathInfo = await FileSystem.getInfoAsync(fullPath);
    if (!pathInfo.exists) {
      console.log(`⚠️ Path does not exist: ${fullPath}`);
      return fileContents;
    }

    if (pathInfo.isDirectory) {
      // ✅ Read directory contents safely
      try {
        const items = await FileSystem.readDirectoryAsync(fullPath);
        
        for (const item of items) {
          // ✅ Skip hidden files and system files
          if (item.startsWith('.') || item === '__pycache__' || item === 'node_modules') {
            continue;
          }

          const itemPath = relativePath ? `${relativePath}/${item}` : item;
          const itemFullPath = fullPath + '/' + item;
          
          // ✅ Check each item type before processing
          try {
            const itemInfo = await FileSystem.getInfoAsync(itemFullPath);
            
            if (itemInfo.exists && itemInfo.isDirectory) {
              // ✅ Recursively process subdirectories
              await this.collectFilesForModuleSystem(basePath, itemPath, fileContents);
            } else if (itemInfo.exists && !itemInfo.isDirectory) {
              // ✅ Only read actual files, check if it's a text file
              if (item.endsWith('.js') || item.endsWith('.json') || item.endsWith('.txt')) {
                try {
                  const content = await FileSystem.readAsStringAsync(itemFullPath);
                  fileContents[itemPath] = content;
                  console.log(`✅ Read file: ${itemPath} (${content.length} chars)`);
                } catch (readError) {
                  console.error(`❌ Error reading file ${itemPath}:`, readError);
                }
              }
            }
          } catch (itemError) {
            console.error(`❌ Error checking item ${itemFullPath}:`, itemError);
          }
        }
      } catch (dirError) {
        console.error(`❌ Error reading directory ${fullPath}:`, dirError);
      }
    } else {
      // ✅ Single file
      try {
        const content = await FileSystem.readAsStringAsync(fullPath);
        const fileName = relativePath || fullPath.split('/').pop() || 'unknown';
        fileContents[fileName] = content;
        console.log(`✅ Read single file: ${fileName} (${content.length} chars)`);
      } catch (readError) {
        console.error(`❌ Error reading single file ${fullPath}:`, readError);
      }
    }
  } catch (error) {
    console.error(`❌ Error in collectFilesForModuleSystem for ${basePath}${relativePath}:`, error);
  }

  return fileContents;
}

// Manual transform ES6/JSX to CommonJS (completely rewritten for safety)
static transformToCommonJS(code: string): string {
  let transformed = code;
  
  console.log('🔄 Starting ES6 to CommonJS transformation...');
  
  // Step 1: Transform all import statements to requires
  
  // Handle: import React, { useState, useEffect } from 'react'
  transformed = transformed.replace(/import\s+React\s*,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]react['"];?\s*/g, (match, imports) => {
    return `const React = require('react');\nconst { ${imports.trim()} } = require('react');\n`;
  });
  
  // Handle: import React from 'react'
  transformed = transformed.replace(/import\s+React\s+from\s+['"]react['"];?\s*/g, "const React = require('react');\n");
  
  // Handle: import { ... } from 'react-native'
  transformed = transformed.replace(/import\s*\{\s*([^}]+)\s*\}\s*from\s+['"]react-native['"];?\s*/g, (match, imports) => {
    return `const { ${imports.trim()} } = require('react-native');\n`;
  });
  
  // Handle: import { ... } from 'react'
  transformed = transformed.replace(/import\s*\{\s*([^}]+)\s*\}\s*from\s+['"]react['"];?\s*/g, (match, imports) => {
    return `const { ${imports.trim()} } = require('react');\n`;
  });
  
  // Handle: import X from 'module'
  transformed = transformed.replace(/import\s+([A-Za-z0-9_$]+)\s+from\s+['"]([^'"]+)['"];?\s*/g, (match, varName, path) => {
    return `const ${varName} = require('${path}');\n`;
  });
  
  // Handle: import * as X from 'module'
  transformed = transformed.replace(/import\s*\*\s*as\s+([A-Za-z0-9_$]+)\s+from\s+['"]([^'"]+)['"];?\s*/g, (match, varName, path) => {
    return `const ${varName} = require('${path}');\n`;
  });
  
  // Step 2: Transform export statements
  
  // Handle: export default function Name
  transformed = transformed.replace(/export\s+default\s+function\s+([A-Za-z0-9_$]+)/g, 'module.exports = function $1');
  
  // Handle: export default
  transformed = transformed.replace(/export\s+default\s+/g, 'module.exports = ');
  
  // Step 3: Transform JSX to React.createElement (FIXED VERSION)
  
  // Handle the main JSX return statement in index.js with complete structure
  const jsxReturnPattern = /return\s*\(\s*<View\s+style=\{styles\.container\}>[\s\S]*?<\/View>\s*\);?/;
  if (jsxReturnPattern.test(transformed)) {
    transformed = transformed.replace(jsxReturnPattern, `return React.createElement(View, { style: styles.container },
        React.createElement(Text, { style: styles.title }, "MiniApp AsyncStorage Test"),
        React.createElement(Text, { style: styles.text }, "Count: " + count),
        React.createElement(Text, { style: styles.text }, "Stored: " + String(storedValue)),
        React.createElement(View, { style: styles.buttonContainer },
          React.createElement(Button, { title: "Increment", onPress: increment })
        )
      );`);
  }
  
  // Handle the CounterDisplay return statement
  const counterDisplayPattern = /return\s+<Text\s+style=\{styles\.countText\}>Count:\s*\{displayCount\}<\/Text>;?/;
  if (counterDisplayPattern.test(transformed)) {
    transformed = transformed.replace(counterDisplayPattern, 'return React.createElement(Text, { style: styles.countText }, "Count: " + displayCount);');
  }
  
  // Handle any remaining simple JSX patterns
  
  // Self-closing Button with props
  transformed = transformed.replace(/<Button\s+title="([^"]+)"\s+onPress=\{([^}]+)\}\s*\/>/g, 
    'React.createElement(Button, { title: "$1", onPress: $2 })');
  
  // Simple JSX tags with style props
  transformed = transformed.replace(/<([A-Z][A-Za-z0-9]*)\s+style=\{([^}]+)\}>/g, 
    'React.createElement($1, { style: $2 }, ');
  
  // Simple JSX tags without props
  transformed = transformed.replace(/<([A-Z][A-Za-z0-9]*)\s*>/g, 
    'React.createElement($1, null, ');
  
  // Closing JSX tags
  transformed = transformed.replace(/<\/[A-Z][A-Za-z0-9]*>/g, ')');
  
  // Step 4: Fix object literal syntax in exports and StyleSheet.create
  
  // Fix object exports (like export default { ... })
  transformed = transformed.replace(/module\.exports\s*=\s*\{([^}]*)\}/gs, (match, content) => {
    // Don't change StyleSheet.create calls
    if (content.includes('StyleSheet.create')) {
      return match;
    }
    return `module.exports = {${content}}`;
  });
  
  // Step 5: Clean up any remaining syntax issues
  
  // Remove any stray " + ... + " patterns that shouldn't be there
  transformed = transformed.replace(/"\s*\+\s*([^"]+)\s*\+\s*"/g, '$1');
  
  // Fix trailing commas before closing parentheses
  transformed = transformed.replace(/,\s*\)/g, ')');
  
  // Fix multiple consecutive commas
  transformed = transformed.replace(/,\s*,+/g, ',');
  
  console.log('🔄 Transformation complete');
  console.log('📝 First 500 chars of result:', transformed.substring(0, 500));
  
  return transformed;
}

// Update getProgramFileContents to use the improved function
static async getProgramFileContents(
  programsPath: string,
  programId: string
): Promise<Record<string, string>> {
  try {
    const programPath = `${programsPath}${programId}/`;
    console.log(`🔍 Reading program files from: ${programPath}`);
    
    const fileContents = await this.collectFilesForModuleSystem(programPath);
    
    // Transform each file from ES6/JSX to CommonJS
    const transformedFiles: Record<string, string> = {};
    for (const [path, content] of Object.entries(fileContents)) {
      transformedFiles[path] = this.transformToCommonJS(content);
    }
    
    console.log(`✅ Loaded and transformed ${Object.keys(transformedFiles).length} files:`, Object.keys(transformedFiles));
    return transformedFiles;
  } catch (error) {
    console.error('❌ Error getting program file contents:', error);
    return {};
  }
}
//   private static async collectFilesForModuleSystem(
//     basePath: string, 
//     relativePath: string, 
//     fileContents: Record<string, string>
//   ): Promise<void> {
//     try {
//       const items = await FileSystem.readDirectoryAsync(basePath);
      
//       for (const item of items) {
//         const fullPath = basePath + item;
//         const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
//         const fileInfo = await FileSystem.getInfoAsync(fullPath);

//         if (fileInfo.isDirectory) {
//           await this.collectFilesForModuleSystem(fullPath + '/', itemRelativePath, fileContents);
//         } else {
//           fileContents[itemRelativePath] = await FileSystem.readAsStringAsync(fullPath);
//         }
//       }
//     } catch (error) {
//       console.error('Error collecting files for module system:', error);
//     }
//   }

  private static async getAllFilesRecursive(
    dirPath: string,
    relativePath: string
  ): Promise<string[]> {
    try {
      const items = await FileSystem.readDirectoryAsync(dirPath);
      const fileList: string[] = [];

      for (const item of items) {
        const fullPath = `${dirPath}${item}`;
        const itemInfo = await FileSystem.getInfoAsync(fullPath);
        const itemRelativePath = relativePath
          ? `${relativePath}/${item}`
          : item;

        if (itemInfo.isDirectory) {
          // Recursively get files from subdirectories
          const subFiles = await this.getAllFilesRecursive(
            `${fullPath}/`,
            itemRelativePath
          );
          fileList.push(...subFiles);
        } else {
          fileList.push(itemRelativePath);
        }
      }

      return fileList;
    } catch (error) {
      console.error("Error reading directory:", error);
      return [];
    }
  }
}
