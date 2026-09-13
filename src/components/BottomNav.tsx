import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import sizes from '../constants/sizes';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

// Adds alpha to a '#RRGGBB' hex color, e.g. withAlpha('#C65D4B', 0.12)
function withAlpha(hex: string, alpha: number) {
  if (!hex) return `rgba(0, 0, 0, ${alpha})`;
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type TabDef = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { name: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Explore', label: 'Explore', icon: 'search-outline', activeIcon: 'search' },
  { name: 'Cart', label: 'Cart', icon: 'bag-outline', activeIcon: 'bag' },
  { name: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export default function BottomNav({ state, navigation }: BottomTabBarProps) {
  const { uniqueProductsCount } = useCart();
  const { colors } = useTheme();

  const activeIndex = useMemo(() => {
    const currentRoute = state.routes[state.index]?.name;
    const index = TABS.findIndex((tab) => tab.name === currentRoute);
    return index >= 0 ? index : 0;
  }, [state.index, state.routes]);

  // Measured x-position/width of each tab, used to drive the sliding pill.
  const layouts = useRef<{ x: number; width: number }[]>([]);
  const pillX = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(0)).current;
  const [pillReady, setPillReady] = useState(false);

  const handleTabLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    layouts.current[index] = { x, width };

    if (index === activeIndex) {
      pillX.setValue(x);
      pillWidth.setValue(width);
      if (!pillReady) {
        setPillReady(true);
      }
    }
  };

  useEffect(() => {
    const target = layouts.current[activeIndex];
    if (!target) return;

    Animated.spring(pillX, {
      toValue: target.x,
      useNativeDriver: false,
      speed: 18,
      bounciness: 6,
    }).start();

    Animated.spring(pillWidth, {
      toValue: target.width,
      useNativeDriver: false,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [activeIndex]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          position: 'absolute',
          left: sizes.lg,
          right: sizes.lg,
          bottom: sizes.lg,
        },

        container: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: withAlpha(colors.cardBg, colors.cardBg === '#1C1C1E' ? 0.92 : 0.96),
          borderRadius: 32,
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: sizes.xs + 2,
          paddingHorizontal: sizes.xs + 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.16,
          shadowRadius: 20,
          elevation: 10,
        },

        pill: {
          position: 'absolute',
          top: sizes.xs + 2,
          bottom: sizes.xs + 2,
          backgroundColor: withAlpha(colors.primary, 0.12),
          borderRadius: sizes.radiusRound,
        },

        tab: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: sizes.sm,
          paddingHorizontal: sizes.xs,
          gap: sizes.xs,
          borderRadius: sizes.radiusRound,
        },

        iconWrapper: {
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        },

        badge: {
          position: 'absolute',
          top: -6,
          right: -10,
          backgroundColor: colors.primary,
          borderRadius: sizes.radiusRound,
          minWidth: 16,
          height: 16,
          paddingHorizontal: 3,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: colors.cardBg,
        },

        badgeText: {
          color: colors.white,
          fontSize: 9,
          fontWeight: '700',
        },

        label: {
          fontSize: sizes.fontXs,
          fontWeight: '700',
          color: colors.primary,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        {pillReady && (
          <Animated.View
            pointerEvents="none"
            style={[styles.pill, { left: pillX, width: pillWidth }]}
          />
        )}

        {TABS.map((tab, index) => {
          const isActive = index === activeIndex;
          const isCart = tab.name === 'Cart';

          return (
            <Pressable
              key={tab.name}
              style={styles.tab}
              onLayout={handleTabLayout(index)}
              onPress={() => navigation.navigate(tab.name)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={sizes.fontXl}
                  color={isActive ? colors.primary : colors.mutedText}
                />
                {isCart && uniqueProductsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{uniqueProductsCount}</Text>
                  </View>
                )}
              </View>

              {isActive && <Text style={styles.label}>{tab.label}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
