import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";
import { useFavorites, FavoriteItem } from "../context/FavoritesContext";

export default function FavoritesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const handleProductPress = (item: FavoriteItem) => {
    navigation.navigate("ProductDetails", {
      product: {
        id: String(item.id),
        name: item.title,
        category: item.category,
        price: `$${item.price}`,
        image: { uri: item.thumbnail },
      },
    });
  };

  const handleToggleFavorite = (item: FavoriteItem, e?: any) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    toggleFavorite(item);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons
          name="heart-outline"
          size={56}
          color={lightColors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Add products to your favorites and they will appear here.
      </Text>
      <Pressable
        style={styles.exploreButton}
        onPress={() => navigation.navigate("MainTabs")}
        accessibilityRole="button"
        accessibilityLabel="Explore Products"
      >
        <Text style={styles.exploreButtonText}>Explore Products</Text>
        <Ionicons
          name="arrow-forward"
          size={sizes.fontMd}
          color={lightColors.white}
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
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

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Favorites</Text>
          {favorites.length > 0 && (
            <Text style={styles.headerSubtitle}>
              {favorites.length} {favorites.length === 1 ? "item" : "items"}
            </Text>
          )}
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={favorites.length > 0 ? styles.productRow : undefined}
        contentContainerStyle={[
          styles.productList,
          favorites.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => {
          const favorite = isFavorite(item.id);

          return (
            <Pressable
              style={styles.productCard}
              onPress={() => handleProductPress(item)}
            >
              {/* Product Image */}
              <View style={styles.productImage}>
                {item.thumbnail ? (
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.productImageStyle}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name="image-outline"
                    size={40}
                    color={lightColors.mutedText}
                  />
                )}

                {/* Favorite Button */}
                <Pressable
                  style={styles.favoriteButton}
                  onPress={(e) => handleToggleFavorite(item, e)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    favorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Ionicons
                    name={favorite ? "heart" : "heart-outline"}
                    size={18}
                    color={favorite ? lightColors.danger : lightColors.text}
                  />
                </Pressable>
              </View>

              {/* Product Info */}
              <Text style={styles.productName} numberOfLines={1}>
                {item.title}
              </Text>

              <Text style={styles.productCategory}>{item.category}</Text>

              <Text style={styles.productPrice}>${item.price}</Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.background,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: sizes.lg,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleContainer: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: sizes.fontLg,
    fontWeight: "700",
    color: lightColors.text,
  },

  headerSubtitle: {
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
    marginTop: 2,
  },

  placeholder: {
    width: 42,
  },

  productList: {
    padding: sizes.lg,
    paddingBottom: sizes.xl,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  productRow: {
    justifyContent: "space-between",
    marginBottom: sizes.lg,
  },

  productCard: {
    width: "48%",
  },

  productImage: {
    height: 190,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  productImageStyle: {
    width: "100%",
    height: "100%",
  },

  favoriteButton: {
    position: "absolute",
    top: sizes.sm,
    right: sizes.sm,
    width: 32,
    height: 32,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  productName: {
    marginTop: sizes.sm,
    fontSize: sizes.fontMd,
    fontWeight: "700",
    color: lightColors.text,
  },

  productCategory: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
    textTransform: "capitalize",
  },

  productPrice: {
    marginTop: sizes.xs,
    fontSize: sizes.fontMd,
    fontWeight: "700",
    color: lightColors.primary,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: sizes.xl,
    paddingVertical: 48,
  },

  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: sizes.lg,
  },

  emptyTitle: {
    fontSize: sizes.fontXl,
    fontWeight: "800",
    color: lightColors.text,
    textAlign: "center",
    marginBottom: sizes.sm,
  },

  emptySubtitle: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
    marginBottom: sizes.xl,
  },

  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.xs,
    backgroundColor: lightColors.primary,
    paddingVertical: sizes.sm + 2,
    paddingHorizontal: sizes.lg,
    borderRadius: sizes.radiusMd,
  },

  exploreButtonText: {
    color: lightColors.white,
    fontWeight: "700",
    fontSize: sizes.fontSm,
  },
});
