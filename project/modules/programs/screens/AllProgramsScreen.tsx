import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';

type NavigationProps = NavigationProp<RootStackParamList>;

const AllProgramsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  // Mock data for programs
  const programs = [
    { id: '1', title: 'Program Alpha', description: 'Advanced training program' },
    { id: '2', title: 'Program Beta', description: 'Intermediate level program' },
    { id: '3', title: 'Program Gamma', description: 'Beginner friendly program' },
  ];

  const handleProgramPress = (programId: string) => {
    navigation.navigate('Program', { programId });
  };

  const renderProgram = ({ item }: { item: typeof programs[0] }) => (
    <TouchableOpacity
      style={styles.programCard}
      onPress={() => handleProgramPress(item.id)}
    >
      <Text style={styles.programTitle}>{item.title}</Text>
      <Text style={styles.programDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Programs</Text>
      <FlatList
        data={programs}
        renderItem={renderProgram}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  programCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
});

export default AllProgramsScreen;
