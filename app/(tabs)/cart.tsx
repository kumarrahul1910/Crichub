import { useCart } from '@/components/CartContext';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const paymentMethods = ['Credit Card', 'Cash on Delivery'];

export default function CartTabScreen() {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('');
  const [error, setError] = useState('');

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === 'SAVE10') {
      setDiscount(0.1);
      Alert.alert('Promo Applied', '10% discount applied!');
    } else {
      setDiscount(0);
      Alert.alert('Invalid Promo', 'This promo code is not valid.');
    }
  };

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handleConfirmOrder = () => {
    if (!address.trim() || !payment) {
      setError('Please enter your address and select a payment method.');
      return;
    }
    setShowModal(false);
    setShowThankYou(true);
    clearCart();
    setPromo('');
    setDiscount(0);
    setAddress('');
    setPayment('');
    setError('');
    setTimeout(() => setShowThankYou(false), 2000);
  };

  const discountedTotal = totalPrice * (1 - discount);

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Your Cart</ThemedText>
      {items.length === 0 ? (
        <ThemedText style={styles.emptyText}>Your cart is empty.</ThemedText>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.product.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.product.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <ThemedText type="defaultSemiBold">{item.product.title}</ThemedText>
                  <ThemedText style={styles.price}>₹{item.product.price.toFixed(2)}</ThemedText>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity - 1)} style={styles.qtyButton}>
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity + 1)} style={styles.qtyButton}>
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.removeButton}>
                  <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ flexGrow: 0 }}
          />
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Promo code"
              value={promo}
              onChangeText={setPromo}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.promoButton} onPress={handleApplyPromo}>
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.summary}>
            <ThemedText style={styles.totalText}>Total: ₹{totalPrice.toFixed(2)}</ThemedText>
            {discount > 0 && (
              <ThemedText style={styles.discountText}>Discount: -₹{(totalPrice * discount).toFixed(2)} (10%)</ThemedText>
            )}
            <ThemedText style={styles.finalText}>Final: ₹{discountedTotal.toFixed(2)}</ThemedText>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Checkout Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>Order Summary</ThemedText>
            <FlatList
              data={items}
              keyExtractor={item => item.product.id.toString()}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ flex: 1 }}>{item.product.title} x{item.quantity}</Text>
                  <Text>₹{(item.product.price * item.quantity).toFixed(2)}</Text>
                </View>
              )}
              style={{ maxHeight: 100, width: '100%' }}
            />
            <TextInput
              style={styles.addressInput}
              placeholder="Shipping address"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <View style={{ width: '100%', marginTop: 10 }}>
              <ThemedText style={{ marginBottom: 6 }}>Payment Method:</ThemedText>
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method}
                  style={[styles.paymentOption, payment === method && styles.paymentOptionSelected]}
                  onPress={() => setPayment(method)}
                >
                  <Text style={{ color: payment === method ? '#fff' : '#007AFF', fontWeight: 'bold' }}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText style={{ marginTop: 10 }}>Total: ₹{totalPrice.toFixed(2)}</ThemedText>
            {discount > 0 && <ThemedText>Discount: -₹{(totalPrice * discount).toFixed(2)}</ThemedText>}
            <ThemedText style={{ fontWeight: 'bold', marginBottom: 10 }}>Final: ₹{discountedTotal.toFixed(2)}</ThemedText>
            {error ? <Text style={{ color: '#FF3B30', marginBottom: 8 }}>{error}</Text> : null}
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
              <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setShowModal(false); setError(''); }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Thank You Modal */}
      <Modal visible={showThankYou} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>Thank You!</ThemedText>
            <ThemedText>Your order has been placed successfully.</ThemedText>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyButton: {
    backgroundColor: '#e6f0ff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginHorizontal: 6,
  },
  qtyButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 10,
    padding: 4,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 8,
  },
  promoButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  summary: {
    marginTop: 24,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  discountText: {
    fontSize: 16,
    color: '#34C759',
    marginBottom: 8,
  },
  finalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    elevation: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    minHeight: 40,
    backgroundColor: '#f8f9fa',
  },
  paymentOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
}); 