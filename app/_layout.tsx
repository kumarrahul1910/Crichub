import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../components/CartContext';
import { UserProvider } from '../components/UserContext';
import { WishlistProvider } from '../components/WishlistContext';
import { getTheme } from '../constants/theme';
import { useColorScheme } from '../hooks/useColorScheme';

// Suppress specific shadow* deprecation warning in development
if (process.env.NODE_ENV !== 'production') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('shadow*" style props are deprecated. Use "boxShadow"')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <Drawer
            screenOptions={{
              headerShown: false,
              drawerStyle: {
                backgroundColor: theme.colors.background,
              },
              drawerActiveTintColor: theme.colors.primary,
              drawerInactiveTintColor: theme.colors.gray,
            }}
          >
            {/* Tab Screens */}
            <Drawer.Screen
              name="(tabs)"
              options={{
                title: 'Home',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="(tabs)/live"
              options={{
                title: 'Live Scores',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="radio" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="(tabs)/wishlist"
              options={{
                title: 'Wishlist',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="heart" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="(tabs)/explore"
              options={{
                title: 'Explore',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="compass" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="(tabs)/profile"
              options={{
                title: 'Profile',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
            {/* App Screens */}
            <Drawer.Screen
              name="(app)/cart"
              options={{
                title: 'Cart',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="cart" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="(app)/profile"
              options={{
                title: 'Profile (App)',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="person-circle" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="(app)/home"
              options={{
                title: 'Home (App)',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" size={size} color={color} />
                ),
              }}
            />
          </Drawer>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
}
