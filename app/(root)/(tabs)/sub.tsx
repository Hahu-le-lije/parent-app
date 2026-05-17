import React, { useState,useEffect,useMemo } from "react";
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
import AppStateScreen from "@/components/AppStateScreen";
import InlineSkeleton from "@/components/InlineSkeleton";
import { t } from "@/lib/i18n";
import { useLanguageStore } from "@/store/languageStore";

const Sub = () => {
  const { children } = useChildrenStore();
  const language = useLanguageStore((s) => s.language);
  const { buySubscription, loadSubscriptions, subscriptions, assignSubscription, loading } =
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
 const strings = useMemo(() => {
  return {
    // page
    pagetitle: t(language, "pagename_sub"),
    subtitle: t(language, "subtitle_sub"),

    // sections
    purchased_plan: t(language, "purchased_plans"),
    child_subs: t(language, "child_subs"),
    buy: t(language, "buy"),
    upgrade_new: t(language, "upgrade_new"),

    // inventory
    ready: t(language, "ready"),

    // child section
    active: t(language, "active"),
    no_active_plan: t(language, "no_active_plan"),
    renew: t(language, "renew"),
    assign_plan: t(language, "assign_plan"),
    expires_in: t(language, "expires_in"),
    plan_type: t(language, "plan_type"),

    // modal / checkout
    checkout: t(language, "checkout"),
    close: t(language, "close"),
    monthly: t(language, "monthly"),
    yearly: t(language, "yearly"),
    number_of_children: t(language, "number_of_children"),
    pay: t(language, "pay"),
    got_it: t(language, "got_it"),

    // info modal
    subscription_info: t(language, "subscription_info"),
    plan_name: t(language, "plan_name"),
    billing: t(language, "billing"),
    child_slots: t(language, "child_slots"),
    purchased: t(language, "purchased"),
    valid_until: t(language, "valid_until"),

    // alerts
    invalid_input_title: t(language, "invalid_input_title"),
    invalid_input_msg: t(language, "invalid_input_msg"),
    no_plans_title: t(language, "no_plans_title"),
    no_plans_msg: t(language, "no_plans_msg"),
    success: t(language, "success"),
    success_msg: t(language, "success_msg"),
    failed: t(language, "failed"),
    failed_msg: t(language, "failed_msg"),

    // loading
    loading_subs: t(language, "loading_subs"),
    loading_subs_sub: t(language, "loading_subs_sub"),

    // misc
    child_ren: t(language, "child_ren"),
  };
}, [language]);

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
  const showInlineLoader = loading && subscriptions.length > 0;

  const translatePlanName = (name?: string) => {
    if (!name) return "";
    return t(language, String(name).toLowerCase());
  };

  const translatePlanDesc = (name?: string, fallback?: string) => {
    if (!name) return fallback ?? "";
    return t(language, `${String(name).toLowerCase()}_desc`) || fallback || "";
  };

  const calculatePrice = () => {
    if (!selectedPlan) return 0;
    const base = duration === "Monthly" ? selectedPlan.priceMonthly : selectedPlan.priceYearly;
    return (base * Number(childrenCount || 0)).toLocaleString();
  };

  const startCheckout = async () => {
    const slots = Number(childrenCount);
    if (!selectedPlan || Number.isNaN(slots) || slots < 1) {
      Alert.alert(strings.invalid_input_title, strings.invalid_input_msg);
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError(null);
      const url = await buySubscription(slots, getPlanType());
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
      Alert.alert(strings.no_plans_title, strings.no_plans_msg);
      return;
    }

    try {
      await assignSubscription(String(latestSubscription.id), childId);
      Alert.alert(strings.success, strings.success_msg);
      loadSubscriptions();
    } catch (e: any) {
      Alert.alert(strings.failed, e?.message || strings.failed_msg);
    }
  };

  if (loading && !subscriptions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <AppStateScreen
          title={strings.loading_subs}
          subtitle={strings.loading_subs_sub}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{strings.pagetitle}</Text>
          <Text style={styles.subheader}>{strings.subtitle}</Text>
        </View>

      
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.purchased_plan}</Text>
          {showInlineLoader ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.inventoryCard}>
                  <InlineSkeleton width={80} height={16} style={{ marginBottom: 8 }} />
                  <InlineSkeleton width={60} height={12} style={{ marginBottom: 12 }} />
                  <InlineSkeleton width={48} height={18} borderRadius={6} />
                </View>
              ))}
            </ScrollView>
          ) : (
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
                  <Text style={styles.invName}>{translatePlanName(item.name)}</Text>
                  <Text style={styles.invType}>
                    {item.type === "Yearly" ? strings.yearly : strings.monthly}
                  </Text>
                  <View style={styles.invBadge}><Text style={styles.invBadgeText}>{strings.ready}</Text></View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.child_subs}</Text>
          {showInlineLoader
            ? [1, 2].map((skeleton) => (
                <View key={skeleton} style={styles.childCardLarge}>
                  <View style={styles.childInfoRow}>
                    <InlineSkeleton width={55} height={55} borderRadius={28} />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <InlineSkeleton width={130} height={16} style={{ marginBottom: 8 }} />
                      <InlineSkeleton width={100} height={12} />
                    </View>
                    <InlineSkeleton width={88} height={32} borderRadius={10} />
                  </View>
                  <View style={styles.expiryRowLarge}>
                    <View style={styles.detailBox}>
                      <InlineSkeleton width={70} height={12} style={{ marginBottom: 8 }} />
                      <InlineSkeleton width={60} height={14} />
                    </View>
                    <View style={styles.detailBox}>
                      <InlineSkeleton width={70} height={12} style={{ marginBottom: 8 }} />
                      <InlineSkeleton width={90} height={14} />
                    </View>
                  </View>
                </View>
              ))
            : children.map((child) => (
                <View key={child.id} style={styles.childCardLarge}>
                  <View style={styles.childInfoRow}>
                    <Image source={{ uri: child.avatar }} style={styles.childAvatarLarge} />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={styles.childNameLarge}>{child.firstname + ' ' + child.lastname}</Text>
                      <Text style={[styles.statusTextLarge, { color: child.paid ? '#10B981' : '#FFA500' }]}>
                        {child.paid ? `${child.subscription} ${strings.active}` : `${strings.no_active_plan}`}
                      </Text>
                    </View>

                    {child.paid ? (
                      <TouchableOpacity style={styles.renewBtn}>
                        <Text style={styles.renewBtnText}>{strings.renew}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        style={styles.assignActionBtnLarge}
                        onPress={() => assignLastPurchasedToChild(child.id)}
                      >
                        <Text style={styles.assignActionTextLarge}>{strings.assign_plan}</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {child.paid && (
                    <View style={styles.expiryRowLarge}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{strings.expires_in}</Text>
                        <Text style={styles.detailValue}>22 days</Text>
                      </View>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{strings.plan_type}</Text>
                        <Text style={styles.detailValue}>{child.subscription}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.buy}</Text>
          {subplans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan)}
              style={styles.planWrapper}
            >
              <LinearGradient colors={plan.colors} style={styles.planGradientLarge} start={{x:0, y:0}} end={{x:1, y:1}}>
                <View style={{flex: 1}}>
                  <Text style={styles.planNameLarge}>{translatePlanName(plan.name)}</Text>
                  <Text style={styles.planDescLarge}>{translatePlanDesc(plan.name, plan.desc)}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.planPriceLarge}>ETB {plan.priceMonthly}</Text>
                  <Text style={styles.planUnitLarge}>/{strings.monthly}</Text>
                </View>
              </LinearGradient>
              {selectedPlan?.id === plan.id && <View style={styles.selectionBorder} />}
            </TouchableOpacity>
          ))}
        </View>

        {selectedPlan && (
          <TouchableOpacity style={styles.mainBuyBtn} onPress={() => setShowPurchaseModal(true)}>
            <Text style={styles.mainBuyBtnText}>
              {t(language, "continue")} {t(language, String(selectedPlan.name).toLowerCase())}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      
      <Modal visible={showPurchaseModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{strings.checkout}</Text>
                <TouchableOpacity onPress={() => setShowPurchaseModal(false)}><Text style={styles.closeText}>{strings.close}</Text></TouchableOpacity>
             </View>

             <View style={styles.durationToggle}>
                {["Monthly", "Yearly"].map((d) => (
                  <TouchableOpacity key={d} onPress={() => setDuration(d)} style={[styles.durationBtn, duration === d && styles.durationBtnActive]}>
                    <Text style={[styles.durationText, duration === d && styles.durationTextActive]}>
                      {d === "Monthly" ? strings.monthly : strings.yearly}
                    </Text>
                  </TouchableOpacity>
                ))}
             </View>

             <Text style={styles.inputLabel}>{strings.number_of_children}</Text>
             <TextInput style={styles.modalInput} value={childrenCount} onChangeText={setChildrenCount} keyboardType="numeric" />

             <TouchableOpacity style={styles.payBtn} onPress={startCheckout}>
                <Text style={styles.payBtnText}>{strings.pay} ETB {calculatePrice()}</Text>
             </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showInventoryModal} transparent animationType="fade">
        <View style={styles.infoOverlay}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{strings.subscription_info}</Text>
            <DetailRow label={`${strings.plan_name}`} value={translatePlanName(selectedInventoryItem?.name)} />
            <DetailRow
              label={`${strings.billing}`}
              value={
                selectedInventoryItem?.type === "Yearly" ? strings.yearly : strings.monthly
              }
            />
            <DetailRow label={`${strings.child_slots}`} value={`${selectedInventoryItem?.children} ${strings.child_ren}`} />
            <DetailRow label={`${strings.purchased}`} value={selectedInventoryItem?.boughtAt} />
            <DetailRow label={`${strings.valid_until}`} value={selectedInventoryItem?.expiresAt} />
            
            <TouchableOpacity style={styles.closeInfoBtn} onPress={() => setShowInventoryModal(false)}>
                <Text style={styles.closeInfoBtnText}>{strings.got_it}</Text>
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