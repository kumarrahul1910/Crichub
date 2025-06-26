import { useCart } from '@/components/CartContext';
import { ThemedText } from '@/components/ThemedText';
import { useWishlist } from '@/components/WishlistContext';
import { products } from '@/services/products';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { addToCart } = useCart();
  const { category: selectedCategory = 'All' } = useLocalSearchParams<{ category?: string }>();
  const [search, setSearch] = useState('');
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>CricHub</ThemedText>
        <ThemedText style={styles.subtitle}>Cricket for life</ThemedText>
      </View>

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.productsGrid}>
        {filteredProducts.map((product) => {
          // Debug guards for product fields (log outside JSX)
          if (typeof product.title !== 'string') console.log('BAD TITLE', product.title);
          if (typeof product.price !== 'number') console.log('BAD PRICE', product.price);
          if (typeof product.description !== 'string') console.log('BAD DESC', product.description);
          return (
            <TouchableOpacity key={product.id} style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <TouchableOpacity
                style={styles.wishlistButton}
                onPress={() => {
                  if (isWishlisted(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
              >
                <Ionicons
                  name={isWishlisted(product.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isWishlisted(product.id) ? '#FF0000' : '#888'}
                />
              </TouchableOpacity>
              <View style={styles.productInfo}>
                <ThemedText type="defaultSemiBold" numberOfLines={2}>{String(product.title)}</ThemedText>
                <ThemedText style={styles.price}>₹{Number(product.price).toFixed(2)}</ThemedText>
                {product.rating && (
                  <View style={styles.rating}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <ThemedText style={styles.ratingText}>
                      {String(product.rating.rate)} ({String(product.rating.count)})
                    </ThemedText>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(product)}
                >
                  <ThemedText style={styles.addButtonText}>Add to Cart</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#A1CEDC',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  productsGrid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  wishlistButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 6,
  },
});
