import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../components/UserContext';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please log in to view your profile</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (editedProfile) {
      updateProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const renderField = (label: string, value: string | undefined, key: keyof typeof user) => {
    if (isEditing) {
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={editedProfile?.[key] as string}
            onChangeText={(text) => setEditedProfile(prev => prev ? { ...prev, [key]: text } : null)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'Not provided'}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: (isEditing ? editedProfile?.avatar : user.avatar) }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{isEditing ? editedProfile?.name : user.name}</Text>
        <Text style={styles.email}>{isEditing ? editedProfile?.email : user.email}</Text>
      </View>

      <View style={styles.content}>
        {renderField('Name', user.name, 'name')}
        {renderField('Email', user.email, 'email')}
        {renderField('Phone', user.phone, 'phone')}
        {renderField('Address', user.address, 'address')}
        
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>
            {new Date(user.joinDate).toLocaleDateString()}
          </Text>
        </View>

        {isEditing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={20} color="white" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  actionButtons: {
    marginTop: 20,
    gap: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#34C759',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 