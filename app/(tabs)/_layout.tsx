import { useCart } from '@/components/CartContext';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function CartTabIcon({ color, size }: { color: string; size?: number }) {
  const { totalItems } = useCart();
  return (
    <View>
      <Ionicons name="cart" size={size ?? 28} color={color} />
      {totalItems > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -4,
            backgroundColor: '#007AFF',
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 3,
            zIndex: 1,
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{totalItems}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
          borderTopWidth: 0.5,
          borderTopColor: '#eee',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size ?? 28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <CartTabIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size }) => <Ionicons name="radio" size={size ?? 28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size ?? 28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size ?? 28} color={color} />,
        }}
      />
    </Tabs>
  );
}
