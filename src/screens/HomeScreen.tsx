import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigation";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function HomeScreen() {
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        BottomTabNavigationProp<BottomTabParamList>,
        NativeStackNavigationProp<RootStackParamList>
      >
    >();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Fetch products from API
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
          accessibilityRole="button"
          accessibilityLabel="Go to profile"
        >
          <Image
            source={{ uri: user?.image }}
            style={styles.profileImage}
          />
        </Pressable>

        <Text style={styles.appName}>CLOTHX</Text>

        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate("Favorites")}
          accessibilityRole="button"
          accessibilityLabel="Go to favorites"
        >
          <Ionicons
            name="heart-outline"
            size={sizes.fontXl}
            color={lightColors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerSmallText}>NEW COLLECTION</Text>

            <Text style={styles.bannerTitle}>Find Your{"\n"}Perfect Style</Text>

            <Pressable
              style={styles.shopButton}
              onPress={() => navigation.navigate("Explore")}
            >
              <Text style={styles.shopButtonText}>SHOP NOW</Text>

              <Ionicons
                name="arrow-forward"
                size={sizes.fontMd}
                color={lightColors.white}
              />
            </Pressable>
          </View>

          <Ionicons
            name="shirt-outline"
            size={100}
            color={lightColors.primaryLight}
          />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>

          <Text style={styles.selectedCategoryText}>{selectedCategory}</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={lightColors.primary}
            style={{ marginVertical: sizes.md }}
          />
        ) : isError ? (
          <View style={styles.center}>
            <Ionicons
              name="alert-circle-outline"
              size={50}
              color={lightColors.primary}
            />

            <Text style={styles.errorText}>Failed to load products</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryCard,
                    isActive && styles.categoryCardActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Products Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </Text>

          <Text style={styles.productCount}>
            {filteredProducts.length} items
          </Text>
        </View>

        {/* Products */}
        {isLoading ? (
          <View style={styles.productsLoading}>
            <ActivityIndicator size="large" color={lightColors.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Ionicons
              name="alert-circle-outline"
              size={50}
              color={lightColors.primary}
            />
            <Text style={styles.errorText}>Failed to load products</Text>
          </View>
        ) : (
          <View style={styles.productsContainer}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.background,
  },

  header: {
    flexDirection: "row",
    height: 70,
    paddingHorizontal: sizes.lg,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: lightColors.background,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },

  appName: {
    fontSize: sizes.fontXl,
    fontWeight: "800",
    letterSpacing: 3,
    color: lightColors.text,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    padding: sizes.lg,
    paddingBottom: sizes.xl,
  },

  banner: {
    minHeight: 190,
    borderRadius: sizes.radiusLg,
    backgroundColor: lightColors.primary,
    padding: sizes.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  bannerContent: {
    flex: 1,
  },

  bannerSmallText: {
    fontSize: sizes.fontXs,
    fontWeight: "700",
    color: lightColors.primaryLight,
    letterSpacing: 1,
  },

  bannerTitle: {
    marginTop: sizes.sm,
    fontSize: sizes.fontXl,
    fontWeight: "800",
    color: lightColors.white,
    lineHeight: 28,
  },

  shopButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: sizes.md,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.text,
    gap: sizes.xs,
  },

  shopButtonText: {
    fontSize: sizes.fontXs,
    fontWeight: "700",
    color: lightColors.white,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: sizes.xl,
    marginBottom: sizes.md,
  },

  sectionTitle: {
    fontSize: sizes.fontLg,
    fontWeight: "700",
    color: lightColors.text,
  },

  selectedCategoryText: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.primary,
  },

  productCount: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  categoryContainer: {
    gap: sizes.sm,
    paddingRight: sizes.lg,
  },

  categoryCard: {
    minWidth: 100,
    height: 60,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryCardActive: {
    backgroundColor: lightColors.primary,
    borderColor: lightColors.primary,
  },

  categoryText: {
    fontSize: sizes.fontXs,
    fontWeight: "600",
    color: lightColors.text,
    textTransform: "capitalize",
  },

  categoryTextActive: {
    color: lightColors.white,
  },

  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: sizes.lg,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.sm,
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: lightColors.primary,
    borderRadius: sizes.radiusRound,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: lightColors.white,
    fontSize: 10,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: lightColors.background,
  },

  loadingText: {
    marginTop: sizes.md,
    fontSize: sizes.fontMd,
    color: lightColors.text,
  },
  productsLoading: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    marginTop: sizes.md,
    fontSize: sizes.fontMd,
    color: lightColors.text,
  },
});
