import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Animated,
  PanResponder,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import { useCart, CartItem } from "../context/CartContext";
import { useOrders, Order } from "../context/OrdersContext";
import type {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigation";

const SWIPE_THRESHOLD = -75;

interface SwipeableCartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onPressProduct: (item: CartItem) => void;
}

function SwipeableCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onPressProduct,
}: SwipeableCartItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        if (isOpen) {
          newX = SWIPE_THRESHOLD + gestureState.dx;
        }
        if (newX > 0) {
          newX = 0;
        } else if (newX < SWIPE_THRESHOLD - 30) {
          newX = SWIPE_THRESHOLD - 30;
        }
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldOpen =
          (!isOpen && gestureState.dx < -35) ||
          (isOpen && gestureState.dx < 35);

        if (shouldOpen) {
          Animated.spring(translateX, {
            toValue: SWIPE_THRESHOLD,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
          setIsOpen(true);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
          setIsOpen(false);
        }
      },
    })
  ).current;

  const closeSwipe = () => {
    if (isOpen) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    Animated.timing(translateX, {
      toValue: -300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onRemove(item.id);
    });
  };

  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <View style={styles.swipeContainer}>
      {/* Hidden Delete Action Revealed on Swipe */}
      <View style={styles.hiddenActionContainer}>
        <Pressable
          style={styles.deleteActionButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.title} from cart`}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={lightColors.white}
          />
          <Text style={styles.deleteActionText}>Delete</Text>
        </Pressable>
      </View>

      {/* Foreground Cart Item Card */}
      <Animated.View
        style={[
          styles.cartItem,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable
          style={styles.cardPressable}
          onPress={() => {
            if (isOpen) {
              closeSwipe();
            } else {
              onPressProduct(item);
            }
          }}
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
                size={36}
                color={lightColors.mutedText}
              />
            )}
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.title}
            </Text>

            <Text style={styles.productCategory}>
              {item.category}
              {item.selectedSize ? ` • Size ${item.selectedSize}` : ""}
            </Text>

            <Text style={styles.productPrice}>${itemTotal}</Text>

            {/* Quantity */}
            <View style={styles.quantityContainer}>
              <Pressable
                style={[
                  styles.quantityButton,
                  item.quantity <= 1 && styles.quantityButtonDisabled,
                ]}
                onPress={() => {
                  if (item.quantity > 1) {
                    onUpdateQuantity(item.id, item.quantity - 1);
                  }
                }}
                disabled={item.quantity <= 1}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons
                  name="remove"
                  size={16}
                  color={
                    item.quantity <= 1
                      ? lightColors.mutedText
                      : lightColors.text
                  }
                />
              </Pressable>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <Pressable
                style={styles.quantityButton}
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <Ionicons
                  name="add"
                  size={16}
                  color={lightColors.text}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function CartScreen() {
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        BottomTabNavigationProp<BottomTabParamList>,
        NativeStackNavigationProp<RootStackParamList>
      >
    >();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    totalPrice,
    totalItemsCount,
    uniqueProductsCount,
  } = useCart();

  const { placeOrder } = useOrders();

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const handleProductPress = (item: CartItem) => {
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

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const newOrder = placeOrder(cartItems, totalPrice);
    clearCart();
    setPlacedOrder(newOrder);

    Animated.spring(toastAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  };

  const dismissToast = () => {
    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setPlacedOrder(null);
    });
  };

  const handleViewOrders = () => {
    dismissToast();
    navigation.navigate("Orders");
  };

  useEffect(() => {
    if (placedOrder) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [placedOrder]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Success Toast Banner */}
      {placedOrder && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.toastCard}>
            <View style={styles.toastLeft}>
              <View style={styles.toastIconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color={lightColors.secondary}
                />
              </View>

              <View style={styles.toastTextContainer}>
                <Text style={styles.toastTitle}>Order Placed Successfully!</Text>
                <Text style={styles.toastSubtitle}>
                  Order #{placedOrder.orderNumber} • ${placedOrder.totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.toastActions}>
              <Pressable
                style={styles.toastViewButton}
                onPress={handleViewOrders}
                accessibilityRole="button"
                accessibilityLabel="View in My Orders"
              >
                <Text style={styles.toastViewButtonText}>View</Text>
              </Pressable>

              <Pressable
                style={styles.toastCloseButton}
                onPress={dismissToast}
                accessibilityRole="button"
                accessibilityLabel="Dismiss message"
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={lightColors.mutedText}
                />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          cartItems.length === 0 && styles.emptyContainerStyle,
        ]}
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
            {uniqueProductsCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{uniqueProductsCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Cart Items or Empty State */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="bag-outline"
                size={56}
                color={lightColors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Looks like you haven't added anything to your cart yet. Explore our
              collection to find items you love!
            </Text>
            <Pressable
              style={styles.exploreButton}
              onPress={() => navigation.navigate("Explore")}
              accessibilityRole="button"
              accessibilityLabel="Start Shopping"
            >
              <Text style={styles.exploreButtonText}>START SHOPPING</Text>
              <Ionicons
                name="arrow-forward"
                size={sizes.fontMd}
                color={lightColors.white}
              />
            </Pressable>
          </View>
        ) : (
          <>
            {/* Cart Items List */}
            <View style={styles.cartList}>
              {cartItems.map((item) => (
                <SwipeableCartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onPressProduct={handleProductPress}
                />
              ))}
            </View>

            {/* Swipe hint */}
            <Text style={styles.swipeHintText}>
              Swipe left on any item to delete
            </Text>

            {/* Order Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Total Items ({totalItemsCount})
                </Text>
                <Text style={styles.summaryValue}>
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  ${shipping.toFixed(2)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <Pressable
              style={styles.checkoutButton}
              onPress={handleCheckout}
              accessibilityRole="button"
              accessibilityLabel="Proceed to Checkout"
            >
              <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
              <Ionicons
                name="arrow-forward"
                size={sizes.fontLg}
                color={lightColors.white}
              />
            </Pressable>
          </>
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

  toastContainer: {
    position: "absolute",
    top: 70,
    left: sizes.lg,
    right: sizes.lg,
    zIndex: 999,
    elevation: 8,
  },

  toastCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: lightColors.white,
    borderRadius: sizes.radiusMd,
    padding: sizes.md,
    borderWidth: 1,
    borderColor: `${lightColors.secondary}44`,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  toastLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  toastIconContainer: {
    marginRight: sizes.sm,
  },

  toastTextContainer: {
    flex: 1,
  },

  toastTitle: {
    fontSize: sizes.fontSm + 1,
    fontWeight: "700",
    color: lightColors.text,
  },

  toastSubtitle: {
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
    marginTop: 2,
  },

  toastActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.xs,
    marginLeft: sizes.sm,
  },

  toastViewButton: {
    backgroundColor: lightColors.primary,
    paddingVertical: sizes.xs + 1,
    paddingHorizontal: sizes.sm + 4,
    borderRadius: sizes.radiusSm,
  },

  toastViewButtonText: {
    color: lightColors.white,
    fontSize: sizes.fontXs,
    fontWeight: "700",
  },

  toastCloseButton: {
    padding: sizes.xs,
  },

  container: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
  },

  emptyContainerStyle: {
    flexGrow: 1,
  },

  // Header
  header: {
    paddingTop: sizes.md,
    marginBottom: sizes.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallTitle: {
    fontSize: sizes.fontXs,
    fontWeight: "700",
    letterSpacing: 1,
    color: lightColors.primary,
  },

  title: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXxl,
    fontWeight: "800",
    color: lightColors.text,
  },

  cartIcon: {
    width: 46,
    height: 46,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  headerBadge: {
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

  headerBadgeText: {
    color: lightColors.white,
    fontSize: 10,
    fontWeight: "700",
  },

  // Cart List
  cartList: {
    gap: sizes.md,
  },

  // Swipe Container & Item
  swipeContainer: {
    position: "relative",
    borderRadius: sizes.radiusMd,
    overflow: "hidden",
  },

  hiddenActionContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 75,
    backgroundColor: lightColors.danger,
    borderRadius: sizes.radiusMd,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteActionButton: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },

  deleteActionText: {
    color: lightColors.white,
    fontSize: sizes.fontXs,
    fontWeight: "700",
  },

  cartItem: {
    minHeight: 125,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
  },

  cardPressable: {
    flexDirection: "row",
    padding: sizes.sm,
    width: "100%",
  },

  productImage: {
    width: 105,
    height: 105,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImageStyle: {
    width: "100%",
    height: "100%",
  },

  productInfo: {
    flex: 1,
    marginLeft: sizes.md,
    paddingVertical: sizes.xs,
  },

  productName: {
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

  // Quantity
  quantityContainer: {
    marginTop: sizes.sm,
    flexDirection: "row",
    alignItems: "center",
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonDisabled: {
    opacity: 0.4,
  },

  quantity: {
    marginHorizontal: sizes.sm,
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.text,
  },

  swipeHintText: {
    textAlign: "center",
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
    marginTop: sizes.md,
    fontStyle: "italic",
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
    fontWeight: "700",
    color: lightColors.text,
  },

  summaryRow: {
    marginBottom: sizes.sm,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  summaryValue: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.text,
  },

  divider: {
    height: 1,
    marginVertical: sizes.sm,
    backgroundColor: lightColors.border,
  },

  totalLabel: {
    fontSize: sizes.fontMd,
    fontWeight: "700",
    color: lightColors.text,
  },

  totalValue: {
    fontSize: sizes.fontLg,
    fontWeight: "800",
    color: lightColors.primary,
  },

  // Checkout
  checkoutButton: {
    height: 52,
    marginTop: sizes.lg,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.sm,
  },

  checkoutText: {
    fontSize: sizes.fontSm,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: lightColors.white,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: sizes.xl,
    paddingVertical: 60,
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
    maxWidth: 280,
    marginBottom: sizes.xl,
  },

  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.xs,
    backgroundColor: lightColors.primary,
    paddingVertical: sizes.sm + 4,
    paddingHorizontal: sizes.lg,
    borderRadius: sizes.radiusMd,
  },

  exploreButtonText: {
    color: lightColors.white,
    fontWeight: "700",
    fontSize: sizes.fontSm,
  },
});
