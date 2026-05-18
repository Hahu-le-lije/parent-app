import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type StateMessageProps = {
  title: string;
  message?: string;
  type?: "empty" | "error" | "loading";
  actionLabel?: string;
  onAction?: () => void;
};

const iconByType = {
  empty: "folder-open-outline",
  error: "alert-circle-outline",
  loading: "cloud-download-outline",
} as const;

const colorByType = {
  empty: "#9AA0C3",
  error: "#F87171",
  loading: "#0286FF",
} as const;

const StateMessage = ({
  title,
  message,
  type = "empty",
  actionLabel,
  onAction,
}: StateMessageProps) => {
  const accent = colorByType[type];

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}1A` }]}>
        <Ionicons name={iconByType[type]} size={26} color={accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAction}
          style={[styles.action, { borderColor: `${accent}66` }]}
        >
          <Text style={[styles.actionText, { color: accent }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#26264A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  message: {
    color: "#9AA0C3",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 8,
  },
  action: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
});

export default StateMessage;
