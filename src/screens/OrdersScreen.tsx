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

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";
import { useOrders, Order } from "../context/OrdersContext";

export default function OrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orders } = useOrders();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filters = ["All", "Processing", "Delivered", "Cancelled"];

  const filteredOrders =
    selectedFilter === "All"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return lightColors.secondary;
      case "Processing":
      case "Shipped":
        return lightColors.accent;
      case "Cancelled":
        return lightColors.danger;
      default:
        return lightColors.mutedText;
    }
  };

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
                color={lightColors.primary}
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
                color={lightColors.white}
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
                          color={lightColors.mutedText}
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

  headerTitle: {
    fontSize: sizes.fontLg,
    fontWeight: "700",
    color: lightColors.text,
  },

  placeholder: {
    width: 42,
  },

  filterContainer: {
    paddingVertical: sizes.sm,
    backgroundColor: lightColors.background,
  },

  filterList: {
    paddingHorizontal: sizes.lg,
    gap: sizes.sm,
  },

  filterChip: {
    paddingVertical: sizes.xs + 2,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
  },

  filterChipActive: {
    backgroundColor: lightColors.primary,
    borderColor: lightColors.primary,
  },

  filterChipText: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.mutedText,
  },

  filterChipTextActive: {
    color: lightColors.white,
  },

  contentContainer: {
    padding: sizes.lg,
    paddingBottom: sizes.xl,
    gap: sizes.md,
  },

  orderCard: {
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
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
    color: lightColors.text,
  },

  orderDate: {
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
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
    backgroundColor: lightColors.border,
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
    backgroundColor: lightColors.inputBg,
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
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: lightColors.border,
  },

  moreItemsText: {
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.primary,
  },

  orderSummaryTextContainer: {
    flex: 1,
    marginLeft: sizes.sm,
  },

  itemsCountText: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  totalPriceText: {
    fontSize: sizes.fontMd,
    fontWeight: "800",
    color: lightColors.primary,
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
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },

  detailsButtonText: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.text,
  },

  trackButton: {
    flex: 1,
    height: 40,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  trackButtonText: {
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.white,
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
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: sizes.md,
  },

  emptyTitle: {
    fontSize: sizes.fontLg,
    fontWeight: "800",
    color: lightColors.text,
    marginBottom: sizes.xs,
  },

  emptySubtitle: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
    textAlign: "center",
    maxWidth: 240,
    marginBottom: sizes.lg,
  },

  shopNowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.xs,
    backgroundColor: lightColors.primary,
    paddingVertical: sizes.sm + 2,
    paddingHorizontal: sizes.lg,
    borderRadius: sizes.radiusMd,
  },

  shopNowButtonText: {
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.white,
  },
});
