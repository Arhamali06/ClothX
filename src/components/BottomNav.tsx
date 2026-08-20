import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';

type BottomNavProps = {
  activeScreen: string;
  onChangeScreen: (screen: string) => void;
};

export default function BottomNav({
  activeScreen,
  onChangeScreen,
}: BottomNavProps) {

  const tabs = [
    {
      name: 'home',
      label: 'Home',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
    },
    {
      name: 'explore',
      label: 'Explore',
      icon: 'search-outline' as const,
      activeIcon: 'search' as const,
    },
    {
      name: 'cart',
      label: 'Cart',
      icon: 'bag-outline' as const,
      activeIcon: 'bag' as const,
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: 'person-outline' as const,
      activeIcon: 'person' as const,
    },
  ];

  return (
    <View style={styles.container}>

      {tabs.map((tab) => {
        const isActive = activeScreen === tab.name;

        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => onChangeScreen(tab.name)}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={sizes.fontXl}
              color={
                isActive
                  ? lightColors.primary
                  : lightColors.mutedText
              }
            />

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