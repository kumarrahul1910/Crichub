import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { getTheme } from '../constants/theme';
import { useColorScheme } from '../hooks/useColorScheme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, icon, ...props }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);
  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
      width: '100%',
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    iconContainer: {
      position: 'absolute',
      left: theme.spacing.md,
      zIndex: 1,
      height: '100%',
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.lightGray,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      flex: 1,
      height: 48,
      fontSize: 16,
    },
    inputWithIcon: {
      paddingLeft: theme.spacing.xl * 2,
    },
    inputError: {
      borderColor: theme.colors.error,
      borderWidth: 2,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : null,
            icon ? styles.inputWithIcon : null,
          ]}
          placeholderTextColor={theme.colors.gray}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}; 