import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Child2 from "./Child2";

const ChildProfile = (child: {
  id: string;
  dob: Date;
  subscription: string;
  paid: boolean;
  avatar: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}) => {
  const [showpassword, setShowPassword] = useState(false);
  const copyToClipboard = async (text: string) => {
    if (!text) return;

    await Clipboard.setStringAsync(text);
  };
  return (
    <View>
      <View style={styles.childProfile}>
        <Child2 item={child!} />
      </View>
      <View style={styles.credentialsCard}>
        <Text style={styles.cardLabel}>Child Account Access</Text>

        <View style={styles.credentialRow}>
          <View style={styles.credentialInfo}>
            <Text style={styles.credentialLabel}>Username</Text>
            <Text style={styles.credentialValue}>
              {child?.username || "Not set"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.copyIcon}
            onPress={() => copyToClipboard(child?.username || "")}
          >
            <Ionicons name="copy-outline" size={18} color="#0286FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.credentialDivider} />

        <View style={styles.credentialRow}>
          <View style={styles.credentialInfo}>
            <Text style={styles.credentialLabel}>Password</Text>
            <Text style={styles.credentialValue}>
              {showpassword ? child?.password || "Not set" : "**********"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.copyIcon}
            onPress={() => setShowPassword(!showpassword)}
          >
            <Ionicons name="eye-outline" size={18} color="#9AA0C3" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.credentialDivider} />
    </View>
  );
};

export default ChildProfile;
const styles = StyleSheet.create({
  childProfile: { alignItems: "center", marginVertical: 10, width: "100%" },
  credentialsCard: {
    backgroundColor: "#26264A",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  credentialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  credentialInfo: {
    flex: 1,
  },
  credentialLabel: {
    fontSize: 11,
    color: "#9AA0C3",
    fontFamily: "Poppins-Regular",
    marginBottom: 2,
  },
  credentialValue: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  copyIcon: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
  },
  credentialDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 12,
  },
  cardLabel: {
    color: "#9AA0C3",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
  },
});
