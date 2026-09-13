import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useTheme, type ThemeColors } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";

export default function ExploreScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  // Fetch products from API
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: () => getProducts(searchQuery),
    placeholderData: keepPreviousData,
  });

  // Create categories from API products
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter products according to selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>FIND YOUR STYLE</Text>

          <Text style={styles.title}>Explore</Text>
        </View>

        <Pressable style={styles.filterButton}>
          <Ionicons
            name="options-outline"
            size={sizes.fontXl}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={sizes.fontLg}
          color={colors.mutedText}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />

        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery("")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={sizes.fontLg}
              color={colors.mutedText}
            />
          </Pressable>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Categories</Text>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Ionicons
              name="alert-circle-outline"
              size={50}
              color={colors.primary}
            />

            <Text style={styles.errorText}>Failed to load products</Text>
          </View>
        ) : (
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === item && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.activeCategoryText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>

      {/* Products */}
      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === "All" ? "All Products" : selectedCategory}
        </Text>

        <Text style={styles.productCount}>{filteredProducts.length} items</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color={colors.primary}
          />

          <Text style={styles.errorText}>Failed to load products</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No products found</Text>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: sizes.lg,
    },

    // Header
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: sizes.md,
      marginBottom: sizes.md,
    },

    smallTitle: {
      fontSize: sizes.fontXs,
      fontWeight: "700",
      letterSpacing: 1,
      color: colors.primary,
    },

    title: {
      marginTop: sizes.xs,
      fontSize: sizes.fontXxl,
      fontWeight: "800",
      color: colors.text,
    },

    filterButton: {
      width: 44,
      height: 44,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    // Search
    searchContainer: {
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: sizes.md,
      backgroundColor: colors.inputBg,
      borderRadius: sizes.radiusMd,
      borderWidth: 1,
      borderColor: colors.border,
    },

    searchInput: {
      flex: 1,
      marginHorizontal: sizes.sm,
      fontSize: sizes.fontMd,
      color: colors.text,
    },

    // Categories
    categorySection: {
      marginTop: sizes.lg,
    },

    sectionTitle: {
      fontSize: sizes.fontLg,
      fontWeight: "700",
      color: colors.text,
    },

    categoryList: {
      paddingVertical: sizes.md,
      gap: sizes.sm,
    },

    categoryButton: {
      paddingVertical: sizes.sm,
      paddingHorizontal: sizes.md,
      borderRadius: sizes.radiusRound,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
    },

    activeCategory: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    categoryText: {
      fontSize: sizes.fontSm,
      fontWeight: "600",
      color: colors.mutedText,
    },

    activeCategoryText: {
      color: colors.white,
    },

    // Products
    productsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: sizes.md,
    },

    productCount: {
      fontSize: sizes.fontSm,
      color: colors.mutedText,
    },

    productList: {
      paddingBottom: sizes.bottomNavInset,
    },

    productRow: {
      justifyContent: "space-between",
      marginBottom: sizes.lg,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    loadingText: {
      marginTop: sizes.md,
      fontSize: sizes.fontMd,
      color: colors.text,
    },

    errorText: {
      marginTop: sizes.md,
      fontSize: sizes.fontMd,
      color: colors.text,
    },

    noResultsText: {
      textAlign: "center",
      marginTop: sizes.xl,
      fontSize: sizes.fontMd,
      color: colors.mutedText,
    },
  });
