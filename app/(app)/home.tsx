import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../components/CartContext';
import { getTheme } from '../../constants/theme';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Product, products } from '../../services/products';

export default function HomeScreen() {
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - theme.spacing.md * 3) / 2; // 2 columns, with spacing

  // Get unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products by search and selected category
  const filteredProducts = products.filter(
    (item) =>
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Animation
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [filteredProducts]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    errorText: {
      ...theme.typography.body,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
      color: theme.colors.secondary,
      ...theme.typography.body,
      fontWeight: '700' as const,
    },
    listContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    productCard: {
      width: cardWidth,
      backgroundColor: theme.colors.secondary,
      borderRadius: 18,
      marginBottom: theme.spacing.md,
      marginRight: theme.spacing.md,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
      alignSelf: 'flex-start',
    },
    imageContainer: {
      width: '100%',
      height: 110,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -10 }, { translateY: -10 }],
      zIndex: 1,
    },
    productImage: {
      width: '90%',
      height: 90,
      borderRadius: 12,
      resizeMode: 'contain',
    },
    productInfo: {
      padding: theme.spacing.sm,
    },
    productName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
      letterSpacing: 0.2,
    },
    productDescription: {
      fontSize: 11,
      color: theme.colors.gray,
      marginBottom: 2,
      minHeight: 28,
    },
    productPrice: {
      fontSize: 13,
      color: theme.colors.primary,
      fontWeight: '700',
      marginBottom: 2,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 4,
    },
    addButtonText: {
      color: theme.colors.secondary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    searchInput: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 24,
      padding: theme.spacing.sm,
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      borderWidth: 0,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    header: {
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
    },
    headerText: {
      ...theme.typography.h1,
      color: theme.colors.primary,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.gray,
      opacity: 0.08,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    categoryScroll: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
      marginBottom: theme.spacing.xs,
    },
    categoryButton: {
      paddingVertical: 18,
      paddingHorizontal: 38,
      borderRadius: 32,
      backgroundColor: theme.colors.secondary,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.gray,
      elevation: 0,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 80,
      opacity: 0.92,
      overflow: 'hidden',
    },
    categoryButtonActive: {
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 4,
      opacity: 1,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text,
      letterSpacing: 0.4,
      textAlign: 'center',
    },
    categoryButtonTextActive: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
      textShadowColor: 'rgba(0,0,0,0.12)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      textAlign: 'center',
    },
    headerGradient: {
      width: '100%',
      alignItems: 'center',
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginBottom: 0,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    productCardGradient: {
      borderRadius: 18,
      overflow: 'hidden',
    },
    appTitle: {
      color: '#fff',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
      letterSpacing: 1,
      marginBottom: 4,
    },
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <LinearGradient
        colors={[theme.colors.secondary, '#f0f4ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.productCardGradient}
      >
        <View style={styles.productCard}>
          <View style={styles.imageContainer}>
            {loadingImages[item.id] && (
              <ActivityIndicator 
                style={styles.loader} 
                color={theme.colors.primary} 
              />
            )}
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              onLoadStart={() => setLoadingImages(prev => ({ ...prev, [item.id]: true }))}
              onLoadEnd={() => setLoadingImages(prev => ({ ...prev, [item.id]: false }))}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.title}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, '#4f8cff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <Text style={styles.appTitle}>CricHub</Text>
        </View>
      </LinearGradient>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.gray}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={styles.divider} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                isActive && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              {isActive ? (
                <LinearGradient
                  colors={[theme.colors.primary, '#4f8cff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ ...StyleSheet.absoluteFillObject, borderRadius: 32 }}
                />
              ) : null}
              <Text
                style={[
                  styles.categoryButtonText,
                  isActive && styles.categoryButtonTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.divider} />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
} 