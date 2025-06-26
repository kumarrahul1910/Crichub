import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../components/FormInput';
import { useUser } from '../components/UserContext';
import { getTheme } from '../constants/theme';
import { useColorScheme } from '../hooks/useColorScheme';
import { authService } from '../services/auth';

function SignupScreen() {
  const { updateProfile } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);

  const validateName = (name: string) => {
    if (name.length < 2) return 'Name must be at least 2 characters long';
    if (!/^[a-zA-Z\s]*$/.test(name)) return 'Name should only contain letters and spaces';
    return '';
  };
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return '';
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };
  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    return '';
  };
  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'name': error = validateName(value); break;
      case 'phone': error = validatePhone(value); break;
      case 'email': error = validateEmail(value); break;
      case 'password': error = validatePassword(value); break;
    }
    setFieldErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const handleSignup = async () => {
    const nameError = validateField('name', name);
    const phoneError = validateField('phone', phone);
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    if (nameError || phoneError || emailError || passwordError) {
      setError('Please fix the errors in the form');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authService.signup(name, email, phone, password);
      if (result.success) {
        updateProfile({ name, email, phone, joinDate: new Date().toISOString() });
        router.replace('/home');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch {
      setError('Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: theme.spacing.lg,
      justifyContent: 'center',
      minHeight: '100%',
      width: '100%',
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      opacity: 0.7,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    buttonDisabled: {
      opacity: 0.7,
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
    errorText: {
      color: theme.colors.error,
      ...theme.typography.body,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
  });

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create your account</Text>
        <FormInput
          label="Full Name"
          value={name}
          onChangeText={(text) => { setName(text); validateField('name', text); }}
          placeholder="Enter your full name"
          autoCapitalize="words"
          error={fieldErrors.name}
          icon={<Ionicons name="person-outline" size={20} color="#666" />}
        />
        <FormInput
          label="Phone Number"
          value={phone}
          onChangeText={(text) => { setPhone(text); validateField('phone', text); }}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          error={fieldErrors.phone}
          icon={<Ionicons name="call-outline" size={20} color="#666" />}
        />
        <FormInput
          label="Email"
          value={email}
          onChangeText={(text) => { setEmail(text); validateField('email', text); }}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
          icon={<Ionicons name="mail-outline" size={20} color="#666" />}
        />
        <FormInput
          label="Password"
          value={password}
          onChangeText={(text) => { setPassword(text); validateField('password', text); }}
          placeholder="Enter your password"
          secureTextEntry
          error={fieldErrors.password}
          icon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
        />
        <FormInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.secondary} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default SignupScreen; 