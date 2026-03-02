import { useUser } from "@clerk/clerk-expo";
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";

const ChapaPaymentModal = ({ visible, onClose, data }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false);

  // IMPORTANT: Use your own return URL
  // Option A: Deep link (Expo / custom scheme) → your app handles it
  // Option B: A page on your domain that shows success & can close window
  const RETURN_URL = "https://your-domain.com/payment/success"; // change this!

  const initializeFromBackend = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in to continue");
      onClose();
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      // Clean amount (remove commas if any)
      const cleanAmount = typeof data.amount === "string" 
        ? data.amount.replace(/,/g, "") 
        : data.amount.toString();

      const payload = {
        amount: cleanAmount,
        children: data.children,
        duration: data.duration,
        planName: data.planName,
        // You can pass more: child IDs, userId, etc.
      };

      // Call YOUR backend endpoint
      const response = await fetch("https://your-backend.com/api/payments/chapa/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If using Clerk/JWT: Authorization: `Bearer ${await getToken()}`
          // Or session cookie if backend shares auth
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Backend error");
      }

      if (result.success && result.checkout_url) {
        setCheckoutUrl(result.checkout_url);
      } else {
        throw new Error(result.message || "Failed to get payment URL");
      }
    } catch (err) {
      console.error("Payment init error:", err);
      setErrorMsg(err.message || "Could not start payment. Try again.");
      Alert.alert("Error", err.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      initializeFromBackend();
    }
  }, [visible]);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    // Detect redirect to your return_url → success
    if (url.startsWith(RETURN_URL) && !isProcessed) {
      setIsProcessed(true);
      Alert.alert("Payment Successful", "Your subscription has been activated!");
      onClose();
      // Optional: refresh children store / call API to get updated subscription status
    }

    // Optional fallback: detect Chapa success page (less reliable)
    if (url.includes("checkout.chapa.co") && url.includes("success")) {
      if (!isProcessed) {
        setIsProcessed(true);
        Alert.alert("Payment Completed", "Thank you!");
        onClose();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#1F1F39" }}>
        <View style={styles.webViewHeader}>
          <Text style={styles.headerText}>Secure Payment</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {loading || errorMsg || !checkoutUrl ? (
          <View style={styles.loaderContainer}>
            {errorMsg ? (
              <>
                <Text style={{ color: "#EF4444", fontSize: 16, marginBottom: 10 }}>
                  {errorMsg}
                </Text>
                <TouchableOpacity onPress={initializeFromBackend}>
                  <Text style={{ color: "#3B82F6", fontSize: 16 }}>Retry</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={{ color: "#fff", marginTop: 10 }}>
                  {loading ? "Contacting payment server..." : "Preparing checkout..."}
                </Text>
              </>
            )}
          </View>
        ) : (
          <WebView
            source={{ uri: checkoutUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderLoading={() => (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={{ color: "#fff", marginTop: 10 }}>Loading secure checkout...</Text>
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn("WebView error:", nativeEvent);
              setErrorMsg("Failed to load payment page. Check your connection.");
            }}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  webViewHeader: {
    height: 60,
    backgroundColor: "#2F2F42",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 16 },
  closeBtn: { color: "#EF4444", fontWeight: "bold", fontSize: 14 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F1F39",
  },
});

export default ChapaPaymentModal;