import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';

type ProgramScreenRouteProp = RouteProp<RootStackParamList, 'Program'>;

const ProgramScreen: React.FC = () => {
  const route = useRoute<ProgramScreenRouteProp>();
  const { programId } = route.params;

  // Mock program data
  const getProgramData = (id: string) => {
    const programs = {
      '1': {
        title: 'Program Alpha',
        description: 'Advanced training program for experienced users',
        details: 'This program includes advanced techniques and methodologies...',
        duration: '12 weeks',
        level: 'Advanced',
      },
      '2': {
        title: 'Program Beta',
        description: 'Intermediate level program',
        details: 'Perfect for users with some experience...',
        duration: '8 weeks',
        level: 'Intermediate',
      },
      '3': {
        title: 'Program Gamma',
        description: 'Beginner friendly program',
        details: 'Great starting point for newcomers...',
        duration: '6 weeks',
        level: 'Beginner',
      },
    };
    return programs[id as keyof typeof programs] || programs['1'];
  };

  const program = getProgramData(programId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{program.title}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level:</Text>
            <Text style={styles.infoValue}>{program.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>{program.duration}</Text>
          </View>
        </View>
        <Text style={styles.description}>{program.description}</Text>
        <Text style={styles.detailsHeader}>Program Details</Text>
        <Text style={styles.details}>{program.details}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default ProgramScreen;
