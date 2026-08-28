import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';
import { useCart } from '../context/CartContext';

export default function BottomNav({ state, navigation }: BottomTabBarProps) {
  const { uniqueProductsCount } = useCart();

  const tabs = [
    {
      name: 'Home',
      label: 'Home',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
    },
    {
      name: 'Explore',
      label: 'Explore',
      icon: 'search-outline' as const,
      activeIcon: 'search' as const,
    },
    {
      name: 'Cart',
      label: 'Cart',
      icon: 'bag-outline' as const,
      activeIcon: 'bag' as const,
    },
    {
      name: 'Profile',
      label: 'Profile',
      icon: 'person-outline' as const,
      activeIcon: 'person' as const,
    },
  ];

  return (
    <View style={styles.container}>

      {tabs.map((tab) => {
        const isActive = state.routeNames[state.index] === tab.name;
        const isCart = tab.name === 'Cart';

        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={sizes.fontXl}
                color={
                  isActive
                    ? lightColors.primary
                    : lightColors.mutedText
                }
              />
              {isCart && uniqueProductsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{uniqueProductsCount}</Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: lightColors.cardBg,
    borderTopWidth: 1,
    borderTopColor: lightColors.border,
    paddingBottom: sizes.xs,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: lightColors.primary,
    borderRadius: sizes.radiusRound,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: lightColors.white,
    fontSize: 10,
    fontWeight: '700',
  },

  label: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    color: lightColors.mutedText,
  },

  activeLabel: {
    color: lightColors.primary,
    fontWeight: '700',
  },
});
