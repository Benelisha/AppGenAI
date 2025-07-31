import * as FileSystem from "expo-file-system";

const FILES = {
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
};


export class Utils {
  static createRequireFromMap(map: Record<string, string>) {
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
