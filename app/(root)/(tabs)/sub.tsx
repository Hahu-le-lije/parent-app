import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useChildrenStore } from "@/store/childrenStore";
import { subplans } from "@/constants";
import ChapaPaymentModal from "@/components/ChapaPayementModal";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const Sub = () => {
  const { children } = useChildrenStore();
  const { buySubscription, loadSubscriptions, subscriptions, assignSubscription } =
    useSubscriptionStore();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);

  const [childrenCount, setChildrenCount] = useState("1");
  const [duration, setDuration] = useState("Monthly");
  const [visible, setVisible] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const unusedSubscriptions = subscriptions.filter(
    (item) => item.status === "active" && item.available_slots > 0
  );

  const inventory = unusedSubscriptions.map((sub) => ({
    id: String(sub.id),
    name: sub.plan_type,
    type: sub.plan_type.includes("yearly") ? "Yearly" : "Monthly",
    children: sub.available_slots,
    boughtAt: sub.tx_ref,
    expiresAt: new Date(sub.ends_at).toLocaleDateString(),
  }));

  const getPlanType = () => {
    if (!selectedPlan) return "premium_monthly";
    return `${String(selectedPlan.name).toLowerCase()}_${duration.toLowerCase()}`;
  };

  const calculatePrice = () => {
    if (!selectedPlan) return 0;
    const base = duration === "Monthly" ? selectedPlan.priceMonthly : selectedPlan.priceYearly;
    return (base * Number(childrenCount || 0)).toLocaleString();
  };

  const startCheckout = async () => {
    const slots = Number(childrenCount);
    if (!selectedPlan || Number.isNaN(slots) || slots < 1) {
      Alert.alert("Invalid Input", "Select a plan and enter a valid child count.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError(null);
      const url = await buySubscription(slots, getPlanType(), duration);
      setCheckoutUrl(url);
      setShowPurchaseModal(false);
      setVisible(true);
    } catch (e: any) {
      setCheckoutError(e?.message || "Failed to initialize payment");
      setVisible(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const assignLastPurchasedToChild = async (childId: string) => {
    const latestSubscription = unusedSubscriptions[0];
    if (!latestSubscription) {
      Alert.alert("No Plans", "Purchase a plan first.");
      return;
    }

    try {
      await assignSubscription(String(latestSubscription.id), childId);
      Alert.alert("Success", "Child added to subscription successfully");
      loadSubscriptions();
    } catch (e: any) {
      Alert.alert("Failed", e?.message || "Could not assign subscription");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Subscription Hub</Text>
          <Text style={styles.subheader}>Manage access for your children</Text>
        </View>

      
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purchased Plans (Unused)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {inventory.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.inventoryCard}
                onPress={() => {
                  setSelectedInventoryItem(item);
                  setShowInventoryModal(true);
                }}
              >
                <Text style={styles.invName}>{item.name}</Text>
                <Text style={styles.invType}>{item.type}</Text>
                <View style={styles.invBadge}><Text style={styles.invBadgeText}>Ready</Text></View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child Subscriptions</Text>
          {children.map((child) => (
            <View key={child.id} style={styles.childCardLarge}>
              <View style={styles.childInfoRow}>
                <Image source={{ uri: child.avatar }} style={styles.childAvatarLarge} />
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.childNameLarge}>{child.firstname + ' ' + child.lastname}</Text>
                  <Text style={[styles.statusTextLarge, { color: child.paid ? '#10B981' : '#FFA500' }]}>
                    {child.paid ? `${child.subscription} Active` : 'No Active Plan'}
                  </Text>
                </View>

                {child.paid ? (
                  <TouchableOpacity style={styles.renewBtn}>
                    <Text style={styles.renewBtnText}>Renew</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.assignActionBtnLarge}
                    onPress={() => assignLastPurchasedToChild(child.id)}
                  >
                    <Text style={styles.assignActionTextLarge}>Assign Plan</Text>
                  </TouchableOpacity>
                )}
              </View>

              {child.paid && (
                <View style={styles.expiryRowLarge}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Expires In</Text>
                    <Text style={styles.detailValue}>22 Days</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Plan Type</Text>
                    <Text style={styles.detailValue}>{child.subscription}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upgrade or Buy New</Text>
          {subplans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan)}
              style={styles.planWrapper}
            >
              <LinearGradient colors={plan.colors} style={styles.planGradientLarge} start={{x:0, y:0}} end={{x:1, y:1}}>
                <View style={{flex: 1}}>
                  <Text style={styles.planNameLarge}>{plan.name}</Text>
                  <Text style={styles.planDescLarge}>{plan.desc}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.planPriceLarge}>ETB {plan.priceMonthly}</Text>
                  <Text style={styles.planUnitLarge}>/month</Text>
                </View>
              </LinearGradient>
              {selectedPlan?.id === plan.id && <View style={styles.selectionBorder} />}
            </TouchableOpacity>
          ))}
        </View>

        {selectedPlan && (
          <TouchableOpacity style={styles.mainBuyBtn} onPress={() => setShowPurchaseModal(true)}>
            <Text style={styles.mainBuyBtnText}>Continue with {selectedPlan.name}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      
      <Modal visible={showPurchaseModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Checkout</Text>
                <TouchableOpacity onPress={() => setShowPurchaseModal(false)}><Text style={styles.closeText}>Close</Text></TouchableOpacity>
             </View>

             <View style={styles.durationToggle}>
                {["Monthly", "Yearly"].map((d) => (
                  <TouchableOpacity key={d} onPress={() => setDuration(d)} style={[styles.durationBtn, duration === d && styles.durationBtnActive]}>
                    <Text style={[styles.durationText, duration === d && styles.durationTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
             </View>

             <Text style={styles.inputLabel}>Number of Children</Text>
             <TextInput style={styles.modalInput} value={childrenCount} onChangeText={setChildrenCount} keyboardType="numeric" />

             <TouchableOpacity style={styles.payBtn} onPress={startCheckout}>
                <Text style={styles.payBtnText}>Pay ETB {calculatePrice()}</Text>
             </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showInventoryModal} transparent animationType="fade">
        <View style={styles.infoOverlay}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Subscription Info</Text>
            <DetailRow label="Plan Name" value={selectedInventoryItem?.name} />
            <DetailRow label="Billing" value={selectedInventoryItem?.type} />
            <DetailRow label="Child Slots" value={`${selectedInventoryItem?.children} Child(ren)`} />
            <DetailRow label="Purchased" value={selectedInventoryItem?.boughtAt} />
            <DetailRow label="Valid Until" value={selectedInventoryItem?.expiresAt} />
            
            <TouchableOpacity style={styles.closeInfoBtn} onPress={() => setShowInventoryModal(false)}>
                <Text style={styles.closeInfoBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    
      <ChapaPaymentModal 
       visible={visible}
       onClose={() => setVisible(false)}
       checkoutUrl={checkoutUrl}
       loading={checkoutLoading}
       errorMsg={checkoutError}
       onRetry={startCheckout}
       onSuccess={loadSubscriptions}
      />

    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

export default Sub;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F1F39" },
  header: { padding: 25, marginTop:20 },
  headerTitle: { fontSize: 26, fontFamily: "Poppins-Bold", color: "#fff" },
  subheader: { fontSize: 15, fontFamily: "Poppins-Regular", color: "#9CA3AF" },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontFamily: "Poppins-Bold", color: "#fff", marginBottom: 15 },
  inventoryCard: {
    backgroundColor: "#2F2F42",
    width: 130,
    height: 110,
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  invName: { color: '#fff', fontSize: 16, fontFamily: 'Poppins-Bold' },
  invType: { color: '#9CA3AF', fontSize: 13 },
  invBadge: { backgroundColor: '#10B981', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 8 },
  invBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  childCardLarge: { backgroundColor: "#2F2F42", borderRadius: 20, padding: 20, marginBottom: 15 },
  childInfoRow: { flexDirection: "row", alignItems: "center" },
  childAvatarLarge: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#1E1E38' },
  childNameLarge: { color: "#fff", fontSize: 18, fontFamily: "Poppins-SemiBold" },
  statusTextLarge: { fontSize: 13, fontFamily: "Poppins-Regular", marginTop: 2 },
  assignActionBtnLarge: { backgroundColor: "#3B82F6", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  assignActionTextLarge: { color: "#fff", fontSize: 13, fontFamily: "Poppins-Bold" },
  renewBtn: { borderWidth: 1, borderColor: "#3B82F6", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  renewBtnText: { color: "#3B82F6", fontSize: 13, fontFamily: "Poppins-Bold" },
  expiryRowLarge: { flexDirection: "row", marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)" },
  detailBox: { flex: 1 },
  detailLabel: { color: "#9CA3AF", fontSize: 12, fontFamily: "Poppins-Regular" },
  detailValue: { color: "#fff", fontSize: 14, fontFamily: "Poppins-SemiBold", marginTop: 2 },
  planWrapper: { borderRadius: 24, overflow: 'hidden', marginBottom: 15, position: 'relative' },
  planGradientLarge: { padding: 25, flexDirection: 'row', alignItems: 'center' },
  planNameLarge: { color: '#fff', fontSize: 22, fontFamily: 'Poppins-Bold' },
  planDescLarge: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  planPriceLarge: { color: '#fff', fontSize: 24, fontFamily: 'Poppins-Bold' },
  planUnitLarge: { color: '#fff', fontSize: 12, opacity: 0.8 },
  selectionBorder: { ...StyleSheet.absoluteFillObject, borderWidth: 4, borderColor: '#3B82F6', borderRadius: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#2F2F42', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  modalTitle: { color: '#fff', fontSize: 22, fontFamily: 'Poppins-Bold' },
  closeText: { color: '#3B82F6', fontSize: 16 },
  durationToggle: { flexDirection: 'row', backgroundColor: '#1E1E38', borderRadius: 15, padding: 6, marginBottom: 25 },
  durationBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  durationBtnActive: { backgroundColor: '#3B82F6' },
  durationText: { color: '#9CA3AF', fontSize: 15 },
  durationTextActive: { color: '#fff', fontFamily: 'Poppins-Bold' },
  inputLabel: { color: "#9CA3AF", fontSize: 15, marginBottom: 10 },
  modalInput: { backgroundColor: '#1E1E38', color: '#fff', borderRadius: 15, padding: 18, fontSize: 18, marginBottom: 25 },
  payBtn: { backgroundColor: '#10B981', padding: 20, borderRadius: 18, alignItems: 'center' },
  payBtnText: { color: '#fff', fontSize: 18, fontFamily: 'Poppins-Bold' },
  infoOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  infoCard: { width: '88%', backgroundColor: '#2F2F42', borderRadius: 28, padding: 30 },
  infoTitle: { color: '#fff', fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 25, textAlign: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  infoLabel: { color: '#9CA3AF', fontSize: 15 },
  infoValue: { color: '#fff', fontSize: 15, fontFamily: 'Poppins-SemiBold' },
  closeInfoBtn: { marginTop: 25, backgroundColor: '#3B82F6', padding: 15, borderRadius: 15, alignItems: 'center' },
  closeInfoBtnText: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 16 },
  mainBuyBtn: { backgroundColor: "#3B82F6", margin: 25, padding: 20, borderRadius: 20, alignItems: 'center' },
  mainBuyBtnText: { color: '#fff', fontSize: 18, fontFamily: 'Poppins-Bold' },
});