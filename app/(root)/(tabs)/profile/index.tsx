import { icons } from "@/constants";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need gallery access to update your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]?.base64) return;

    const asset = result.assets[0];
    setPreviewUri(asset.uri);

    try {
      setUploading(true);

      const mimeType = asset.mimeType || "image/jpeg";
      const base64DataUrl = `data:${mimeType};base64,${asset.base64}`;

      console.log(
        "Uploading base64 preview (first 50 chars):",
        base64DataUrl.substring(0, 50),
      );

      await user?.setProfileImage({ file: base64DataUrl });

      await user?.reload();

      console.log("After reload - new imageUrl:", user?.imageUrl);

      Alert.alert("Success", "Profile picture updated!");
      setPreviewUri(null);
    } catch (err: any) {
      console.error("Upload error details:", err);
      Alert.alert(
        "Upload Failed",
        err?.message ||
          "Check console for details. Image may be too large or invalid format.",
      );
      setPreviewUri(null);
    } finally {
      setUploading(false);
    }
  };

  const displayImage = previewUri || user?.imageUrl || icons.person;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                typeof displayImage === "string"
                  ? { uri: displayImage }
                  : displayImage
              }
              style={styles.profileImage}
            />
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraEmoji}>📷</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress ?? "No email"}
        </Text>

        {uploading && (
          <Text style={styles.uploadingText}>Updating profile picture...</Text>
        )}
      </View>

      <View style={styles.card}>
        <MenuItem
          title="Edit Account"
          onPress={() => router.push("/profile/edit-account")}
        />
        <MenuItem
          title="Settings"
          onPress={() => router.push("/profile/settings")}
        />
        <MenuItem
          title="Help Center"
          onPress={() => router.push("/profile/help-center")}
        />
        <MenuItem
          title="About App"
          onPress={() => router.push("/profile/about")}
        />
      </View>

      <TouchableOpacity
        style={[styles.logoutBtn, uploading && styles.logoutBtnDisabled]}
        onPress={handleLogout}
        disabled={uploading}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

type MenuItemProps = {
  title: string;
  onPress?: () => void;
};

const MenuItem = ({ title, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
    <Image source={icons.arrowDown} style={styles.arrow} />
  </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B12",
  },
  header: {
    height: 140,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#FFF8D8",
    letterSpacing: -0.5,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#FCD116",
    backgroundColor: "#e0e0e0",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#078930",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FCD116",
  },
  cameraEmoji: {
    fontSize: 18,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    marginTop: 16,
    color: "white",
  },
  email: {
    fontSize: 15,
    color: "#D8C87A",
    marginTop: 6,
    fontFamily: "Poppins-Regular",
  },
  uploadingText: {
    marginTop: 12,
    color: "#FCD116",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  card: {
    backgroundColor: "#17311D",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(252,209,22,0.35)",
  },
  menuText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#FFF8D8",
  },
  arrow: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    transform: [{ rotate: "-90deg" }],
    tintColor: "#D8C87A",
  },
  logoutBtn: {
    marginTop: 32,
    marginHorizontal: 20,
    backgroundColor: "#DA121A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutBtnDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
});
