import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Switch,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import sizes from '../constants/sizes';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme, type ThemeColors } from '../context/ThemeContext';

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
  const { colors, isDark, toggleTheme } = useTheme();

  const styles = createStyles(colors);

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
              color={colors.text}
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

          <Pressable
            onPress={() => navigation.navigate('EditProfile')}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}
          >
            <Ionicons
              name="create-outline"
              size={sizes.fontXl}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {/* My Account Section */}
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
                  color={colors.primary}
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
                color={colors.mutedText}
              />
            </Pressable>
          ))}
        </View>

        {/* App Appearance Section */}
        <Text style={styles.sectionTitle}>
          App Appearance
        </Text>

        <View style={styles.appearanceCard}>
          <View style={styles.appearanceRow}>
            <View style={styles.appearanceIconBg}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={sizes.fontXl}
                color={colors.primary}
              />
            </View>

            <View style={styles.appearanceInfo}>
              <Text style={styles.appearanceTitle}>Dark Mode</Text>
              <Text style={styles.appearanceSubtitle}>
                Switch app theme
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: colors.border,
                true: colors.primaryLight,
              }}
              thumbColor={isDark ? colors.primary : colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Toggle dark mode"
            />
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Ionicons
            name="log-out-outline"
            size={sizes.fontLg}
            color={colors.danger}
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      paddingHorizontal: sizes.lg,
      paddingBottom: sizes.bottomNavInset,
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
      color: colors.text,
    },

    settingsButton: {
      width: 44,
      height: 44,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Profile
    profileCard: {
      padding: sizes.md,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },

    avatar: {
      width: 64,
      height: 64,
      borderRadius: sizes.radiusRound,
      backgroundColor: colors.primary,
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
      color: colors.text,
    },

    email: {
      marginTop: sizes.xs,
      fontSize: sizes.fontSm,
      color: colors.mutedText,
    },

    // Account
    sectionTitle: {
      marginTop: sizes.xl,
      marginBottom: sizes.md,
      fontSize: sizes.fontLg,
      fontWeight: '700',
      color: colors.text,
    },

    menuContainer: {
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },

    menuItem: {
      minHeight: 76,
      paddingHorizontal: sizes.md,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    menuIcon: {
      width: 42,
      height: 42,
      borderRadius: sizes.radiusSm,
      backgroundColor: colors.inputBg,
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
      color: colors.text,
    },

    menuSubtitle: {
      marginTop: sizes.xs,
      fontSize: sizes.fontXs,
      color: colors.mutedText,
    },

    // App Appearance card
    appearanceCard: {
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },

    appearanceRow: {
      minHeight: 76,
      paddingHorizontal: sizes.md,
      flexDirection: 'row',
      alignItems: 'center',
    },

    appearanceIconBg: {
      width: 42,
      height: 42,
      borderRadius: sizes.radiusSm,
      backgroundColor: colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
    },

    appearanceInfo: {
      flex: 1,
      marginLeft: sizes.md,
    },

    appearanceTitle: {
      fontSize: sizes.fontMd,
      fontWeight: '600',
      color: colors.text,
    },

    appearanceSubtitle: {
      marginTop: sizes.xs,
      fontSize: sizes.fontXs,
      color: colors.mutedText,
    },

    // Logout
    logoutButton: {
      height: 52,
      marginTop: sizes.lg,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sizes.sm,
    },

    logoutText: {
      fontSize: sizes.fontMd,
      fontWeight: '700',
      color: colors.danger,
    },

    version: {
      marginTop: sizes.lg,
      textAlign: 'center',
      fontSize: sizes.fontXs,
      color: colors.mutedText,
    },
  });
