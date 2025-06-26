import { TextStyle } from 'react-native';
import { Colors } from './Colors';

export function getTheme(scheme: 'light' | 'dark' = 'light') {
  const colors = Colors[scheme];
  return {
    colors: {
      primary: scheme === 'light' ? '#6366F1' : '#8B5CF6', // Indigo for light, violet for dark
      secondary: scheme === 'light' ? '#F1F5F9' : '#27272A', // Soft blue-gray for light, dark gray for dark
      background: colors.background,
      text: colors.text,
      error: '#EF4444', // Modern red
      success: '#22C55E', // Modern green
      gray: scheme === 'light' ? '#CBD5E1' : '#334155', // Blue-gray
      lightGray: scheme === 'light' ? '#F8FAFC' : '#1E293B',
      darkGray: scheme === 'light' ? '#64748B' : '#A1A1AA',
      accent: scheme === 'light' ? '#F472B6' : '#F9A8D4', // Pink accent
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: '700' as TextStyle['fontWeight'],
        letterSpacing: 0.5,
      },
      h2: {
        fontSize: 24,
        fontWeight: '600' as TextStyle['fontWeight'],
        letterSpacing: 0.25,
      },
      body: {
        fontSize: 16,
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.15,
      },
      caption: {
        fontSize: 14,
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.1,
      },
    },
    borderRadius: {
      sm: 6,
      md: 12,
      lg: 24,
    },
  };
} 