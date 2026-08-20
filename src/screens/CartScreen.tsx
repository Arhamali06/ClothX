import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';

const cartItems = [
  {
    id: '1',
    name: 'Classic Black T-Shirt',
    category: 'T-Shirts',
    price: 25,
    quantity: 1,
    image: require('../assets/classic-navyblue-shirt.webp'),
  },
  {
    id: '2',
    name: 'Casual Denim Jacket',
    category: 'Jackets',
    price: 55,
    quantity: 1,
    image: require('../assets/casualjacket.jpg'),
  },
];

export default function CartScreen() {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 5;
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>YOUR SHOPPING</Text>

            <Text style={styles.title}>Cart</Text>
          </View>

          <View style={styles.cartIcon}>
            <Ionicons
              name="bag-outline"
              size={sizes.fontXl}
              color={lightColors.primary}
            />
          </View>
        </View>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <View
            key={item.id}
            style={styles.cartItem}
          >
            {/* Product Image */}
            <View style={styles.productImage}>
              <Image
                source={item.image}
                style={styles.productImageStyle}
                resizeMode="cover"
              />
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
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
                ${item.price.toFixed(2)}
              </Text>

              {/* Quantity */}
              <View style={styles.quantityContainer}>
                <Pressable style={styles.quantityButton}>
                  <Ionicons
                    name="remove"
                    size={16}
                    color={lightColors.text}
                  />
                </Pressable>

                <Text style={styles.quantity}>
                  {item.quantity}
                </Text>

                <Pressable style={styles.quantityButton}>
                  <Ionicons
                    name="add"
                    size={16}
                    color={lightColors.text}
                  />
                </Pressable>
              </View>
            </View>

            {/* Delete */}
            <Pressable style={styles.deleteButton}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={lightColors.danger}
              />
            </Pressable>
          </View>
        ))}

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>
            Order Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal
            </Text>

            <Text style={styles.summaryValue}>
              ${subtotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Shipping
            </Text>

            <Text style={styles.summaryValue}>
              ${shipping.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Checkout Button */}
        <Pressable style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>
            PROCEED TO CHECKOUT
          </Text>

          <Ionicons
            name="arrow-forward"
            size={sizes.fontLg}
            color={lightColors.white}
          />
        </Pressable>
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
    paddingTop: sizes.md,
    marginBottom: sizes.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  cartIcon: {
    width: 46,
    height: 46,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cart Item
  cartItem: {
    minHeight: 125,
    marginBottom: sizes.md,
    padding: sizes.sm,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    flexDirection: 'row',
  },

  productImage: {
    width: 105,
    height: 105,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  productImageStyle: {
    width: '100%',
    height: '100%',
  },

  productInfo: {
    flex: 1,
    marginLeft: sizes.md,
    paddingVertical: sizes.xs,
  },

  productName: {
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

  // Quantity
  quantityContainer: {
    marginTop: sizes.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantity: {
    marginHorizontal: sizes.sm,
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: lightColors.text,
  },

  // Delete
  deleteButton: {
    padding: sizes.xs,
  },

  // Summary
  summary: {
    marginTop: sizes.lg,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
  },

  summaryTitle: {
    marginBottom: sizes.md,
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: lightColors.text,
  },

  summaryRow: {
    marginBottom: sizes.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  summaryValue: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: lightColors.text,
  },

  divider: {
    height: 1,
    marginVertical: sizes.sm,
    backgroundColor: lightColors.border,
  },

  totalLabel: {
    fontSize: sizes.fontMd,
    fontWeight: '700',
    color: lightColors.text,
  },

  totalValue: {
    fontSize: sizes.fontLg,
    fontWeight: '800',
    color: lightColors.primary,
  },

  // Checkout
  checkoutButton: {
    height: 52,
    marginTop: sizes.lg,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.sm,
  },

  checkoutText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: lightColors.white,
  },
});
