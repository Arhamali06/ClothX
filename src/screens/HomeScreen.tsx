import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { BottomTabParamList } from "../types/navigation";

type Category = "All" | "T-Shirts" | "Jackets" | "Jeans" | "Shoes";

const categories: {
  name: Category;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { name: "All", icon: "grid-outline" },
  { name: "T-Shirts", icon: "shirt-outline" },
  { name: "Jackets", icon: "layers-outline" },
  { name: "Jeans", icon: "walk-outline" },
  { name: "Shoes", icon: "footsteps-outline" },
];

const products = [
  {
    id: "1",
    name: "Classic T-Shirt",
    category: "T-Shirts",
    price: "$25.00",
    image: require("../assets/classic-tshirt.jpg"),
  },
  {
    id: "2",
    name: "Navy Blue T-Shirt",
    category: "T-Shirts",
    price: "$28.00",
    image: require("../assets/classic-navyblue-shirt.webp"),
  },
  {
    id: "3",
    name: "Oversized White Tee",
    category: "T-Shirts",
    price: "$30.00",
    image: require("../assets/oversized-white.webp"),
  },
  {
    id: "4",
    name: "Casual Jacket",
    category: "Jackets",
    price: "$55.00",
    image: require("../assets/casualjacket.jpg"),
  },
  {
    id: "5",
    name: "Denim Jacket",
    category: "Jackets",
    price: "$65.00",
    image: require("../assets/denimajcket.jpg"),
  },
  {
    id: "6",
    name: "Blue Jeans",
    category: "Jeans",
    price: "$48.00",
    image: require("../assets/bluejeans.jpg"),
  },
  {
    id: "7",
    name: "Slim Fit Trousers",
    category: "Jeans",
    price: "$42.00",
    image: require("../assets/slimfitrouser.jpg"),
  },
  {
    id: "8",
    name: "Everyday Sneakers",
    category: "Shoes",
    price: "$50.00",
    image: require("../assets/relaxedfirhoodie.jpg"),
  },
] as const;

export default function HomeScreen() {
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
          accessibilityRole="button"
          accessibilityLabel="Go to profile"
        >
          <Image
            source={require('../assets/profilepic.jpeg')}
            style={styles.profileImage}
          />
        </Pressable>
        <Text style={styles.appName}>CLOTHX</Text>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate("Cart")}
          accessibilityRole="button"
          accessibilityLabel="Go to cart"
        >
          <Ionicons
            name="bag-outline"
            size={sizes.fontXl}
            color={lightColors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerSmallText}>NEW COLLECTION</Text>
            <Text style={styles.bannerTitle}>Find Your{"\n"}Perfect Style</Text>
            <Pressable
              style={styles.shopButton}
              onPress={() => setSelectedCategory("All")}
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.selectedCategoryText}>{selectedCategory}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category.name;
            return (
              <Pressable
                key={category.name}
                style={[
                  styles.categoryCard,
                  isActive && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons
                  name={category.icon}
                  size={28}
                  color={isActive ? lightColors.white : lightColors.primary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </Text>
          <Text style={styles.productCount}>
            {filteredProducts.length} items
          </Text>
        </View>
        <View style={styles.productsContainer}>
          {filteredProducts.map((product) => (
            <Pressable key={product.id} style={styles.productCard}>
              <View style={styles.productImage}>
                <Image
                  source={product.image}
                  style={styles.productImageStyle}
                  resizeMode="cover"
                />
                <View style={styles.favoriteButton}>
                  <Ionicons
                    name="heart-outline"
                    size={18}
                    color={lightColors.text}
                  />
                </View>
              </View>
              <Text numberOfLines={1} style={styles.productName}>
                {product.name}
              </Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: lightColors.background },
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
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
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
  container: { padding: sizes.lg, paddingBottom: sizes.xl },
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
  bannerContent: { flex: 1 },
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
  productCount: { fontSize: sizes.fontSm, color: lightColors.mutedText },
  categoryContainer: { gap: sizes.sm, paddingRight: sizes.lg },
  categoryCard: {
    width: 90,
    height: 90,
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
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    fontWeight: "600",
    color: lightColors.text,
  },
  categoryTextActive: { color: lightColors.white },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: sizes.lg,
  },
  productCard: { width: "47%" },
  productImage: {
    height: 180,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.inputBg,
    position: "relative",
    overflow: "hidden",
  },
  productImageStyle: { width: "100%", height: "100%" },
  favoriteButton: {
    position: "absolute",
    top: sizes.sm,
    right: sizes.sm,
    width: 32,
    height: 32,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.white,
    justifyContent: "center",
    alignItems: "center",
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
  },
  productPrice: {
    marginTop: sizes.xs,
    fontSize: sizes.fontMd,
    fontWeight: "700",
    color: lightColors.primary,
  },
});
