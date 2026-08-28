import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';
import type { RootStackParamList } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetails'>>();
  const { product } = route.params;

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const availableSizes = ['S', 'M', 'L', 'XL'];
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Fixed Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={sizes.fontXl}
            color={lightColors.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Product Details
        </Text>

        <Pressable
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product)}
          accessibilityRole="button"
          accessibilityLabel={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={sizes.fontXl}
            color={
              favorite
                ? lightColors.danger
                : lightColors.text
            }
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Information */}
        <View style={styles.productInfo}>

          <Text style={styles.category}>
            {product.category}
          </Text>

          <Text style={styles.productName}>
            {product.name}
          </Text>

          <Text style={styles.price}>
            {product.price}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              <Ionicons
                name="star"
                size={18}
                color={lightColors.accent}
              />

              <Ionicons
                name="star"
                size={18}
                color={lightColors.accent}
              />

              <Ionicons
                name="star"
                size={18}
                color={lightColors.accent}
              />

              <Ionicons
                name="star"
                size={18}
                color={lightColors.accent}
              />

              <Ionicons
                name="star-half"
                size={18}
                color={lightColors.accent}
              />
            </View>

            <Text style={styles.ratingText}>
              4.5 (120 Reviews)
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            A comfortable and stylish piece made for everyday
            wear. This product features a clean design and a
            comfortable fit, making it perfect for casual outfits.
          </Text>

          {/* Size */}
          <Text style={styles.sectionTitle}>
            Select Size
          </Text>

          <View style={styles.sizeContainer}>
            {availableSizes.map((size) => (
              <Pressable
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeButtonActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextActive,
                  ]}
                >
                  {size}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Add To Cart */}
          <Pressable
            style={styles.cartButton}
            onPress={handleAddToCart}
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
          >
            <Ionicons
              name="bag-add-outline"
              size={sizes.fontLg}
              color={lightColors.white}
            />

            <Text style={styles.cartButtonText}>
              ADD TO CART
            </Text>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.background,
  },

  container: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
  },

  // Header
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.lg,
  },

  headerTitle: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: lightColors.text,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  favoriteButton: {
    width: 42,
    height: 42,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Image
  imageContainer: {
    height: 380,
    marginTop: sizes.sm,
    borderRadius: sizes.radiusLg,
    backgroundColor: lightColors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow:"hidden",
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  // Information
  productInfo: {
    marginTop: sizes.lg,
  },

  category: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: lightColors.primary,
  },

  productName: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXxl,
    fontWeight: '800',
    color: lightColors.text,
  },

  price: {
    marginTop: sizes.sm,
    fontSize: sizes.fontXxl,
    fontWeight: '800',
    color: lightColors.primary,
  },

  // Rating
  ratingRow: {
    marginTop: sizes.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  stars: {
    flexDirection: 'row',
  },

  ratingText: {
    marginLeft: sizes.sm,
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  // Description
  sectionTitle: {
    marginTop: sizes.xl,
    marginBottom: sizes.sm,
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: lightColors.text,
  },

  description: {
    fontSize: sizes.fontSm,
    lineHeight: 22,
    color: lightColors.mutedText,
  },

  // Size
  sizeContainer: {
    flexDirection: 'row',
    gap: sizes.sm,
  },

  sizeButton: {
    width: 48,
    height: 42,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sizeButtonActive: {
    backgroundColor: lightColors.primary,
    borderColor: lightColors.primary,
  },

  sizeText: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: lightColors.text,
  },

  sizeTextActive: {
    color: lightColors.white,
    fontWeight: '700',
  },

  // Cart
  cartButton: {
    height: 54,
    marginTop: sizes.xl,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.sm,
  },

  cartButtonText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: lightColors.white,
  },
});
