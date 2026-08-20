import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back
            </Text>

            <Text style={styles.userName}>
              Arham 👋
            </Text>
          </View>

          <Pressable style={styles.iconButton}>
            <Ionicons
              name="bag-outline"
              size={sizes.fontXl}
              color={lightColors.text}
            />
          </Pressable>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerSmallText}>
              NEW COLLECTION
            </Text>

            <Text style={styles.bannerTitle}>
              Find Your{'\n'}Perfect Style
            </Text>

            <Pressable style={styles.shopButton}>
              <Text style={styles.shopButtonText}>
                SHOP NOW
              </Text>

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
          <Text style={styles.sectionTitle}>
            Categories
          </Text>

          <Text style={styles.seeAll}>
            See All
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          <Pressable style={styles.categoryCard}>
            <Ionicons
              name="shirt-outline"
              size={28}
              color={lightColors.primary}
            />
            <Text style={styles.categoryText}>
              T-Shirts
            </Text>
          </Pressable>

          <Pressable style={styles.categoryCard}>
            <Ionicons
              name="layers-outline"
              size={28}
              color={lightColors.primary}
            />
            <Text style={styles.categoryText}>
              Jackets
            </Text>
          </Pressable>

          <Pressable style={styles.categoryCard}>
            <Ionicons
              name="walk-outline"
              size={28}
              color={lightColors.primary}
            />
            <Text style={styles.categoryText}>
              Jeans
            </Text>
          </Pressable>

          <Pressable style={styles.categoryCard}>
            <Ionicons
              name="footsteps-outline"
              size={28}
              color={lightColors.primary}
            />
            <Text style={styles.categoryText}>
              Shoes
            </Text>
          </Pressable>
        </ScrollView>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Featured Products
          </Text>

          <Text style={styles.seeAll}>
            See All
          </Text>
        </View>

        <View style={styles.productsContainer}>

          {/* Product 1 */}
          <Pressable style={styles.productCard}>
            <View style={styles.productImage}>
              <Ionicons
                name="shirt-outline"
                size={70}
                color={lightColors.primaryLight}
              />

              <View style={styles.favoriteButton}>
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color={lightColors.text}
                />
              </View>
            </View>

            <Text style={styles.productName}>
              Classic T-Shirt
            </Text>

            <Text style={styles.productCategory}>
              T-Shirt
            </Text>

            <Text style={styles.productPrice}>
              $25.00
            </Text>
          </Pressable>

          {/* Product 2 */}
          <Pressable style={styles.productCard}>
            <View style={styles.productImage}>
              <Ionicons
                name="shirt-outline"
                size={70}
                color={lightColors.secondary}
              />

              <View style={styles.favoriteButton}>
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color={lightColors.text}
                />
              </View>
            </View>

            <Text style={styles.productName}>
              Casual Jacket
            </Text>

            <Text style={styles.productCategory}>
              Jacket
            </Text>

            <Text style={styles.productPrice}>
              $55.00
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: sizes.md,
    marginBottom: sizes.lg,
  },

  welcomeText: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  userName: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXl,
    fontWeight: '700',
    color: lightColors.text,
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Banner
  banner: {
    minHeight: 190,
    borderRadius: sizes.radiusLg,
    backgroundColor: lightColors.primary,
    padding: sizes.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  bannerContent: {
    flex: 1,
  },

  bannerSmallText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    color: lightColors.primaryLight,
    letterSpacing: 1,
  },

  bannerTitle: {
    marginTop: sizes.sm,
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: lightColors.white,
    lineHeight: 28,
  },

  shopButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: sizes.md,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.text,
    gap: sizes.xs,
  },

  shopButtonText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    color: lightColors.white,
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: sizes.xl,
    marginBottom: sizes.md,
  },

  sectionTitle: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: lightColors.text,
  },

  seeAll: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: lightColors.primary,
  },

  // Categories
  categoryContainer: {
    gap: sizes.sm,
  },

  categoryCard: {
    width: 90,
    height: 90,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryText: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    fontWeight: '600',
    color: lightColors.text,
  },

  // Products
  productsContainer: {
    flexDirection: 'row',
    gap: sizes.md,
  },

  productCard: {
    flex: 1,
  },

  productImage: {
    height: 180,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
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