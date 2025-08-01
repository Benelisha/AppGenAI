import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

interface GPTChatModalProps {
  visible: boolean;
  onClose: () => void;
  programId: string;
  onSendPrompt: (prompt: string) => void;
}

const GPTChatModal: React.FC<GPTChatModalProps> = ({
  visible,
  onClose,
  programId,
  onSendPrompt,
}) => {
  const [promptText, setPromptText] = useState('');

  const handleSend = () => {
    if (promptText.trim()) {
      onSendPrompt(promptText.trim());
      setPromptText('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Edit {programId.replace(/_/g, ' ')}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Chat Area */}
            <View style={styles.chatArea}>
              <Text style={styles.instructionText}>
                Tell me what you'd like to change in your mini-app:
              </Text>
            </View>
            
            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your request here... (e.g., 'Add a button that shows an alert')"
                placeholderTextColor="#999"
                value={promptText}
                onChangeText={setPromptText}
                multiline={true}
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendButton, !promptText.trim() && styles.sendButtonDisabled]} 
                onPress={handleSend}
                disabled={!promptText.trim()}
              >
                <Text style={[styles.sendButtonText, !promptText.trim() && styles.sendButtonTextDisabled]}>
                  ➤
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    minHeight: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sendButtonTextDisabled: {
    color: '#999',
  },
});

export default GPTChatModal;
