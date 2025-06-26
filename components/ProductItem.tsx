import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../services/products';
import { useCart } from './CartContext';

interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        {product.rating && (
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {product.rating.rate} ({product.rating.count})
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddToCart}
      >
        <Ionicons name="cart-outline" size={20} color="white" />
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  info: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
}); 