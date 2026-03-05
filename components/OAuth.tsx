import { icons } from "@/constants";
import React from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const OAuth = () => {
  const handle = async () => {};
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: 15,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#D7C56C" }} />
        <Text style={{ marginHorizontal: 10, fontSize: 16, color: "#D7C56C" }}>
          Or
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#D7C56C" }} />
      </View>

      <CustomButton
        title="Log In With Google"
        onPress={handle}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#D7C56C",
        }}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            style={{ width: 20, height: 20, marginRight: 8 }}
          />
        )}
      />
    </View>
  );
};

export default OAuth;
