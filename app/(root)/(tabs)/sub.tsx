import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  Image,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {  subplans } from "@/constants";
import { useChildrenStore } from "@/store/childrenStore";

const { width, height } = Dimensions.get("window");

const Sub = () => {
  const { user } = useUser();
  const router = useRouter();
  const setLastPurchasedPlan = useChildrenStore((state) => state.setLastPurchasedPlan);
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [childrenCount, setChildrenCount] = useState("1");
  const [duration, setDuration] = useState("Monthly");



  const plans = subplans;




  const openModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const calculatePrice = () => {
    if (!selectedPlan) return 0;
    if (selectedPlan.priceMonthly === 0) return "Free";

    const base =
      duration === "Monthly"
        ? selectedPlan.priceMonthly
        : selectedPlan.priceYearly;

    return `ETB ${base * Number(childrenCount || 0)}`;
  };

  

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Choose A Plan </Text>
            <Text style={styles.subheader}>Unlock the best for your children</Text>
          </View>
       
        </View>
      </View>

      <ScrollView
  
        showsVerticalScrollIndicator={false}
      >
        
        

      
        <View style={[styles.plansContainer]}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.88}
              onPress={() => {
                setSelectedPlan(plan)
              }}
          
  
            >
              <LinearGradient
                colors={plan.colors}
                style={[
                  styles.planCard,
                  selectedPlan?.id === plan.id && styles.chosen

                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.planLeft}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDesc}>{plan.desc}</Text>
                </View>

                <View style={styles.planRight}>
                  <Text style={styles.price}>
                    {plan.priceMonthly === 0 ? "Free" : `ETB ${plan.priceMonthly}`}
                    <Text style={styles.priceSmall}>/mo</Text>
                  </Text>

                  {plan.badge && (
                    <View style={[
                      styles.badge,
                      plan.popular && styles.popularBadge,
                    ]}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={{display:"flex",alignItems:"center",justifyContent:"center"}} activeOpacity={0.5}
        onPress={()=>openModal(selectedPlan)}
        >
          <View style={styles.select}>
            <Text style={{fontSize:18,fontFamily:"Poppins-Bold",color:"white"}}>
              Buy the plan
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPlan?.name || "Plan"}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            {selectedPlan?.priceMonthly > 0 && (
              <View style={styles.durationToggle}>
                {["Monthly", "Yearly"].map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDuration(d)}
                    style={[
                      styles.durationBtn,
                      duration === d && styles.durationBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        duration === d && styles.durationTextActive,
                      ]}
                    >
                      {d}
                      {d === "Yearly" && (
                        <Text style={styles.saveText}> Save ~17%</Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.childrenLabel}>Number of children</Text>
            <TextInput
              value={childrenCount}
              onChangeText={(text) => setChildrenCount(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#888"
              style={styles.input}
              maxLength={2}
            />

            <TouchableOpacity
              style={[
                styles.buyBtn,
                selectedPlan?.priceMonthly === 0 && styles.freeBtn,
              ]}
              onPress={() => {
                if (selectedPlan) {
                  setLastPurchasedPlan({ id: selectedPlan.id, name: selectedPlan.name });
                }
                alert(`Processing: ${calculatePrice()} – ${duration}`);
              }}
            >
              <Text style={styles.buyText}>
                {selectedPlan?.priceMonthly === 0 ? "Start Free" : `Pay ${calculatePrice()}`}
                {selectedPlan?.priceMonthly > 0 && (
                  <Text style={styles.perChild}> ({duration.toLowerCase()})</Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default Sub;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1A" },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#d0d0ff",
    opacity: 0.85,
    marginTop: 4,
  },
 chosen:{
   transform:[{scale:1.1}],
   borderColor:'#0286FF',
   borderWidth:5
 },
select: {
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:"#0286FF",
  width:"90%",
  padding:20,
  marginTop:20,
  borderRadius:50
},
  
 

  
  plansContainer: { paddingHorizontal: 20, marginTop: 12 },
  planCard: {
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    
  },
 
 
  planLeft: { flex: 1 },
  planName: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Poppins-Bold",
  },
  planDesc: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 6,
    fontFamily: "Poppins-Regular",
  },
  planRight: { alignItems: "flex-end" },
  price: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "Poppins-Bold",
  },
  priceSmall: { fontSize: 16, opacity: 0.9 },
  badge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },
  popularBadge: {
    backgroundColor: "#FFD700",
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#000",
  },

  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A2E",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    maxHeight: height * 0.78,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  closeText: {
    color: "#4dabf7",
    fontSize: 17,
    fontFamily: "Poppins-Medium",
  },
  durationToggle: {
    flexDirection: "row",
    backgroundColor: "#252540",
    borderRadius: 30,
    padding: 6,
    marginBottom: 28,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  durationBtnActive: {
    backgroundColor: "#0286FF",
  },
  durationText: {
    color: "#aaa",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  durationTextActive: { color: "#fff" },
  saveText: { fontSize: 13, color: "#a0f7bf" },

  childrenLabel: {
    color: "#ccc",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#252540",
    borderRadius: 16,
    padding: 16,
    color: "#fff",
    fontSize: 18,
    marginBottom: 28,
    fontFamily: "Poppins-Regular",
  },

  buyBtn: {
    backgroundColor: "#00d4c9",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },
  freeBtn: {
    backgroundColor: "#4caf50",
  },
  buyText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  perChild: {
    fontSize: 14,
    opacity: 0.9,
  },
});