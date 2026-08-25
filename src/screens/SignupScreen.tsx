import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";


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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="shirt-outline"
                size={32}
                color={lightColors.white}
              />
            </View>

            <Text style={styles.brandName}>CLOTHX</Text>
          </View>

          <View style={styles.headingContainer}>
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>
              Sign up to start shopping with ClothX
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>

            <View
              style={[styles.inputWrapper, errors.name && styles.inputError]}
            >
              <Ionicons
                name="person-outline"
                size={sizes.fontXl}
                color={errors.name ? lightColors.danger : lightColors.mutedText}
              />

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={lightColors.mutedText}
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>

            <View
              style={[styles.inputWrapper, errors.email && styles.inputError]}
            >
              <Ionicons
                name="mail-outline"
                size={sizes.fontXl}
                color={
                  errors.email ? lightColors.danger : lightColors.mutedText
                }
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={lightColors.mutedText}
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password && styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={sizes.fontXl}
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
                    placeholder="Create a password"
                    placeholderTextColor={lightColors.mutedText}
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
                  size={sizes.fontXl}
                  color={lightColors.mutedText}
                />
              </Pressable>
            </View>

            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>

            <View
              style={[
                styles.inputWrapper,
                errors.confirmPassword && styles.inputError,
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={sizes.fontXl}
                color={
                  errors.confirmPassword
                    ? lightColors.danger
                    : lightColors.mutedText
                }
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor={lightColors.mutedText}
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
                  size={sizes.fontXl}
                  color={lightColors.mutedText}
                />
              </Pressable>
            </View>


            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          <Pressable
            style={styles.signupButton}
            onPress={handleSubmit(handleSignup)}
          >
            <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>

            <Ionicons
              name="arrow-forward"
              size={sizes.fontLg}
              color={lightColors.white}
            />
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>

            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.background,
  },

  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.lg,
    justifyContent: "center",
  },

  brandContainer: {
    alignItems: "center",
    marginBottom: sizes.lg,
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: sizes.radiusRound,
    backgroundColor: lightColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: sizes.sm,
  },

  brandName: {
    fontSize: sizes.fontLg,
    fontWeight: "700",
    letterSpacing: 5,
    color: lightColors.text,
  },

  headingContainer: {
    marginBottom: sizes.lg,
  },

  title: {
    fontSize: sizes.fontXxl,
    fontWeight: "700",
    color: lightColors.text,
    marginBottom: sizes.xs,
  },

  subtitle: {
    fontSize: sizes.fontMd,
    color: lightColors.mutedText,
    lineHeight: 22,
  },

  inputContainer: {
    marginBottom: sizes.md,
  },

  label: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.text,
    marginBottom: sizes.xs,
  },

  inputWrapper: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sizes.md,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.inputBg,
    borderWidth: 1,
    borderColor: lightColors.border,
  },

  inputError: {
    borderColor: lightColors.danger,
    borderWidth: 1.5,
  },

  input: {
    flex: 1,
    marginLeft: sizes.sm,
    paddingVertical: 0,
    fontSize: sizes.fontMd,
    color: lightColors.text,
  },

  eyeButton: {
    marginLeft: sizes.sm,
    padding: sizes.xs,
  },

  errorText: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    color: lightColors.danger,
  },
  signupButton: {
    height: 54,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.sm,
    marginTop: sizes.sm,
  },

  signupButtonText: {
    fontSize: sizes.fontMd,
    fontWeight: "700",
    color: lightColors.white,
    letterSpacing: 1,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: sizes.lg,
    paddingBottom: sizes.sm,
  },

  loginText: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },

  loginLink: {
    marginLeft: sizes.xs,
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.primary,
  },
});
