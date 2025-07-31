import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface DirectoryItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: DirectoryItem[];
}

interface ProgramErrorDisplayProps {
  error: string;
  programId: string;
  directoryTree: DirectoryItem[];
}

const ProgramErrorDisplay: React.FC<ProgramErrorDisplayProps> = ({
  error,
  programId,
  directoryTree,
}) => {
  // Function to render tree structure
  const renderTreeItem = (item: DirectoryItem, depth: number = 0, isLast: boolean = true, parentPrefix: string = ''): React.ReactNode => {
    const currentPrefix = parentPrefix + (isLast ? '└── ' : '├── ');
    const nextPrefix = parentPrefix + (isLast ? '    ' : '│   ');
    const icon = item.type === 'folder' ? '📁' : '📄';
    
    if (item.type === 'folder') {
      return (
        <View key={item.path}>
          <Text style={styles.debugText}>
            {currentPrefix}{icon} {item.name}/
          </Text>
          {item.children && item.children.map((child: DirectoryItem, index: number) => 
            renderTreeItem(child, depth + 1, index === (item.children?.length || 0) - 1, nextPrefix)
          )}
        </View>
      );
    } else {
      return (
        <Text key={item.path} style={styles.debugText}>
          {currentPrefix}{icon} {item.name}
        </Text>
      );
    }
  };

  return (
    <ScrollView style={styles.errorContainer}>
      <Text style={styles.errorText}>Error loading program: {error}</Text>
      
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Information:</Text>
        
        <Text style={styles.debugSectionTitle}>Directory Structure:</Text>
        <View style={styles.treeContainer}>
          <Text style={styles.debugText}>📁 {programId}/</Text>
          {directoryTree.map((item, index) => 
            renderTreeItem(item, 1, index === directoryTree.length - 1, '')
          )}
        </View>
        
        <Text style={styles.debugSectionTitle}>Looking for:</Text>
        <Text style={styles.debugText}>📄 index.js (main entry point)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },
  debugContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  debugSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 12,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontFamily: "monospace",
  },
  treeContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
});

export default ProgramErrorDisplay;
