import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const SettingItem: React.FC<{
    title: string;
    description?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
    showSwitch?: boolean;
    showArrow?: boolean;
  }> = ({ title, description, value, onValueChange, onPress, showSwitch = false, showArrow = false }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        />
      )}
      {showArrow && (
        <Text style={styles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          title="Push Notifications"
          description="Receive notifications for updates"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          showSwitch={true}
        />
        <SettingItem
          title="Dark Mode"
          description="Use dark theme"
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          showSwitch={true}
        />
        <SettingItem
          title="Auto Sync"
          description="Automatically sync data"
          value={autoSyncEnabled}
          onValueChange={setAutoSyncEnabled}
          showSwitch={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          title="Profile"
          description="Manage your profile"
          onPress={() => {/* Handle profile press */}}
          showArrow={true}
        />
        <SettingItem
          title="Privacy"
          description="Privacy settings"
          onPress={() => {/* Handle privacy press */}}
          showArrow={true}
        />
        <SettingItem
          title="Security"
          description="Security settings"
          onPress={() => {/* Handle security press */}}
          showArrow={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          title="Help & Support"
          description="Get help and support"
          onPress={() => {/* Handle help press */}}
          showArrow={true}
        />
        <SettingItem
          title="About"
          description="App version and info"
          onPress={() => {/* Handle about press */}}
          showArrow={true}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  settingItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 8,
  },
});

export default SettingsScreen;
