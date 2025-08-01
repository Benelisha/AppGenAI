import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface DirectoryItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: DirectoryItem[];
}

interface JSFileContent {
  path: string;
  content: string;
}

interface ProgramErrorDisplayProps {
  error: string;
  programId: string;
  directoryTree: DirectoryItem[];
  jsFilesContent?: JSFileContent[]; // [{ path, content }]
  stacktrace?: string;
}

const ProgramErrorDisplay: React.FC<ProgramErrorDisplayProps> = ({
  error,
  programId,
  directoryTree,
  jsFilesContent = [],
  stacktrace = '',
}) => {
  const [copied, setCopied] = useState(false);
  
  // Function to render tree structure
  const renderTreeItem = (item: DirectoryItem, depth: number = 0, isLast: boolean = true, parentPrefix: string = ''): React.ReactNode => {
    const currentPrefix = parentPrefix + (isLast ? '└── ' : '├── ');
    const nextPrefix = parentPrefix + (isLast ? '    ' : '│   ');
    const icon = item.type === 'folder' ? '📁' : '📄';
    
    if (item.type === 'folder') {
      return (
        <View key={item.path}>
          <Text style={styles.treeText}>
            {currentPrefix}{icon} {item.name}/
          </Text>
          {item.children && item.children.map((child: DirectoryItem, index: number) => 
            renderTreeItem(child, depth + 1, index === (item.children?.length || 0) - 1, nextPrefix)
          )}
        </View>
      );
    } else {
      return (
        <Text key={item.path} style={styles.treeText}>
          {currentPrefix}{icon} {item.name}
        </Text>
      );
    }
  };

  // Compose all debug info, js files, and stacktrace for copying
  const getAllContent = () => {
    let out = '';
    out += '=== MINI APP ERROR LOG ===\n';
    out += `Program ID: ${programId}\n`;
    out += `Error: ${error}\n`;
    out += 'Error Source: Mini-app loading\n\n';
    
    out += '=== DIRECTORY STRUCTURE ===\n';
    out += `${programId}/\n`;
    const renderTreeText = (item: DirectoryItem, depth = 1, isLast = true, parentPrefix = ''): string => {
      const currentPrefix = parentPrefix + (isLast ? '└── ' : '├── ');
      const nextPrefix = parentPrefix + (isLast ? '    ' : '│   ');
      const icon = item.type === 'folder' ? '📁' : '📄';
      let str = `${currentPrefix}${icon} ${item.name}${item.type === 'folder' ? '/' : ''}\n`;
      if (item.type === 'folder' && item.children) {
        item.children.forEach((child, idx) => {
          str += renderTreeText(child, depth + 1, idx === (item.children?.length || 0) - 1, nextPrefix);
        });
      }
      return str;
    };
    directoryTree.forEach((item, idx) => {
      out += renderTreeText(item, 1, idx === directoryTree.length - 1, '');
    });
    
    out += '\n=== ALL FILE CONTENTS ===\n\n';
    jsFilesContent.forEach(f => {
      out += `--- ${f.path} ---\n`;
      out += f.content + '\n\n';
    });
    
    out += '=== STACK TRACE ===\n';
    out += stacktrace + '\n\n';
    
    out += `Generated at: ${new Date().toISOString()}\n`;
    return out;
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(getAllContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    Alert.alert('Copied!', 'Debug information copied to clipboard.');
  };

  return (
    <ScrollView style={styles.errorContainer}>
      <Text style={styles.sectionHeader}>=== MINI APP ERROR LOG ===</Text>
      <View style={styles.logSection}>
        <Text style={styles.logText}>Program ID: {programId}</Text>
        <Text style={styles.logText}>Error: Failed to load mini-app: {error}</Text>
        <Text style={styles.logText}>Error Source: Mini-app loading</Text>
      </View>

      <Text style={styles.sectionHeader}>=== DIRECTORY STRUCTURE ===</Text>
      <View style={styles.treeContainer}>
        <Text style={styles.treeText}>📁 {programId}/</Text>
        {directoryTree.map((item, index) => 
          renderTreeItem(item, 1, index === directoryTree.length - 1, '')
        )}
      </View>

      <Text style={styles.sectionHeader}>=== ALL FILE CONTENTS ===</Text>
      {jsFilesContent.map(f => (
        <View key={f.path} style={styles.fileContainer}>
          <Text style={styles.fileHeader}>--- {f.path} ---</Text>
          <View style={styles.codeScroll}>
            <Text style={styles.codeText}>{f.content}</Text>
          </View>
        </View>
      ))}

      {stacktrace && (
        <>
          <Text style={styles.sectionHeader}>=== STACK TRACE ===</Text>
          <View style={styles.stacktraceContainer}>
            <Text style={styles.stacktraceText}>{stacktrace}</Text>
          </View>
        </>
      )}

      <View style={styles.generatedContainer}>
        <Text style={styles.generatedText}>Generated at: {new Date().toISOString()}</Text>
      </View>

      {/* Copy Button */}
      <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
        <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy All to Clipboard'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  sectionHeader: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "monospace",
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  logSection: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logText: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  treeContainer: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  treeText: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "monospace",
  },
  fileContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
  },
  fileHeader: {
    fontSize: 14,
    color: "#0066cc",
    fontFamily: "monospace",
    marginBottom: 0,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  codeScroll: {
    backgroundColor: "#ffffff",
    padding: 12,
  },
  codeText: {
    fontSize: 13,
    color: "#000000",
    fontFamily: "monospace",
  },
  stacktraceContainer: {
    backgroundColor: "#fff8f8",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  stacktraceText: {
    fontSize: 13,
    color: "#d32f2f",
    fontFamily: "monospace",
  },
  generatedContainer: {
    marginTop: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  generatedText: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "monospace",
    textAlign: "right",
  },
  copyButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  copyButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: "monospace",
  },
});

export default ProgramErrorDisplay;
