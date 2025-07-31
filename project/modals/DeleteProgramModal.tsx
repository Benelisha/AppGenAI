import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface DeleteProgramModalProps {
  visible: boolean;
  programName: string;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteProgramModal: React.FC<DeleteProgramModalProps> = ({
  visible,
  programName,
  onClose,
  onConfirmDelete,
}) => {
  const handleConfirm = () => {
    onConfirmDelete();
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Delete Program</Text>
          
          <Text style={styles.message}>
            Are you sure you want to delete "{programName}"?
          </Text>
          
          <Text style={styles.warning}>
            This action cannot be undone. All files in this program will be permanently deleted.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.deleteButton} onPress={handleConfirm}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    minWidth: 300,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DeleteProgramModal;
