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

type ChapaPaymentModalProps = {
  visible: boolean;
  onClose: () => void;
  checkoutUrl: string | null;
  onSuccess?: () => void;
  onRetry?: () => void;
  loading?: boolean;
  errorMsg?: string | null;
};

const ChapaPaymentModal = ({
  visible,
  onClose,
  checkoutUrl,
  onSuccess,
  onRetry,
  loading = false,
  errorMsg = null,
}: ChapaPaymentModalProps) => {
  const [isProcessed, setIsProcessed] = useState(false);
  const RETURN_URL = "payment/success";
  const FAILED_URL = "payment/failed";
  const isLoading = loading || (!checkoutUrl && !errorMsg);

  useEffect(() => {
    if (visible) {
      setIsProcessed(false);
    }
  }, [visible]);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (url.includes(RETURN_URL) && !isProcessed) {
      setIsProcessed(true);
      Alert.alert("Success", "Payment confirmed! Your plan is now active.");
      onSuccess?.();
      onClose();
      return;
    }

    if (url.includes(FAILED_URL) && !isProcessed) {
      setIsProcessed(true);
      Alert.alert("Payment Failed", "Payment was not completed.");
      onClose();
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

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3D5CFF" />
            <Text style={styles.loaderText}>Connecting to Chapa...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.loaderContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
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