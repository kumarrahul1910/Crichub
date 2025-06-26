import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTheme } from '../constants/theme';
import { useColorScheme } from '../hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);

  const handleLogout = () => {
    router.replace('/login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      minWidth: 200,
    },
    buttonText: {
      color: theme.colors.secondary,
      ...theme.typography.body,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <Text style={styles.subtitle}>You are now logged in!</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
} 