import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useWishlist } from '@/components/WishlistContext';
import { getTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function WishlistScreen() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemContainer: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.lightGray,
      alignItems: 'center',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 16,
    },
    infoContainer: {
      flex: 1,
    },
    removeButton: {
      padding: 8,
    },
  });

  if (wishlist.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons name="heart-dislike-outline" size={64} color={theme.colors.gray} />
        <ThemedText type="title" style={{ marginTop: 40 }}>Your Wishlist is Empty</ThemedText>
        <ThemedText style={{ color: theme.colors.gray, marginTop: 8 }}>Add items you love to see them here.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={{ color: theme.colors.primary, marginTop: 4 }}>₹{item.price.toFixed(2)}</ThemedText>
            </View>
            <TouchableOpacity onPress={() => removeFromWishlist(item.id)} style={styles.removeButton}>
              <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
} 