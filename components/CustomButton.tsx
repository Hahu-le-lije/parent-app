import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  primary: "#078930",
  secondary: "#B58A00",
  danger: "#DA121A",
  default: "#FFFFFF",
  outline: "transparent",
  success: "#078930",
  outlineT: "#FFF6D5",
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: COLORS[bgVariant] }, style]}
      {...props}
    >
      <View style={styles.content}>
        {IconLeft && <IconLeft style={styles.icon} />}
        <Text style={[styles.text, { color: COLORS[textVariant] }]}>
          {title}
        </Text>
        {IconRight && <IconRight style={styles.icon} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    shadowColor: "#1A331F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginHorizontal: 8,
    fontFamily: "Poppins-Bold",
  },
  icon: {
    marginHorizontal: 4,
  },
});

export default CustomButton;
