import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import CreateProgramModal from '../../../modals/CreateProgramModal';
import DeleteProgramModal from '../../../modals/DeleteProgramModal';
import * as FileSystem from "expo-file-system";
import { Utils } from '../../../utils/Utils';
import { PATHS } from '../../../constants/paths';

type NavigationProps = NavigationProp<RootStackParamList>;

interface Program {
  id: string;
  title: string;
  description: string;
  folderName: string;
}

const AllProgramsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const programList = await Utils.readProgramsDirectory(PATHS.PROGRAMS);
      setPrograms(programList);
    } catch (error) {
      console.error('Error loading programs:', error);
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgramPress = (programId: string) => {
    navigation.navigate('Program', { programId });
  };

  const handleCreateNew = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleCreateProgram = async (programName: string) => {
    const folderName = programName.replaceAll(' ', '_').toLowerCase();
    await Utils.createNewProgram(PATHS.PROGRAMS, folderName);
    
    // Reload programs after creating a new one
    await loadPrograms();
    setIsModalVisible(false);
  };

  const handleDeletePress = (program: Program) => {
    setProgramToDelete(program);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setProgramToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (programToDelete) {
      try {
        await Utils.deleteProgramFolder(PATHS.PROGRAMS, programToDelete.folderName);
        await loadPrograms(); // Reload the programs list
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const renderProgram = ({ item }: { item: Program }) => (
    <View style={styles.programCard}>
      <TouchableOpacity
        style={styles.programContent}
        onPress={() => handleProgramPress(item.id)}
      >
        <Text style={styles.programTitle}>{item.title}</Text>
        <Text style={styles.programDescription}>{item.description}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePress(item)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>All Programs</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
          <Text style={styles.createButtonText}>Create New</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading programs...</Text>
        </View>
      ) : (
        <FlatList
          data={programs}
          renderItem={renderProgram}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No programs found</Text>
              <Text style={styles.emptySubtext}>Create your first program to get started</Text>
            </View>
          }
        />
      )}

      <CreateProgramModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onCreateProgram={handleCreateProgram}
      />
      
      <DeleteProgramModal
        visible={isDeleteModalVisible}
        programName={programToDelete?.title || ''}
        onClose={handleDeleteModalClose}
        onConfirmDelete={handleConfirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  programCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  programContent: {
    flex: 1,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffebee',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#d32f2f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default AllProgramsScreen;
