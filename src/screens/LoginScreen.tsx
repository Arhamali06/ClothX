import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";
import type { RootStackParamList } from '../types/navigation';


// ZOD VALIDATION SCHEMA
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [showPassword, setShowPassword] = useState(false);

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginFormData) => {

    console.log("Email:", data.email);
    console.log("Password:", data.password);
    navigation.replace('MainTabs');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Logo / Brand */}
        <View style={styles.brandContainer}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="shirt-outline"
              size={32}
              color={lightColors.white}
            />
          </View>
          <Text style={styles.brandName}>
            CLOTHX
          </Text>
        </View>


        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.title}>
            Welcome Back
          </Text>
          <Text style={styles.subtitle}>
            Login to continue shopping
          </Text>
        </View>

        {/* EMAIL */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Email
          </Text>
          <View
            style={[
              styles.inputWrapper,
              errors.email && styles.inputError,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={sizes.fontXl}
              color={lightColors.mutedText}
            />

            <Controller
              control={control}
              name="email"
              render={({
                field: {
                  onChange,
                  onBlur,
                  value,
                },
              }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={
                    lightColors.mutedText
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          {/* Email Error */}
          {errors.email && (
            <Text style={styles.errorText}>
              {errors.email.message}
            </Text>
          )}
        </View>


        {/* PASSWORD */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              errors.password && styles.inputError,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={sizes.fontXl}
              color={lightColors.mutedText}
            />
            <Controller
              control={control}
              name="password"
              render={({
                field: {
                  onChange,
                  onBlur,
                  value,
                },
              }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={
                    lightColors.mutedText
                  }
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
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={sizes.fontXl}
                color={lightColors.mutedText}
              />
            </Pressable>
          </View>

          {/* Password Error */}
          {errors.password && (
            <Text style={styles.errorText}>
              {errors.password.message}
            </Text>
          )}
        </View>


        {/* FORGOT PASSWORD */}
        <Pressable
          style={styles.forgotButton}
          onPress={() =>
            console.log("Forgot Password")
          }
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </Pressable>


        {/* LOGIN BUTTON */}
        <Pressable
          style={styles.loginButton}
          onPress={handleSubmit(handleLogin)}
        >
          <Text style={styles.loginButtonText}>
            LOGIN
          </Text>
          <Ionicons
            name="arrow-forward"
            size={sizes.fontLg}
            color={lightColors.white}
          />
        </Pressable>


        {/* SIGN UP */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>
          <Pressable
            onPress={() =>
              console.log("Sign Up")
            }
          >
            <Text style={styles.signupLink}>
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
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
    paddingHorizontal: sizes.lg,
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: sizes.xl,
  },
  logoCircle: {
    width: 64,
    height: 64,
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
    height: 52,
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
  },
  input: {
    flex: 1,
    marginLeft: sizes.sm,
    fontSize: sizes.fontMd,
    color: lightColors.text,
  },
  errorText: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    color: lightColors.danger,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: sizes.xs,
    marginBottom: sizes.lg,
  },
  forgotText: {
    fontSize: sizes.fontSm,
    fontWeight: "600",
    color: lightColors.primary,
  },
  loginButton: {
    height: 52,
    borderRadius: sizes.radiusMd,
    backgroundColor: lightColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.sm,
  },
  loginButtonText: {
    fontSize: sizes.fontMd,
    fontWeight: "700",
    color: lightColors.white,
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: sizes.lg,
  },
  signupText: {
    fontSize: sizes.fontSm,
    color: lightColors.mutedText,
  },
  signupLink: {
    marginLeft: sizes.xs,
    fontSize: sizes.fontSm,
    fontWeight: "700",
    color: lightColors.primary,
  },
});
