import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";
import { useTheme, type ThemeColors } from "../context/ThemeContext";

// ZOD VALIDATION SCHEMA
const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;
type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const heroExpandedHeight = 200 + insets.top;
  const heroCompactHeight = 65 + insets.top;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const heroHeight = useRef(new Animated.Value(heroExpandedHeight)).current;
  const { colors } = useTheme();

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setIsKeyboardOpen(true);
      Animated.timing(heroHeight, {
        toValue: heroCompactHeight,
        duration: Platform.OS === "ios" ? e?.duration || 250 : 200,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      setIsKeyboardOpen(false);
      Animated.timing(heroHeight, {
        toValue: heroExpandedHeight,
        duration: Platform.OS === "ios" ? e?.duration || 250 : 200,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [heroHeight, heroExpandedHeight, heroCompactHeight]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignup = (data: SignupFormData) => {
    console.log("Name:", data.name);
    console.log("Email:", data.email);
    console.log("Password:", data.password);
    console.log("Confirm Password:", data.confirmPassword);
    navigation.replace("Login");
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            isKeyboardOpen && styles.scrollContainerKeyboard,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ── Hero Header ── */}
          <Animated.View
            style={[
              styles.heroSection,
              { height: heroHeight, paddingTop: insets.top },
            ]}
          >
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />

            {isKeyboardOpen ? (
              <View style={styles.compactHeroRow}>
                <View style={styles.compactLogoWrapper}>
                  <Ionicons name="shirt-outline" size={20} color={colors.white} />
                </View>
                <Text style={styles.compactBrandName}>CLOTHX</Text>
              </View>
            ) : (
              <>
                <View style={styles.logoWrapper}>
                  <View style={styles.logoInner}>
                    <Ionicons name="shirt-outline" size={30} color={colors.white} />
                  </View>
                </View>

                <Text style={styles.brandName}>CLOTHX</Text>
                <Text style={styles.heroTagline}>Join the style revolution.</Text>
              </>
            )}
          </Animated.View>

          {/* ── Form Card ── */}
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start shopping with ClothX</Text>

            {/* FULL NAME */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={errors.name ? colors.danger : colors.mutedText}
                />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.mutedText}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  )}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* EMAIL */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={errors.email ? colors.danger : colors.mutedText}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.mutedText}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* PASSWORD */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={errors.password ? colors.danger : colors.mutedText}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor={colors.mutedText}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={errors.confirmPassword ? colors.danger : colors.mutedText}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor={colors.mutedText}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* CREATE ACCOUNT BUTTON */}
            <Pressable
              style={styles.signupButton}
              onPress={handleSubmit(handleSignup)}
            >
              <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </Pressable>

            {/* LOGIN LINK */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}> Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContainer: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },

    scrollContainerKeyboard: {
      paddingBottom: 40,
    },

    /* ── Hero ── */
    heroSection: {
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      paddingBottom: sizes.md,
    },

    compactHeroRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingTop: sizes.xs,
    },

    compactLogoWrapper: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
    },

    compactBrandName: {
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 4,
      color: colors.white,
    },

    blobTopRight: {
      position: "absolute",
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: "rgba(255,255,255,0.10)",
      top: -40,
      right: -40,
    },

    blobBottomLeft: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.07)",
      bottom: 10,
      left: -30,
    },

    logoWrapper: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: "rgba(255,255,255,0.20)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: sizes.sm,
    },

    logoInner: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
    },

    brandName: {
      fontSize: 22,
      fontWeight: "800",
      letterSpacing: 6,
      color: colors.white,
      marginBottom: 4,
    },

    heroTagline: {
      fontSize: sizes.fontSm,
      color: "rgba(255,255,255,0.75)",
      letterSpacing: 0.5,
    },

    /* ── Card ── */
    card: {
      flex: 1,
      backgroundColor: colors.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: sizes.lg,
      paddingTop: sizes.xl,
      paddingBottom: sizes.lg,
      marginTop: -24,
    },

    title: {
      fontSize: sizes.fontXxl,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 4,
    },

    subtitle: {
      fontSize: sizes.fontSm,
      color: colors.mutedText,
      marginBottom: sizes.xl,
      lineHeight: 20,
    },

    /* ── Fields ── */
    fieldGroup: {
      marginBottom: sizes.md,
    },

    label: {
      fontSize: sizes.fontXs,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 6,
    },

    inputWrapper: {
      height: 54,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: sizes.md,
      borderRadius: sizes.radiusLg,
      backgroundColor: colors.inputBg,
      borderWidth: 1.5,
      borderColor: "transparent",
    },

    inputError: {
      borderColor: colors.danger,
      backgroundColor: colors.inputBg,
    },

    input: {
      flex: 1,
      marginLeft: 10,
      paddingVertical: 0,
      fontSize: sizes.fontMd,
      color: colors.text,
    },

    eyeButton: {
      padding: sizes.xs,
    },

    errorText: {
      marginTop: 5,
      fontSize: sizes.fontXs,
      color: colors.danger,
    },

    /* ── Signup Button ── */
    signupButton: {
      height: 56,
      borderRadius: sizes.radiusRound,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: sizes.sm,
      marginTop: sizes.sm,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },

    signupButtonText: {
      fontSize: sizes.fontMd,
      fontWeight: "800",
      color: colors.white,
      letterSpacing: 1.5,
    },

    /* ── Login Link ── */
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: sizes.lg,
      paddingBottom: sizes.sm,
    },

    loginText: {
      fontSize: sizes.fontSm,
      color: colors.mutedText,
    },

    loginLink: {
      fontSize: sizes.fontSm,
      fontWeight: "800",
      color: colors.primary,
    },
  });
