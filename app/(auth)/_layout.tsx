import { Stack } from 'expo-router';
import { getTheme } from '../../constants/theme';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function AuthLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          ...theme.typography.h2,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 