import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { lightColors } from "../constants/colors";
import sizes from "../constants/sizes";

type LoginScreenProps = {
  onLogin: () => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    let valid = true;

    // Reset previous errors
    setEmailError("");
    setPasswordError("");

    // Email validation
    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email");
      valid = false;
    }

    // Password validation
    if (password.trim() === "") {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    }

    // Login only if everything is valid
    if (valid) {
      onLogin();
    }
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

          <Text style={styles.brandName}>CLOTHX</Text>
        </View>

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>Login to continue shopping</Text>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={sizes.fontXl}
              color={lightColors.mutedText}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={lightColors.mutedText}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {emailError !== "" && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={sizes.fontXl}
              color={lightColors.mutedText}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={lightColors.mutedText}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={!showPassword}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={sizes.fontXl}
                color={lightColors.mutedText}
              />
            </Pressable>
          </View>

          {passwordError !== "" && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
        </View>

        {/* Forgot Password */}
        <Pressable
          style={styles.forgotButton}
          onPress={() => console.log("Forgot Password")}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>

        {/* Login Button */}
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>

          <Ionicons
            name="arrow-forward"
            size={sizes.fontLg}
            color={lightColors.white}
          />
        </Pressable>

        {/* Sign Up */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>

          <Pressable onPress={() => console.log("Sign Up")}>
            <Text style={styles.signupLink}>Sign Up</Text>
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
