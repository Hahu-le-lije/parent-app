import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const ChapaPaymentModal = ({ visible, checkoutUrl, onMessage, onClose }) => {
  const [isProcessed, setIsProcessed] = useState(false);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (
      (url.includes("checkout/test-payment-receipt") ||
        url.includes("success")) &&
      !isProcessed
    ) {
      setIsProcessed(true); // Lock it
      onMessage("success");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#0D1B12" }}>
        <View style={styles.webViewHeader}>
          <Text style={styles.headerText}>Secure Payment</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#078930" />
              <Text style={{ color: "#fff", marginTop: 10 }}>
                Loading Checkout...
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  webViewHeader: {
    height: 60,
    backgroundColor: "#1A301F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 16 },
  closeBtn: { color: "#DA121A", fontWeight: "bold", fontSize: 14 },
  loaderContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D1B12",
  },
});

export default ChapaPaymentModal;
