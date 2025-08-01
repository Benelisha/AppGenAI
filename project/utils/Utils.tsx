import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FILES = {
  "index.js": `
    const React = require('react');
    const { View, Text, Button, StyleSheet, Alert } = require('react-native');
    const AsyncStorage = require('@react-native-async-storage/async-storage');

    module.exports = function App() {
      const [storedValue, setStoredValue] = React.useState('Not loaded');
      const [count, setCount] = React.useState(0);

      // ✅ Convert async/await to Promise chains for eval() compatibility
      const testAsyncStorage = function() {
        console.log('🧪 Testing AsyncStorage...');
        console.log('🧪 AsyncStorage object:', AsyncStorage);
        
        // Test storing a simple string value
        const testKey = 'mini-app-test';
        const testValue = 'Hello from MiniApp! Count: ' + count;
        
        return AsyncStorage.setItem(testKey, testValue)
          .then(function() {
            console.log('✅ Stored:', testValue);
            // Test retrieving the value
            return AsyncStorage.getItem(testKey);
          })
          .then(function(retrieved) {
            console.log('✅ Retrieved:', retrieved);
            // ✅ Ensure we always set a string, never an object
            setStoredValue(retrieved || 'null');
            Alert.alert('Success!', 'AsyncStorage works! Stored: ' + retrieved);
          })
          .catch(function(error) {
            console.error('❌ AsyncStorage error:', error);
            Alert.alert('Error!', 'AsyncStorage failed: ' + error.message);
            // ✅ Set error as string, not object
            setStoredValue('Error: ' + error.message);
          });
      };

      const increment = function() {
        setCount(function(c) { return c + 1; });
      };

      // ✅ Load stored value on component mount using Promise syntax
      React.useEffect(function() {
        const loadStoredValue = function() {
          return AsyncStorage.getItem('mini-app-test')
            .then(function(stored) {
              setStoredValue(stored || 'No stored value');
            })
            .catch(function(error) {
              console.error('Error loading stored value:', error);
              setStoredValue('Error loading: ' + error.message);
            });
        };
        loadStoredValue();
      }, []);

      return React.createElement(View, { style: styles.container },
        React.createElement(Text, { style: styles.title }, "MiniApp AsyncStorage Test"),
        React.createElement(Text, { style: styles.text }, "Count: " + count),
        React.createElement(Text, { style: styles.text }, "Stored: " + String(storedValue)),
        React.createElement(View, { style: styles.buttonContainer },
          React.createElement(Button, { 
            title: "Increment", 
            onPress: increment 
          })
        ),
        React.createElement(View, { style: styles.buttonContainer },
          React.createElement(Button, { 
            title: "Test AsyncStorage", 
            onPress: testAsyncStorage 
          })
        )
      );
    };

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
    const { useState } = require('react');

    module.exports = function useCounter() {
      const [count, setCount] = useState(0);
      
      function increment() {
        setCount(function(c) { return c + 1; });
      }
      
      return { count: count, increment: increment };
    };
  `,

  "components/CounterDisplay.js": `
    const React = require('react');
    const { Text, StyleSheet } = require('react-native');

    module.exports = function CounterDisplay(props) {
      // ✅ Ensure count is always converted to string
      const displayCount = String(props.count || 0);
      
      return React.createElement(Text, { style: styles.countText }, "Count: " + displayCount);
    };

    const styles = StyleSheet.create({
      countText: { 
        fontSize: 18, 
        marginBottom: 10,
        textAlign: 'center'
      }
    });
  `,

  "utils/storage.js": `
    const AsyncStorage = require('@react-native-async-storage/async-storage');

    module.exports = {
      // ✅ Convert async functions to Promise-based functions
      setItem: function(key, value) {
        console.log('📦 Storing:', key, value);
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        return AsyncStorage.setItem(key, stringValue)
          .then(function() {
            return true;
          })
          .catch(function(error) {
            console.error('❌ Storage setItem error:', error);
            return false;
          });
      },

      getItem: function(key) {
        console.log('📦 Getting:', key);
        return AsyncStorage.getItem(key)
          .then(function(value) {
            return value; // Returns string or null
          })
          .catch(function(error) {
            console.error('❌ Storage getItem error:', error);
            return null;
          });
      },

      getItemAsObject: function(key) {
        return AsyncStorage.getItem(key)
          .then(function(value) {
            return value ? JSON.parse(value) : null;
          })
          .catch(function(error) {
            console.error('❌ Storage getItemAsObject error:', error);
            return null;
          });
      },

      removeItem: function(key) {
        console.log('📦 Removing:', key);
        return AsyncStorage.removeItem(key)
          .then(function() {
            return true;
          })
          .catch(function(error) {
            console.error('❌ Storage removeItem error:', error);
            return false;
          });
      }
    };
  `
};

