import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";

export default function SettingsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [orderTrackingAlerts, setOrderTrackingAlerts] = useState(true);

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

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Notifications Section */}
        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Text style={styles.rowSubtitle}>
                Receive alerts for discounts and new drops
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{
                false: lightColors.border,
                true: lightColors.primaryLight,
              }}
              thumbColor={
                pushNotifications ? lightColors.primary : lightColors.white
              }
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Order Tracking Alerts</Text>
              <Text style={styles.rowSubtitle}>
                Live updates when your package status changes
              </Text>
            </View>
            <Switch
              value={orderTrackingAlerts}
              onValueChange={setOrderTrackingAlerts}
              trackColor={{
                false: lightColors.border,
                true: lightColors.primaryLight,
              }}
              thumbColor={
                orderTrackingAlerts ? lightColors.primary : lightColors.white
              }
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Email Updates</Text>
              <Text style={styles.rowSubtitle}>
                Weekly newsletter and special promotion codes
              </Text>
            </View>
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{
                false: lightColors.border,
                true: lightColors.primaryLight,
              }}
              thumbColor={
                emailUpdates ? lightColors.primary : lightColors.white
              }
            />
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.card}>
          <Pressable style={styles.interactiveRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="globe-outline"
                size={20}
                color={lightColors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowSubtitle}>English (US)</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={lightColors.mutedText}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.interactiveRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={lightColors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Currency</Text>
              <Text style={styles.rowSubtitle}>USD ($)</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={lightColors.mutedText}
            />
          </Pressable>
        </View>

        {/* Security & Support Section */}
        <Text style={styles.sectionHeader}>Security & Support</Text>
        <View style={styles.card}>
          <Pressable style={styles.interactiveRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={lightColors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Privacy & Security</Text>
              <Text style={styles.rowSubtitle}>Manage security credentials</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={lightColors.mutedText}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.interactiveRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={lightColors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Help & Support</Text>
              <Text style={styles.rowSubtitle}>FAQs, customer support chat</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={lightColors.mutedText}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.interactiveRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={lightColors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Terms of Service</Text>
              <Text style={styles.rowSubtitle}>Legal agreements and policies</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={lightColors.mutedText}
            />
          </Pressable>
        </View>

        <Text style={styles.appVersionText}>ClothX App • Version 1.0.0 (Build 124)</Text>
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

  contentContainer: {
    padding: sizes.lg,
    paddingBottom: sizes.xl,
  },

  sectionHeader: {
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.mutedText,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: sizes.md,
    marginBottom: sizes.sm,
  },

  card: {
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    paddingHorizontal: sizes.md,
    marginBottom: sizes.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: sizes.md,
  },

  interactiveRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: sizes.md,
  },

  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: sizes.sm,
  },

  rowInfo: {
    flex: 1,
  },

  rowTitle: {
    fontSize: sizes.fontMd,
    fontWeight: "600",
    color: lightColors.text,
  },

  rowSubtitle: {
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: lightColors.border,
  },

  appVersionText: {
    textAlign: "center",
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
    marginTop: sizes.lg,
    marginBottom: sizes.xl,
  },
});
