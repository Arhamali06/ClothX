import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
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

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";
import GoogleLogo from "../components/GoogleLogo";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

// ZOD VALIDATION SCHEMA
const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const heroExpandedHeight = 200 + insets.top;
  const heroCompactHeight = 65 + insets.top;

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const heroHeight = useRef(new Animated.Value(heroExpandedHeight)).current;
  const { setUser } = useAuth();

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

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setApiError("");

      const response = await loginUser(data.username, data.password);

      console.log("Login successful:", response);
      setUser(response);

      navigation.replace("MainTabs");
    } catch (error: any) {
      console.log("Login error:", error);

      setApiError(
        error?.response?.data?.message || "Invalid username or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={lightColors.primary} />
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
            {/* Decorative blobs */}
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />

            {isKeyboardOpen ? (
              <View style={styles.compactHeroRow}>
                <View style={styles.compactLogoWrapper}>
                  <Ionicons name="shirt-outline" size={20} color={lightColors.white} />
                </View>
                <Text style={styles.compactBrandName}>CLOTHX</Text>
              </View>
            ) : (
              <>
                {/* Logo */}
                <View style={styles.logoWrapper}>
                  <View style={styles.logoInner}>
                    <Ionicons name="shirt-outline" size={30} color={lightColors.white} />
                  </View>
                </View>

                <Text style={styles.brandName}>CLOTHX</Text>
                <Text style={styles.heroTagline}>Your style, delivered.</Text>
              </>
            )}
          </Animated.View>

          {/* ── Form Card ── */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue shopping</Text>

            {/* USERNAME */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.username && styles.inputError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={
                    errors.username ? lightColors.danger : lightColors.mutedText
                  }
                />
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your username"
                      placeholderTextColor={lightColors.mutedText}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                    />
                  )}
                />
              </View>
              {/* Email Error */}
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            {/* PASSWORD */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={
                    errors.password ? lightColors.danger : lightColors.mutedText
                  }
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={lightColors.mutedText}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                  )}
                />

                {/* Show / Hide Password */}
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={lightColors.mutedText}
                  />
                </Pressable>
              </View>

              {/* Password Error */}
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* FORGOT PASSWORD */}
            <Pressable
              style={styles.forgotButton}
              onPress={() => console.log("Forgot Password")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            {/* LOGIN BUTTON */}
            <Pressable
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleSubmit(handleLogin)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={lightColors.white} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={lightColors.white}
                  />
                </>
              )}
            </Pressable>

            {apiError !== "" && (
              <View style={styles.apiErrorBox}>
                <Ionicons name="alert-circle-outline" size={14} color={lightColors.danger} />
                <Text style={styles.apiErrorText}>{apiError}</Text>
              </View>
            )}

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* SOCIAL LOGIN BUTTONS */}
            <View style={styles.socialRow}>
              <Pressable
                style={styles.socialButton}
                onPress={() => console.log("Continue with Google")}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
              >
                <GoogleLogo size={sizes.fontLg} />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable
                style={styles.socialButton}
                onPress={() => console.log("Continue with Apple")}
                accessibilityRole="button"
                accessibilityLabel="Continue with Apple"
              >
                <Ionicons name="logo-apple" size={sizes.fontLg} color="#000000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>

            {/* SIGN UP */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <Pressable onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}> Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lightColors.background,
  },

  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: lightColors.background,
  },

  scrollContainerKeyboard: {
    paddingBottom: 40,
  },

  /* ── Hero ── */
  heroSection: {
    backgroundColor: lightColors.primary,
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
    color: lightColors.white,
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
    color: lightColors.white,
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
    backgroundColor: lightColors.background,
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
    color: lightColors.text,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
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
    color: lightColors.text,
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
    backgroundColor: lightColors.inputBg,
    borderWidth: 1.5,
    borderColor: "transparent",
  },

  inputError: {
    borderColor: lightColors.danger,
    backgroundColor: "#FFF5F5",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    fontSize: sizes.fontMd,
    color: lightColors.text,
  },

  eyeButton: {
    padding: sizes.xs,
  },

  errorText: {
    marginTop: 5,
    fontSize: sizes.fontXs,
    color: lightColors.danger,
  },

  /* ── Forgot ── */
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: sizes.lg,
  },

  forgotText: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.primary,
  },

  /* ── Login Button ── */
  loginButton: {
    height: 56,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.sm,
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    fontSize: sizes.fontMd,
    fontWeight: "800",
    color: lightColors.white,
    letterSpacing: 1.5,
  },

  /* ── API Error ── */
  apiErrorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: sizes.sm,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    backgroundColor: "#FFF0EF",
    borderRadius: sizes.radiusMd,
    borderLeftWidth: 3,
    borderLeftColor: lightColors.danger,
  },

  apiErrorText: {
    flex: 1,
    fontSize: sizes.fontXs,
    color: lightColors.danger,
  },

  /* ── Divider ── */
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: sizes.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: lightColors.border,
  },

  dividerText: {
    marginHorizontal: sizes.sm,
    fontSize: sizes.fontXs,
    fontWeight: "500",
    color: lightColors.mutedText,
    letterSpacing: 0.3,
  },

  /* ── Social ── */
  socialRow: {
    flexDirection: "row",
    gap: sizes.sm,
  },

  socialButton: {
    flex: 1,
    height: 52,
    borderRadius: sizes.radiusLg,
    backgroundColor: lightColors.white,
    borderWidth: 1.5,
    borderColor: lightColors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  socialButtonText: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.text,
  },

  /* ── Sign Up Link ── */
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: sizes.lg,
    paddingBottom: sizes.sm,
  },

  signupText: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  signupLink: {
    fontSize: sizes.fontSm,
    fontWeight: "800",
    color: lightColors.primary,
  },
});
