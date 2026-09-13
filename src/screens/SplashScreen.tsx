import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import sizes from '../constants/sizes';
import type { RootStackParamList } from '../types/navigation';
import { useTheme, type ThemeColors } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(colors);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(user ? 'MainTabs' : 'Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, user]);

  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={styles.logoCircle}>
        <Ionicons
          name="shirt-outline"
          size={45}
          color={colors.white}
        />
      </View>

      {/* App Name */}
      <Text style={styles.appName}>
        CLOTHX
      </Text>

      {/* Loader */}
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={styles.loader}
      />

    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    logoCircle: {
      width: 90,
      height: 90,
      borderRadius: sizes.radiusRound,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    appName: {
      marginTop: sizes.md,
      fontSize: sizes.fontXxl,
      fontWeight: '800',
      letterSpacing: 3,
      color: colors.text,
    },

    loader: {
      marginTop: sizes.md,
    },
  });
