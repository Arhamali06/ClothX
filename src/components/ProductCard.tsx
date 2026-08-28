import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
};

type Props = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetails", {
          product: {
            id: String(product.id),
            name: product.title,
            category: product.category,
            price: `$${product.price}`,
            image: { uri: product.thumbnail },
          },
        })
      }
    >
      {/* ── Image Section ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite button */}
        <Pressable
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
          hitSlop={6}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={16}
            color={isFavorite ? lightColors.danger : lightColors.text}
          />
        </Pressable>
      </View>

      {/* ── Info Section ── */}
      <View style={styles.infoSection}>
        <Text numberOfLines={1} style={styles.productName}>
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${product.price}</Text>

          <Pressable
            style={styles.cartButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.title} to cart`}
          >
            <Ionicons name="cart-outline" size={13} color={lightColors.white} />
            <Text style={styles.cartButtonText}>Add</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: sizes.radiusLg,
    backgroundColor: lightColors.white,
    overflow: "hidden",
    shadowColor: "#1a1a1a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },

  /* ── Image ── */
  imageContainer: {
    height: 190,
    backgroundColor: lightColors.inputBg,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  favoriteButton: {
    position: "absolute",
    top: sizes.sm,
    right: sizes.sm,
    width: 34,
    height: 34,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  favoriteButtonActive: {
    backgroundColor: "#FFF0EF",
  },

  /* ── Info ── */
  infoSection: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: lightColors.white,
  },

  productName: {
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.text,
    marginBottom: 8,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  productPrice: {
    fontSize: sizes.fontMd,
    fontWeight: "800",
    color: lightColors.primary,
  },

  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.primary,
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  cartButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: lightColors.white,
    letterSpacing: 0.3,
  },
});
