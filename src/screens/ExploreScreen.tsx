import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';

const products = [
  {
    id: '1',
    name: 'Classic Black T-Shirt',
    category: 'T-Shirts',
    price: '$25.00',
    icon: 'shirt-outline' as const,
  },
  {
    id: '2',
    name: 'Oversized White T-Shirt',
    category: 'T-Shirts',
    price: '$28.00',
    icon: 'shirt-outline' as const,
  },
  {
    id: '3',
    name: 'Casual Denim Jacket',
    category: 'Jackets',
    price: '$55.00',
    icon: 'shirt-outline' as const,
  },
  {
    id: '4',
    name: 'Classic Blue Jeans',
    category: 'Jeans',
    price: '$45.00',
    icon: 'layers-outline' as const,
  },
  {
    id: '5',
    name: 'Relaxed Fit Hoodie',
    category: 'Hoodies',
    price: '$40.00',
    icon: 'shirt-outline' as const,
  },
  {
    id: '6',
    name: 'Slim Fit Trousers',
    category: 'Trousers',
    price: '$42.00',
    icon: 'layers-outline' as const,
  },
];

const categories = [
  'All',
  'T-Shirts',
  'Jackets',
  'Jeans',
  'Hoodies',
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>
            FIND YOUR STYLE
          </Text>

          <Text style={styles.title}>
            Explore
          </Text>
        </View>

        <Pressable style={styles.filterButton}>
          <Ionicons
            name="options-outline"
            size={sizes.fontXl}
            color={lightColors.text}
          />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={sizes.fontLg}
          color={lightColors.mutedText}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={lightColors.mutedText}
        />

        <Pressable>
          <Ionicons
            name="mic-outline"
            size={sizes.fontLg}
            color={lightColors.mutedText}
          />
        </Pressable>
      </View>

      {/* Categories */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>
          Categories
        </Text>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.categoryButton,
                index === 0 && styles.activeCategory,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 && styles.activeCategoryText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Products */}
      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>
          All Products
        </Text>

        <Text style={styles.productCount}>
          {products.length} items
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <Pressable style={styles.productCard}>

            {/* Product Image Placeholder */}
            <View style={styles.productImage}>

              <Ionicons
                name={item.icon}
                size={65}
                color={lightColors.primaryLight}
              />

              {/* Favorite */}
              <Pressable style={styles.favoriteButton}>
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color={lightColors.text}
                />
              </Pressable>

            </View>

            {/* Product Info */}
            <Text
              style={styles.productName}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text style={styles.productCategory}>
              {item.category}
            </Text>

            <Text style={styles.productPrice}>
              {item.price}
            </Text>

          </Pressable>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.background,
    paddingHorizontal: sizes.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: sizes.md,
    marginBottom: sizes.md,
  },

  smallTitle: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    letterSpacing: 1,
    color: lightColors.primary,
  },

  title: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXxl,
    fontWeight: '800',
    color: lightColors.text,
  },

  filterButton: {
    width: 44,
    height: 44,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.md,
    backgroundColor: lightColors.inputBg,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: lightColors.border,
  },

  searchInput: {
    flex: 1,
    marginHorizontal: sizes.sm,
    fontSize: sizes.fontMd,
    color: lightColors.text,
  },

  // Categories
  categorySection: {
    marginTop: sizes.lg,
  },

  sectionTitle: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: lightColors.text,
  },

  categoryList: {
    paddingVertical: sizes.md,
    gap: sizes.sm,
  },

  categoryButton: {
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
  },

  activeCategory: {
    backgroundColor: lightColors.primary,
    borderColor: lightColors.primary,
  },

  categoryText: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: lightColors.mutedText,
  },

  activeCategoryText: {
    color: lightColors.white,
  },

  // Products
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sizes.md,
  },

  productCount: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  productList: {
    paddingBottom: sizes.xl,
  },

  productRow: {
    justifyContent: 'space-between',
    marginBottom: sizes.lg,
  },

  productCard: {
    width: '48%',
  },

  productImage: {
    height: 190,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  favoriteButton: {
    position: 'absolute',
    top: sizes.sm,
    right: sizes.sm,
    width: 32,
    height: 32,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productName: {
    marginTop: sizes.sm,
    fontSize: sizes.fontMd,
    fontWeight: '700',
    color: lightColors.text,
  },

  productCategory: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
  },

  productPrice: {
    marginTop: sizes.xs,
    fontSize: sizes.fontMd,
    fontWeight: '700',
    color: lightColors.primary,
  },
});