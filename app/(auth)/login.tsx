import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../../components/FormInput';
import { useUser } from '../../components/UserContext';
import { getTheme } from '../../constants/theme';
import { useColorScheme } from '../../hooks/useColorScheme';
import { authService } from '../../services/auth';

function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);
  const { setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.login(email, password);
      setUser({
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        phone: '',
        address: '',
        avatar: 'https://via.placeholder.com/150',
        joinDate: new Date().toISOString(),
      });
      router.replace('/(tabs)');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    buttonText: {
      color: theme.colors.secondary,
      ...theme.typography.body,
      fontWeight: 'bold',
    },
    linkButton: {
      marginTop: theme.spacing.md,
      alignItems: 'center',
    },
    linkText: {
      color: theme.colors.primary,
      ...theme.typography.body,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        error={error}
      />
      <FormInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        error={error}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.secondary} />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push('/(auth)/signup')}
      >
        <Text style={styles.linkText}>Don&apos;t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen; 