/* const FILES = {
  "index.js": `
    const React = require('react');
    const { View, Text, Button, StyleSheet } = require('react-native');
    const useCounter = require('./hooks/useCounter.js');
    const CounterDisplay = require('./components/CounterDisplay.js');

    module.exports = function App() {
      const { count, increment } = useCounter();

      return React.createElement(View, { style: styles.container },
        React.createElement(Text, { style: styles.title }, "MiniApp Loaded from Memory"),
        React.createElement(CounterDisplay, { count }),
        React.createElement(Button, { title: "Increment", onPress: increment })
      );
    };

    const styles = StyleSheet.create({
      container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
      title: { fontSize: 22, marginBottom: 20 }
    });
  `,

  "hooks/useCounter.js": `
    const { useState } = require('react');

    module.exports = function useCounter() {
      const [count, setCount] = useState(0);
      function increment() {
        setCount(c => c + 1);
      }
      return { count, increment };
    };
  `,

  "components/CounterDisplay.js": `
    const React = require('react');
    const { Text, StyleSheet } = require('react-native');

    module.exports = function CounterDisplay({ count }) {
      return React.createElement(Text, { style: styles.countText }, "Count: " + count);
    };

    const styles = StyleSheet.create({
      countText: { fontSize: 18, marginBottom: 10 }
    });
  `
}; */


export class Utils {
  /* static createRequireFromMap(map: Record<string, string>) {
    const moduleCache: Record<string, any> = {};

    function require(path: string) {
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
  } */

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

static async collectFilesForModuleSystem(
  basePath: string,
  relativePath: string = '',
  fileContents: Record<string, string> = {}
): Promise<Record<string, string>> {
  try {
    const fullPath = basePath + relativePath;
    
    // ✅ Check if path exists and is accessible
    const pathInfo = await FileSystem.getInfoAsync(fullPath);
    if (!pathInfo.exists) {
      console.log(`⚠️ Path does not exist: ${fullPath}`);
      return fileContents;
    }

    if (pathInfo.isDirectory) {
      // ✅ Read directory contents
      const items = await FileSystem.readDirectoryAsync(fullPath);
      
      for (const item of items) {
        const itemPath = relativePath ? `${relativePath}/${item}` : item;
        const itemFullPath = fullPath + '/' + item;
        
        // ✅ Check each item type before processing
        const itemInfo = await FileSystem.getInfoAsync(itemFullPath);
        
        if (itemInfo.isDirectory) {
          // ✅ Recursively process subdirectories
          await this.collectFilesForModuleSystem(basePath, itemPath, fileContents);
        } else {
          // ✅ Only read files, not directories
          try {
            const content = await FileSystem.readAsStringAsync(itemFullPath);
            fileContents[itemPath] = content;
            console.log(`✅ Read file: ${itemPath} (${content.length} chars)`);
          } catch (readError) {
            console.error(`❌ Error reading file ${itemPath}:`, readError);
          }
        }
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

// ✅ Update getProgramFileContents to use the improved function
static async getProgramFileContents(
  programsPath: string,
  programId: string
): Promise<Record<string, string>> {
  try {
    const programPath = `${programsPath}${programId}/`;
    console.log(`🔍 Reading program files from: ${programPath}`);
    
    const fileContents = await this.collectFilesForModuleSystem(programPath);
    
    console.log(`✅ Loaded ${Object.keys(fileContents).length} files:`, Object.keys(fileContents));
    return fileContents;
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
