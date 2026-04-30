import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { images } from "@/constants";

type AppStateScreenProps = {
  mode?: "splash" | "loading";
  title?: string;
  subtitle?: string;
};

const AppStateScreen = ({
  mode = "loading",
  title,
  subtitle,
}: AppStateScreenProps) => {
  const isSplash = mode === "splash";

  return (
    <View style={styles.container}>
      <Image source={images.Logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>
        {title ?? (isSplash ? "Welcome to Hahu" : "Loading")}
      </Text>
      <Text style={styles.subtitle}>
        {subtitle ??
          (isSplash
            ? "Preparing your Control space..."
            : "Please wait a moment...")}
      </Text>
      <ActivityIndicator size="large" color="#0286FF" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F39",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    color: "#9AA0C3",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 8,
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
});

export default AppStateScreen;
