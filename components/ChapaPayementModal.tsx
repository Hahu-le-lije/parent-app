import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";

interface Response{
  status:string;
  checkout_url:string;
}
const ChapaPaymentModal = ({ visible, onClose, data }) => {
  const { user } = useUser();
  const { getToken } = useAuth(); 
  
  const [loading, setLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);


  const RETURN_URL = "https://your-domain.com/payment/success"; 

  const initializeFromBackend = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in to continue");
      onClose();
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const token = await getToken();

        {/* plan_type(string)  max_slots(int)*/}
      const payload = {
        max_slots: data.children,
        plan_type: data.planName,
        duration: data.duration
      };

      const response = await fetch("https://your-backend.com/api/payments/chapa/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Backend initialization failed");
      }

      if (result.status==="success" && result.checkout_url) {
        setCheckoutUrl(result.checkout_url);
      } else {
        throw new Error("Could not retrieve checkout URL");
      }
    } catch (err: any) {
      console.error("Payment init error:", err);
      setErrorMsg(err.message || "Could not start payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setIsProcessed(false);
      setCheckoutUrl(null);
      initializeFromBackend();
    }
  }, [visible]);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (url.startsWith(RETURN_URL) && !isProcessed) {
      setIsProcessed(true);
     
      setTimeout(() => {
        Alert.alert("Success", "Payment confirmed! Your plan is now active.");
        onClose();
      }, 1000);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet" 
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.webViewHeader}>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <TouchableOpacity onPress={onClose} style={styles.cancelTouch}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3D5CFF" />
            <Text style={styles.loaderText}>Connecting to Chapa...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.loaderContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={initializeFromBackend}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            source={{ uri: checkoutUrl! }}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3D5CFF" />
              </View>
            )}
            style={styles.webview}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F39",
  },
  webViewHeader: {
    height: 60,
    backgroundColor: "#2F2F42",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: { 
    color: "#fff", 
    fontFamily: "Poppins-Bold", 
    fontSize: 17 
  },
  cancelTouch: {
    padding: 5,
  },
  cancelText: { 
    color: "#FF6B6B", 
    fontFamily: "Poppins-Medium", 
    fontSize: 14 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loaderText: { 
    color: "#BABBC9", 
    marginTop: 15, 
    fontFamily: "Poppins-Regular" 
  },
  errorText: { 
    color: "#FF6B6B", 
    fontSize: 15, 
    textAlign: "center", 
    marginBottom: 20,
    fontFamily: "Poppins-Medium" 
  },
  retryBtn: {
    backgroundColor: "#3D5CFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { 
    color: "white", 
    fontFamily: "Poppins-Bold" 
  },
  webview: {
    flex: 1,
    backgroundColor: "#1F1F39",
  },
});

export default ChapaPaymentModal;