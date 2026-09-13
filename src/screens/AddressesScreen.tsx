import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";
import { useTheme, type ThemeColors } from "../context/ThemeContext";

interface Address {
  id: string;
  tag: "Home" | "Work" | "Other";
  isDefault: boolean;
  name: string;
  phone: string;
  street: string;
  cityStateZip: string;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    tag: "Home",
    isDefault: true,
    name: "Emily Johnson",
    phone: "+1 (555) 234-5678",
    street: "742 Evergreen Terrace",
    cityStateZip: "Springfield, OR 97477",
  },
  {
    id: "2",
    tag: "Work",
    isDefault: false,
    name: "Emily Johnson (Office)",
    phone: "+1 (555) 987-6543",
    street: "100 Innovation Way, Suite 400",
    cityStateZip: "Portland, OR 97201",
  },
];

export default function AddressesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedId, setSelectedId] = useState<string>("1");
  const { colors } = useTheme();

  const handleSetDefault = (id: string) => {
    setSelectedId(id);
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
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

        <Text style={styles.headerTitle}>Delivery Addresses</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {addresses.map((address) => {
          const isSelected = selectedId === address.id;

          return (
            <Pressable
              key={address.id}
              style={[
                styles.addressCard,
                isSelected && styles.addressCardSelected,
              ]}
              onPress={() => handleSetDefault(address.id)}
            >
              {/* Header with Tag, Default badge, and Radio button */}
              <View style={styles.cardHeader}>
                <View style={styles.tagContainer}>
                  <View style={styles.tagBadge}>
                    <Ionicons
                      name={
                        address.tag === "Home"
                          ? "home-outline"
                          : address.tag === "Work"
                          ? "briefcase-outline"
                          : "location-outline"
                      }
                      size={14}
                      color={colors.primary}
                    />
                    <Text style={styles.tagText}>{address.tag}</Text>
                  </View>

                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>

                {/* Radio selection circle */}
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInnerCircle} />}
                </View>
              </View>

              {/* Address Details */}
              <Text style={styles.recipientName}>{address.name}</Text>
              <Text style={styles.phoneText}>{address.phone}</Text>
              <Text style={styles.addressText}>{address.street}</Text>
              <Text style={styles.addressText}>{address.cityStateZip}</Text>

              <View style={styles.divider} />

              {/* Card Actions */}
              <View style={styles.cardActionsRow}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleSetDefault(address.id)}
                >
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={colors.text}
                  />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleDeleteAddress(address.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={colors.danger}
                  />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: colors.danger },
                    ]}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          );
        })}

        {/* Add New Address Button */}
        <Pressable
          style={styles.addButton}
          accessibilityRole="button"
          accessibilityLabel="Add New Address"
        >
          <Ionicons
            name="add-circle-outline"
            size={sizes.fontLg}
            color={colors.white}
          />
          <Text style={styles.addButtonText}>ADD NEW ADDRESS</Text>
        </Pressable>
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

    contentContainer: {
      padding: sizes.lg,
      paddingBottom: sizes.xl,
      gap: sizes.md,
    },

    addressCard: {
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: sizes.md,
    },

    addressCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.cardBg,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: sizes.sm,
    },

    tagContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: sizes.xs + 2,
    },

    tagBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.inputBg,
      paddingVertical: 4,
      paddingHorizontal: sizes.sm,
      borderRadius: sizes.radiusSm,
    },

    tagText: {
      fontSize: sizes.fontXs,
      fontWeight: "700",
      color: colors.text,
    },

    defaultBadge: {
      backgroundColor: `${colors.secondary}22`,
      paddingVertical: 4,
      paddingHorizontal: sizes.sm,
      borderRadius: sizes.radiusSm,
    },

    defaultBadgeText: {
      fontSize: 10,
      fontWeight: "800",
      color: colors.secondary,
    },

    radioCircle: {
      width: 22,
      height: 22,
      borderRadius: sizes.radiusRound,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    radioCircleSelected: {
      borderColor: colors.primary,
    },

    radioInnerCircle: {
      width: 10,
      height: 10,
      borderRadius: sizes.radiusRound,
      backgroundColor: colors.primary,
    },

    recipientName: {
      fontSize: sizes.fontMd,
      fontWeight: "700",
      color: colors.text,
    },

    phoneText: {
      fontSize: sizes.fontSm,
      color: colors.mutedText,
      marginTop: 2,
      marginBottom: sizes.xs,
    },

    addressText: {
      fontSize: sizes.fontSm,
      color: colors.text,
      lineHeight: 20,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: sizes.sm,
    },

    cardActionsRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: sizes.md,
    },

    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: sizes.xs,
    },

    actionButtonText: {
      fontSize: sizes.fontSm,
      fontWeight: "600",
      color: colors.text,
    },

    addButton: {
      height: 52,
      marginTop: sizes.sm,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: sizes.sm,
    },

    addButtonText: {
      fontSize: sizes.fontSm,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: colors.white,
    },
  });
