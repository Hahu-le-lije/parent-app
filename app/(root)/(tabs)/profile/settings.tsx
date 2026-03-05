import React from "react";
import { StyleSheet, Text, View } from "react-native";

const settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B12",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFF8D8",
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
});
