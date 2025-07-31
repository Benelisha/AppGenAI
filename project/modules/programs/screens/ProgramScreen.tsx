import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import type { RootStackParamList } from "../../../navigation/types";
import { PATHS } from "../../../constants/paths";
import { createModuleSystem } from "../../../utils/createModuleSystem";
import ProgramErrorDisplay from "../components/ProgramErrorDisplay";

type ProgramScreenRouteProp = RouteProp<RootStackParamList, "Program">;

const ProgramScreen: React.FC = () => {
  const route = useRoute<ProgramScreenRouteProp>();
  const { programId } = route.params; // This is now the folder name
  const [MiniApp, setMiniApp] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [directoryTree, setDirectoryTree] = useState<any[]>([]);

  useEffect(() => {
    async function loadProgram() {
      try {
        const folderUri = PATHS.PROGRAMS + programId + '/';
        
        // Build directory tree
        const tree = await buildDirectoryTree(folderUri, '');
        setDirectoryTree(tree);

        // Get only files for the module system
        const fileContents: Record<string, string> = {};
        await collectFiles(folderUri, '', fileContents);

        const requireFunc = createModuleSystem(fileContents);
        const AppComponent = requireFunc('index.js'); // Your app entry point

        setMiniApp(() => AppComponent);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : String(e));
      }
    }

    loadProgram();
  }, [programId]);

  // Recursive function to build directory tree
  const buildDirectoryTree = async (basePath: string, relativePath: string): Promise<any[]> => {
    try {
      const items = await FileSystem.readDirectoryAsync(basePath);
      const tree = [];

      for (const item of items) {
        const fullPath = basePath + item;
        const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
        const fileInfo = await FileSystem.getInfoAsync(fullPath);

        if (fileInfo.isDirectory) {
          const children = await buildDirectoryTree(fullPath + '/', itemRelativePath);
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
  };

  // Recursive function to collect all files for the module system
  const collectFiles = async (basePath: string, relativePath: string, fileContents: Record<string, string>) => {
    try {
      const items = await FileSystem.readDirectoryAsync(basePath);
      
      for (const item of items) {
        const fullPath = basePath + item;
        const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
        const fileInfo = await FileSystem.getInfoAsync(fullPath);

        if (fileInfo.isDirectory) {
          await collectFiles(fullPath + '/', itemRelativePath, fileContents);
        } else {
          fileContents[itemRelativePath] = await FileSystem.readAsStringAsync(fullPath);
        }
      }
    } catch (error) {
      console.error('Error collecting files:', error);
    }
  };

  if (error) {
    return (
      <ProgramErrorDisplay 
        error={error}
        programId={programId}
        directoryTree={directoryTree}
      />
    );
  }

  if (!MiniApp) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading program...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MiniApp />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
});

export default ProgramScreen;
