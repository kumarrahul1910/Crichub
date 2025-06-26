import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../components/UserContext';
import { getTheme } from '../../constants/theme';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  if (!user) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      alignItems: 'center',
      padding: theme.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.lightGray,
      backgroundColor: theme.colors.background,
    },
    avatarContainer: {
      marginBottom: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.lightGray,
      width: 120,
      height: 120,
      borderRadius: 60,
      padding: theme.spacing.md,
    },
    name: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    section: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.lightGray,
    },
    detailContent: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    detailLabel: {
      ...theme.typography.caption,
      color: theme.colors.gray,
      marginBottom: 2,
    },
    detailValue: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.lightGray,
    },
    menuItemText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    logoutButton: {
      margin: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutButtonText: {
      color: theme.colors.text,
      ...theme.typography.body,
      fontWeight: 'bold',
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={100} color={theme.colors.primary} />
        </View>
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={24} color={theme.colors.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.menuItemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="cart-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.menuItemText}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.menuItemText}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
} 