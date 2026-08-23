import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { lightColors } from '../constants/colors';
import sizes from '../constants/sizes';
import type { RootStackParamList } from '../types/navigation';

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={styles.logoCircle}>
        <Ionicons
          name="shirt-outline"
          size={45}
          color={lightColors.white}
        />
      </View>

      {/* App Name */}
      <Text style={styles.appName}>
        CLOTHX
      </Text>

      {/* Loader */}
      <ActivityIndicator
        size="small"
        color={lightColors.primary}
        style={styles.loader}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  appName: {
    marginTop: sizes.md,
    fontSize: sizes.fontXxl,
    fontWeight: '800',
    letterSpacing: 3,
    color: lightColors.text,
  },

  loader: {
    marginTop: sizes.md,
  },
});
