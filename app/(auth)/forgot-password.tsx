import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ForgotPassword = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B12",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFF8D8",
    fontFamily: "Poppins-Bold",
    fontSize: 24,
  },
});
