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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  {
    id: '1',
    title: 'My Orders',
    subtitle: 'View your order history',
    icon: 'bag-handle-outline' as const,
  },
  {
    id: '2',
    title: 'My Favorites',
    subtitle: 'View your favorite products',
    icon: 'heart-outline' as const,
  },
  {
    id: '3',
    title: 'Addresses',
    subtitle: 'Manage your delivery addresses',
    icon: 'location-outline' as const,
  },
  {
    id: '4',
    title: 'Settings',
    subtitle: 'Manage your account settings',
    icon: 'settings-outline' as const,
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const handleMenuPress = (item: (typeof menuItems)[0]) => {
    switch (item.id) {
      case '1':
        navigation.navigate('Orders');
        break;
      case '2':
        navigation.navigate('Favorites');
        break;
      case '3':
        navigation.navigate('Addresses');
        break;
      case '4':
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Profile
          </Text>

          <Pressable
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Ionicons
              name="settings-outline"
              size={sizes.fontXl}
              color={lightColors.text}
            />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: user?.image }}
              style={styles.avatarImage}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {user?.username}
            </Text>

            <Text style={styles.email}>
              {user?.email}
            </Text>
          </View>

          <Pressable>
            <Ionicons
              name="create-outline"
              size={sizes.fontXl}
              color={lightColors.primary}
            />
          </Pressable>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>
          My Account
        </Text>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon}
                  size={sizes.fontXl}
                  color={lightColors.primary}
                />
              </View>

              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>
                  {item.title}
                </Text>

                <Text style={styles.menuSubtitle}>
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={sizes.fontLg}
                color={lightColors.mutedText}
              />
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Ionicons
            name="log-out-outline"
            size={sizes.fontLg}
            color={lightColors.danger}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.version}>
          CLOTHX • Version 1.0.0
        </Text>
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

  title: {
    fontSize: sizes.fontXxl,
    fontWeight: '800',
    color: lightColors.text,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Profile
  profileCard: {
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  profileInfo: {
    flex: 1,
    marginLeft: sizes.md,
  },

  name: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: lightColors.text,
  },

  email: {
    marginTop: sizes.xs,
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  // Account
  sectionTitle: {
    marginTop: sizes.xl,
    marginBottom: sizes.md,
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: lightColors.text,
  },

  menuContainer: {
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    overflow: 'hidden',
  },

  menuItem: {
    minHeight: 76,
    paddingHorizontal: sizes.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: sizes.radiusSm,
    backgroundColor: lightColors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuInfo: {
    flex: 1,
    marginLeft: sizes.md,
  },

  menuTitle: {
    fontSize: sizes.fontMd,
    fontWeight: '600',
    color: lightColors.text,
  },

  menuSubtitle: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
  },

  // Logout
  logoutButton: {
    height: 52,
    marginTop: sizes.lg,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.cardBg,
    borderWidth: 1,
    borderColor: lightColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.sm,
  },

  logoutText: {
    fontSize: sizes.fontMd,
    fontWeight: '700',
    color: lightColors.danger,
  },

  version: {
    marginTop: sizes.lg,
    textAlign: 'center',
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
  },
});
