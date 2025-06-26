import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../components/CartContext';
import { getTheme } from '../../constants/theme';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function CartScreen() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginTop: theme.spacing.lg,
    },
    emptySubtext: {
      ...theme.typography.body,
      color: theme.colors.gray,
      marginTop: theme.spacing.sm,
    },
    cartItem: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.lightGray,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.lightGray,
    },
    itemDetails: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    itemName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
    },
    itemPrice: {
      ...theme.typography.body,
      color: theme.colors.primary,
      marginTop: theme.spacing.xs,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    quantity: {
      ...theme.typography.body,
      marginHorizontal: theme.spacing.md,
      minWidth: 30,
      textAlign: 'center',
    },
    removeButton: {
      padding: theme.spacing.sm,
    },
    footer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.lightGray,
      backgroundColor: theme.colors.background,
    },
    priceDetails: {
      marginBottom: theme.spacing.md,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    priceLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    priceValue: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    totalRow: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.lightGray,
    },
    totalLabel: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    totalAmount: {
      ...theme.typography.h2,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    checkoutButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: theme.colors.secondary,
      ...theme.typography.body,
      fontWeight: 'bold',
    },
  });

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color={theme.colors.gray} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add some items to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => (
          <View key={item.product.id} style={styles.cartItem}>
            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.product.title}</Text>
              <Text style={styles.itemPrice}>₹{item.product.price.toFixed(2)}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                >
                  <Ionicons name="remove" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromCart(item.product.id)}
            >
              <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceDetails}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal:</Text>
            <Text style={styles.priceValue}>₹{totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping:</Text>
            <Text style={styles.priceValue}>Free</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>₹{totalPrice.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 