import { InputFieldProps } from "@/types/type";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const InputField = ({
  labelStyle,
  label,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  placeholder,
  style,
  ...props
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, containerStyle]}>
          <Text style={[styles.text, labelStyle]}>{label}</Text>

          <View
            style={[
              styles.input,
              focused && {
                borderColor: "#FCD116",
                borderWidth: 2,
                backgroundColor: "#1B3521",
              },
              inputStyle,
            ]}
          >
            {icon && (
              <Image
                source={icon}
                style={[
                  {
                    width: 22,
                    height: 22,
                    marginLeft: 12,
                    tintColor: "#CBB55A",
                  },
                  iconStyle,
                ]}
                resizeMode="contain"
              />
            )}

            <TextInput
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={[
                {
                  flex: 1,
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "white",
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                },
                style,
              ]}
              secureTextEntry={secureTextEntry}
              placeholder={placeholder}
              placeholderTextColor="#9BA588"
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
    color: "#E8E6C8",
  },
  input: {
    height: 56, // modern comfortable height
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#1B2319",
    borderRadius: 16,
    borderColor: "#4E6445",
    borderWidth: 1.5,
  },
});
