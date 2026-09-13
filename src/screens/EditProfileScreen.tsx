import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import { useTheme, type ThemeColors } from "../context/ThemeContext";
import sizes from "../constants/sizes";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
  const { user, updateUser } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [image, setImage] = useState(user?.image ?? "");

  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  // Take a photo with the system camera
  const takePhoto = async () => {
    setIsPhotoModalVisible(false);

    const permission = await Camera.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera permission needed",
        "Allow ClothX to use your camera in Settings to take a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Choose a photo from the gallery
  const chooseFromGallery = async () => {
    setIsPhotoModalVisible(false);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Gallery permission needed",
        "Allow ClothX to access your photos in Settings to choose a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Remove current photo
  const removePhoto = () => {
    setIsPhotoModalVisible(false);
    setImage("");
  };

  // Save profile changes
  const saveProfile = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Missing details", "Name and email are required.");
      return;
    }

    updateUser({
      username: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      image,
    });
    navigation.goBack();
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="arrow-back"
              size={sizes.fontXl}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <Pressable
            style={styles.saveHeaderButton}
            onPress={saveProfile}
            accessibilityRole="button"
            accessibilityLabel="Save profile"
          >
            <Text style={styles.saveHeaderText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons
                    name="person"
                    size={48}
                    color={colors.cardBg}
                  />
                </View>
              )}

              {/* Camera Badge Button */}
              <Pressable
                style={styles.cameraBadge}
                onPress={() => setIsPhotoModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Change profile picture"
              >
                <Ionicons
                  name="camera"
                  size={sizes.fontMd}
                  color={colors.white}
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.changePhotoButton}
              onPress={() => setIsPhotoModalVisible(true)}
            >
              <Ionicons
                name="camera-outline"
                size={sizes.fontMd}
                color={colors.primary}
              />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View style={styles.formCard}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={sizes.fontLg}
                  color={colors.mutedText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.mutedText}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Email <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={sizes.fontLg}
                  color={colors.mutedText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  placeholderTextColor={colors.mutedText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Phone Number (Optional) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Phone number</Text>
                <Text style={styles.optionalBadge}>Optional</Text>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={sizes.fontLg}
                  color={colors.mutedText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+92 000 0000000"
                  placeholderTextColor={colors.mutedText}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Action Button */}
          <Pressable
            style={styles.saveButton}
            onPress={saveProfile}
            accessibilityRole="button"
            accessibilityLabel="Save Changes"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={sizes.fontXl}
              color={colors.white}
            />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
        </ScrollView>

        {/* Photo Selection Modal / Bottom Sheet */}
        <Modal
          visible={isPhotoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsPhotoModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsPhotoModalVisible(false)}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Change Profile Photo</Text>
              <Text style={styles.modalSubtitle}>
                Take a new picture or choose one from your device library
              </Text>

              {/* Take Photo Option */}
              <Pressable
                style={styles.modalOption}
                onPress={takePhoto}
                accessibilityRole="button"
                accessibilityLabel="Take Photo with Camera"
              >
                <View style={styles.modalOptionIconContainer}>
                  <Ionicons
                    name="camera"
                    size={sizes.fontXl}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.modalOptionTextContainer}>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionSubtitle}>
                    Use camera to capture a new photo
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={sizes.fontMd}
                  color={colors.mutedText}
                />
              </Pressable>

              {/* Choose from Library Option */}
              <Pressable
                style={styles.modalOption}
                onPress={chooseFromGallery}
                accessibilityRole="button"
                accessibilityLabel="Choose from Gallery"
              >
                <View style={styles.modalOptionIconContainer}>
                  <Ionicons
                    name="images"
                    size={sizes.fontXl}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.modalOptionTextContainer}>
                  <Text style={styles.modalOptionTitle}>
                    Choose from Gallery
                  </Text>
                  <Text style={styles.modalOptionSubtitle}>
                    Select an existing picture from library
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={sizes.fontMd}
                  color={colors.mutedText}
                />
              </Pressable>

              {/* Remove Photo Option */}
              {!!image && (
                <Pressable
                  style={styles.modalOption}
                  onPress={removePhoto}
                  accessibilityRole="button"
                  accessibilityLabel="Remove Current Photo"
                >
                  <View
                    style={[
                      styles.modalOptionIconContainer,
                      { backgroundColor: `${colors.danger}18` },
                    ]}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={sizes.fontXl}
                      color={colors.danger}
                    />
                  </View>
                  <View style={styles.modalOptionTextContainer}>
                    <Text
                      style={[
                        styles.modalOptionTitle,
                        { color: colors.danger },
                      ]}
                    >
                      Remove Photo
                    </Text>
                    <Text style={styles.modalOptionSubtitle}>
                      Reset to default avatar
                    </Text>
                  </View>
                </Pressable>
              )}

              {/* Cancel Button */}
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setIsPhotoModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header
    header: {
      paddingHorizontal: sizes.lg,
      paddingTop: sizes.md,
      paddingBottom: sizes.sm,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: sizes.fontXl,
      fontWeight: "700",
      color: colors.text,
    },

    saveHeaderButton: {
      paddingHorizontal: sizes.md,
      paddingVertical: sizes.sm,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 44,
      alignItems: "center",
      justifyContent: "center",
    },

    saveHeaderText: {
      fontSize: sizes.fontMd,
      fontWeight: "700",
      color: colors.primary,
    },

    container: {
      paddingHorizontal: sizes.lg,
      paddingTop: sizes.md,
      paddingBottom: sizes.xl,
    },

    // Avatar Section
    avatarSection: {
      alignItems: "center",
      marginBottom: sizes.lg,
    },

    avatarWrapper: {
      position: "relative",
      width: 110,
      height: 110,
      borderRadius: 55,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },

    avatarImage: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: colors.border,
    },

    avatarPlaceholder: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    cameraBadge: {
      position: "absolute",
      right: 0,
      bottom: 2,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      borderWidth: 3,
      borderColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
    },

    changePhotoButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: sizes.xs,
      marginTop: sizes.sm,
      paddingVertical: sizes.xs,
      paddingHorizontal: sizes.sm,
    },

    changePhotoText: {
      fontSize: sizes.fontSm,
      fontWeight: "600",
      color: colors.primary,
    },

    // Form Card
    formCard: {
      backgroundColor: colors.cardBg,
      borderRadius: sizes.radiusLg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: sizes.md,
      gap: sizes.md,
    },

    inputGroup: {
      gap: sizes.xs,
    },

    labelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    inputLabel: {
      fontSize: sizes.fontSm,
      fontWeight: "600",
      color: colors.text,
    },

    requiredStar: {
      color: colors.danger,
      fontWeight: "700",
    },

    optionalBadge: {
      fontSize: sizes.fontXs,
      color: colors.mutedText,
      backgroundColor: colors.inputBg,
      paddingHorizontal: sizes.xs * 1.5,
      paddingVertical: 2,
      borderRadius: sizes.radiusSm,
    },

    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBg,
      borderRadius: sizes.radiusMd,
      borderWidth: 1,
      borderColor: "transparent",
      paddingHorizontal: sizes.md,
      height: 52,
    },

    inputIcon: {
      marginRight: sizes.sm,
    },

    textInput: {
      flex: 1,
      fontSize: sizes.fontMd,
      color: colors.text,
      paddingVertical: 0,
    },

    // Save Button
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: sizes.sm,
      backgroundColor: colors.primary,
      height: 54,
      borderRadius: sizes.radiusMd,
      marginTop: sizes.lg,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    saveButtonText: {
      fontSize: sizes.fontMd,
      fontWeight: "700",
      color: colors.white,
    },

    // Modal / Bottom Sheet
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },

    modalContent: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: sizes.radiusXl,
      borderTopRightRadius: sizes.radiusXl,
      paddingHorizontal: sizes.lg,
      paddingTop: sizes.sm,
      paddingBottom: Platform.OS === "ios" ? sizes.xl + 10 : sizes.xl,
    },

    modalHandle: {
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: sizes.md,
    },

    modalTitle: {
      fontSize: sizes.fontLg,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },

    modalSubtitle: {
      fontSize: sizes.fontSm,
      color: colors.mutedText,
      textAlign: "center",
      marginTop: sizes.xs,
      marginBottom: sizes.lg,
    },

    modalOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: sizes.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    modalOptionIconContainer: {
      width: 46,
      height: 46,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.inputBg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: sizes.md,
    },

    modalOptionTextContainer: {
      flex: 1,
    },

    modalOptionTitle: {
      fontSize: sizes.fontMd,
      fontWeight: "600",
      color: colors.text,
    },

    modalOptionSubtitle: {
      fontSize: sizes.fontXs,
      color: colors.mutedText,
      marginTop: 2,
    },

    modalCancelButton: {
      marginTop: sizes.md,
      paddingVertical: sizes.md,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.inputBg,
      alignItems: "center",
    },

    modalCancelText: {
      fontSize: sizes.fontMd,
      fontWeight: "700",
      color: colors.text,
    },
  });