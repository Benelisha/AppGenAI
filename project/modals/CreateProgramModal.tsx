import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';

interface CreateProgramModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateProgram: (programName: string) => void;
}

const CreateProgramModal: React.FC<CreateProgramModalProps> = ({
  visible,
  onClose,
  onCreateProgram,
}) => {
  const [programName, setProgramName] = useState('');

  useEffect(() => {
    if (!visible) {
      setProgramName('');
    }
  }, [visible]);

  const handleCreateProgram = () => {
    if (programName.trim()) {
      onCreateProgram(programName.trim());
      setProgramName('');
    } else {
      Alert.alert('Error', 'Please enter a program name');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Program</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter program name"
            value={programName}
            onChangeText={setProgramName}
            autoFocus={true}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleCreateProgram}
            >
              <Text style={styles.confirmButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateProgramModal;
