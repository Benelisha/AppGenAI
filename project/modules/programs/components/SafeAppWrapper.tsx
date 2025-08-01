import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  miniAppCode?: string; // The JS code of the mini app for debugging
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class SafeAppWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can log the error to an error reporting service here
    console.error('SafeAppWrapper caught an error:', error, errorInfo);
    
    // Also log the mini app code if available for debugging
    if (this.props.miniAppCode) {
      console.log('Mini App JS Code that caused the error:');
      console.log('----------------------------------------');
      console.log(this.props.miniAppCode);
      console.log('----------------------------------------');
    }
    
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  copyErrorToClipboard = async () => {
    const { error, errorInfo } = this.state;
    
    if (!error) return;

    const errorStack = error.stack || 'No stack trace available';
    const componentStack = errorInfo?.componentStack || 'No component stack available';
    const miniAppCode = this.props.miniAppCode || 'Mini app code not available';
    
    const fullErrorLog = `Render Error: ${error.message}

Stack Trace:
${errorStack}

Component Stack:
${componentStack}

Mini App JS Code:
----------------------------------------
${miniAppCode}
----------------------------------------

Error Details:
- Error Name: ${error.name}
- Timestamp: ${new Date().toISOString()}`;

    try {
      await Clipboard.setString(fullErrorLog);
      Alert.alert("Copied", "Error log copied to clipboard");
    } catch (clipboardError) {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const errorMessage = error?.message || 'Unknown error occurred';
      const errorStack = error?.stack || 'No stack trace available';
      const componentStack = errorInfo?.componentStack || 'No component stack available';

      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Mini App Render Error</Text>
          
          <ScrollView style={styles.errorScrollView} showsVerticalScrollIndicator={true}>
            <View style={styles.errorSection}>
              <Text style={styles.sectionTitle}>Error Message:</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>

            <View style={styles.errorSection}>
              <Text style={styles.sectionTitle}>Stack Trace:</Text>
              <Text style={styles.stackTraceText}>{errorStack}</Text>
            </View>

            <View style={styles.errorSection}>
              <Text style={styles.sectionTitle}>Component Stack:</Text>
              <Text style={styles.stackTraceText}>{componentStack}</Text>
            </View>

            {this.props.miniAppCode && (
              <View style={styles.errorSection}>
                <Text style={styles.sectionTitle}>Mini App JS Code:</Text>
                <Text style={styles.codeText}>{this.props.miniAppCode}</Text>
              </View>
            )}

            <View style={styles.errorSection}>
              <Text style={styles.sectionTitle}>Common Solutions:</Text>
              <Text style={styles.solutionText}>
                • Check that all components are properly exported{'\n'}
                • Verify import statements are correct{'\n'}
                • Ensure all dependencies are installed{'\n'}
                • Check for typos in component names{'\n'}
                • Verify default vs named exports
              </Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity
            style={styles.copyButton}
            onPress={this.copyErrorToClipboard}
          >
            <Text style={styles.copyButtonText}>📋 Copy Error Log</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff5f5",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 16,
    textAlign: "center",
  },
  errorScrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ffcccb",
  },
  errorSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#d32f2f",
    fontFamily: "monospace",
    lineHeight: 20,
    backgroundColor: "#ffebee",
    padding: 8,
    borderRadius: 4,
  },
  stackTraceText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    lineHeight: 16,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
    lineHeight: 16,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  solutionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    backgroundColor: "#e8f5e8",
    padding: 8,
    borderRadius: 4,
  },
  copyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  copyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SafeAppWrapper;
