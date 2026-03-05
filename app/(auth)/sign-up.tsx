import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { parentStore } from "@/store/parentStore";
import { useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";

const SignUp = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerified, setPendingVerified] = useState(false);
  const [code, setCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const codeInputRef = useRef<TextInput>(null);

  const firstName = parentStore((state) => state.firstName);
  const lastName = parentStore((state) => state.lastName);
  const email = parentStore((state) => state.email);
  const phoneNumber = parentStore((state) => state.phoneNumber);
  const password = parentStore((state) => state.password);
  const confirmPassword = parentStore((state) => state.confirmPassword);
  const remove = parentStore((state) => state.remove);

  const setPhoneNumber = parentStore((state) => state.setPhoneNumber);
  const setPassword = parentStore((state) => state.setPassword);
  const setConfirmPassword = parentStore((state) => state.setConfirmPassword);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password: password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerified(true);
      setCode("");
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || "Something went wrong");
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
    remove();
  };

  const handleVerify = async () => {
    if (!isLoaded || !code.trim()) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });

        setPendingVerified(false);
        setShowSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        router.replace("/(root)/(tabs)/home");
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || "Invalid code");
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={40}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={["#078930", "#B58A00", "#8B1D25"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Image
            source={images.Logo}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Your Account</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Phone Number"
            placeholder="Enter your Phone Number"
            icon={icons.marker}
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
            keyboardType="phone-pad"
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry
          />
          <InputField
            label="Confirm Password"
            placeholder="Confirm Your Password"
            icon={icons.lock}
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            secureTextEntry
          />

          {errorMsg && !pendingVerified && (
            <Text style={styles.errorText}>{errorMsg}</Text>
          )}

          <CustomButton
            title={isLoading ? "Creating..." : "Sign Up"}
            onPress={handleSubmit}
            disabled={isLoading}
            bgVariant="primary"
            style={styles.button}
          />

          <OAuth />

          <Link href="/(auth)/sign-in" style={styles.link}>
            Already have an account?{" "}
            <Text style={styles.linkHighlight}>Log in</Text>
          </Link>
        </View>
      </View>

      <Modal
        isVisible={showSuccess}
        animationIn={"bounceIn"}
        animationOut={"fadeOut"}
        animationOutTiming={350}
        animationInTiming={700}
        backdropOpacity={0.65}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={300}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={icons.checkmark}
              style={[styles.verifiedImage, { tintColor: "#fff" }]}
              resizeMode="contain"
            />
            <Text style={[styles.successTitle, { color: "white" }]}>
              Verified!
            </Text>
            <Text style={[styles.successSubtitle, { color: "#ECE0A5" }]}>
              Account created successfully
            </Text>
            <CustomButton
              title="Continue"
              style={{ marginTop: 20, backgroundColor: "#078930" }}
              onPress={() => router.replace("/(root)/(tabs)/home")}
            />
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={pendingVerified}
        animationOut={"slideOutDown"}
        animationIn={"slideInUp"}
        animationInTiming={420}
        animationOutTiming={320}
        backdropOpacity={0.6}
        avoidKeyboard={true}
        onBackdropPress={() => setPendingVerified(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to{"\n"}
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontWeight: "bold",
                  color: "#FCD116",
                }}
              >
                {email}
              </Text>
            </Text>
            <TextInput
              ref={codeInputRef}
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry={false}
              placeholderTextColor="#C9BC7F"
              style={{
                width: "100%",
                height: 56,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 20,
                borderWidth: 2,
                borderColor: code.length === 6 ? "#078930" : "#D8C87A",
                borderRadius: 12,
                backgroundColor: "#1D311F",
                color: "#FFFFFF",
                marginVertical: 16,
                textAlign: "center",
                letterSpacing: 8,
                borderBottomWidth: 2,
              }}
            />
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
            <CustomButton
              title={isLoading ? "Verifying..." : "Verify"}
              onPress={handleVerify}
              disabled={isLoading || code.length !== 6}
              bgVariant="primary"
              style={{ marginTop: 15, backgroundColor: "#078930" }}
            />

            <TouchableOpacity
              onPress={() =>
                signUp?.prepareEmailAddressVerification({
                  strategy: "email_code",
                })
              }
              style={{ marginTop: 20 }}
            >
              <Text style={styles.resendText}>
                Didn't receive code?{" "}
                <Text style={{ color: "#FCD116" }}>Resend</Text>
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B12",
  },
  content: {
    flex: 1,
  },
  header: {
    position: "relative",
    width: "100%",
    height: 260,
  },
  image: {
    width: "100%",
    height: 260,
  },
  title: {
    position: "absolute",
    bottom: 20,
    left: 20,
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    marginBottom: 20,
  },
  button: {
    marginTop: 28,
    width: "100%",
    backgroundColor: "#078930",
  },
  errorText: {
    color: "#DA121A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  link: {
    marginTop: 28,
    fontSize: 16,
    textAlign: "center",
    color: "#D8C97A",
  },
  linkHighlight: {
    color: "#FCD116",
    fontFamily: "Poppins-SemiBold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A301F",
    borderRadius: 20,
    padding: 28,
    width: "82%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#E8DFA7",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  resendText: {
    fontSize: 14,
    color: "#E8DFA7",
    textAlign: "center",
  },
  verifiedImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    backgroundColor: "#078930",
    borderRadius: 50,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  successSubtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginTop: 8,
    textAlign: "center",
  },
});
