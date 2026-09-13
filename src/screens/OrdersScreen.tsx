import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";
import { useOrders, Order } from "../context/OrdersContext";
import { useTheme, type ThemeColors } from "../context/ThemeContext";

export default function OrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orders } = useOrders();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const { colors } = useTheme();

  const filters = ["All", "Processing", "Delivered", "Cancelled"];

  const filteredOrders =
    selectedFilter === "All"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return colors.secondary;
      case "Processing":
      case "Shipped":
        return colors.accent;
      case "Cancelled":
        return colors.danger;
      default:
        return colors.mutedText;
    }
  };

  const styles = createStyles(colors);

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
            color={colors.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>My Orders</Text>

        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="receipt-outline"
                size={54}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any {selectedFilter.toLowerCase()} orders at the moment.
            </Text>
            <Pressable
              style={styles.shopNowButton}
              onPress={() => navigation.navigate("MainTabs")}
              accessibilityRole="button"
              accessibilityLabel="Start Shopping"
            >
              <Text style={styles.shopNowButtonText}>Start Shopping</Text>
              <Ionicons
                name="arrow-forward"
                size={sizes.fontMd}
                color={colors.white}
              />
            </Pressable>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const statusColor = getStatusColor(order.status);

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Top Row: Order # and Status */}
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderNumber}>
                      Order #{order.orderNumber}
                    </Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${statusColor}18` },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Items preview */}
                <View style={styles.itemsPreviewRow}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <View key={idx} style={styles.itemImageContainer}>
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.itemImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons
                          name="image-outline"
                          size={24}
                          color={colors.mutedText}
                        />
                      )}
                    </View>
                  ))}

                  {order.items.length > 3 && (
                    <View style={styles.moreItemsBadge}>
                      <Text style={styles.moreItemsText}>
                        +{order.items.length - 3}
                      </Text>
                    </View>
                  )}

                  <View style={styles.orderSummaryTextContainer}>
                    <Text style={styles.itemsCountText}>
                      {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                    </Text>
                    <Text style={styles.totalPriceText}>
                      ${order.totalPrice.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Actions */}
                <View style={styles.actionsRow}>
                  <Pressable style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </Pressable>

                  <Pressable style={styles.trackButton}>
                    <Text style={styles.trackButtonText}>Track Order</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: sizes.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: sizes.fontLg,
      fontWeight: "700",
      color: colors.text,
    },

    placeholder: {
      width: 42,
    },

    filterContainer: {
      paddingVertical: sizes.sm,
      backgroundColor: colors.background,
    },

    filterList: {
      paddingHorizontal: sizes.lg,
      gap: sizes.sm,
    },

    filterChip: {
      paddingVertical: sizes.xs + 2,
      paddingHorizontal: sizes.md,
      borderRadius: sizes.radiusRound,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
    },

    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    filterChipText: {
      fontSize: sizes.fontSm,
      fontWeight: "600",
      color: colors.mutedText,
    },

    filterChipTextActive: {
      color: colors.white,
    },

    contentContainer: {
      padding: sizes.lg,
      paddingBottom: sizes.xl,
      gap: sizes.md,
    },

    orderCard: {
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: sizes.md,
    },

    orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    orderNumber: {
      fontSize: sizes.fontMd,
      fontWeight: "700",
      color: colors.text,
    },

    orderDate: {
      fontSize: sizes.fontXs,
      color: colors.mutedText,
      marginTop: 2,
    },

    statusBadge: {
      paddingVertical: 4,
      paddingHorizontal: sizes.sm + 2,
      borderRadius: sizes.radiusRound,
    },

    statusText: {
      fontSize: sizes.fontXs,
      fontWeight: "700",
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: sizes.sm,
    },

    itemsPreviewRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: sizes.sm,
    },

    itemImageContainer: {
      width: 54,
      height: 54,
      borderRadius: sizes.radiusSm,
      backgroundColor: colors.inputBg,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },

    itemImage: {
      width: "100%",
      height: "100%",
    },

    moreItemsBadge: {
      width: 54,
      height: 54,
      borderRadius: sizes.radiusSm,
      backgroundColor: colors.inputBg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    moreItemsText: {
      fontSize: sizes.fontSm,
      fontWeight: "700",
      color: colors.primary,
    },

    orderSummaryTextContainer: {
      flex: 1,
      marginLeft: sizes.sm,
    },

    itemsCountText: {
      fontSize: sizes.fontSm,
      color: colors.mutedText,
    },

    totalPriceText: {
      fontSize: sizes.fontMd,
      fontWeight: "800",
      color: colors.primary,
      marginTop: 2,
    },

    actionsRow: {
      flexDirection: "row",
      gap: sizes.sm,
      marginTop: sizes.xs,
    },

    detailsButton: {
      flex: 1,
      height: 40,
      borderRadius: sizes.radiusSm,
      backgroundColor: colors.inputBg,
      alignItems: "center",
      justifyContent: "center",
    },

    detailsButtonText: {
      fontSize: sizes.fontSm,
      fontWeight: "600",
      color: colors.text,
    },

    trackButton: {
      flex: 1,
      height: 40,
      borderRadius: sizes.radiusSm,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    trackButtonText: {
      fontSize: sizes.fontSm,
      fontWeight: "700",
      color: colors.white,
    },

    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },

    emptyIconCircle: {
      width: 90,
      height: 90,
      borderRadius: sizes.radiusRound,
      backgroundColor: colors.inputBg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: sizes.md,
    },

    emptyTitle: {
      fontSize: sizes.fontLg,
      fontWeight: "800",
      color: colors.text,
      marginBottom: sizes.xs,
    },

    emptySubtitle: {
      fontSize: sizes.fontSm,
      color: colors.mutedText,
      textAlign: "center",
      maxWidth: 240,
      marginBottom: sizes.lg,
    },

    shopNowButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: sizes.xs,
      backgroundColor: colors.primary,
      paddingVertical: sizes.sm + 2,
      paddingHorizontal: sizes.lg,
      borderRadius: sizes.radiusMd,
    },

    shopNowButtonText: {
      fontSize: sizes.fontSm,
      fontWeight: "700",
      color: colors.white,
    },
  });
