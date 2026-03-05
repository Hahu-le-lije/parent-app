import Child from "@/components/Child";
import InputField from "@/components/InputField";
import { useChildrenStore } from "@/store/childrenStore";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Children = () => {
  const [filter, setFilter] = useState("All");
  const [showAddChild, setShowAddChild] = useState(false);
  const [search, setSearch] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [subscriptionType, setSubscriptionType] = useState<string>("Basic");
  const [isPaid, setIsPaid] = useState<boolean>(true);

  // Select individual slices from the store to avoid
  // returning a new object from the selector on every render.
  const children = useChildrenStore((state) => state.children);
  const loading = useChildrenStore((state) => state.loading);
  const loadChildren = useChildrenStore((state) => state.loadChildren);
  const addChild = useChildrenStore((state) => state.addChild);

  useEffect(() => {
    if (!children.length && !loading) {
      loadChildren();
    }
  }, [children.length, loading, loadChildren]);

  const filteredData = children.filter((child) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Paid" && child.paid) ||
      (filter === "Unpaid" && !child.paid);

    const matchesSearch = child.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const isFormValid = childName.trim().length > 0 && Number(childAge) > 0;

  const handleSaveChild = () => {
    if (!isFormValid) return;

    addChild({
      name: childName.trim(),
      age: Number(childAge),
      subscription: subscriptionType,
      paid: isPaid,
      image: "https://randomuser.me/api/portraits/lego/6.jpg",
    });

    setShowAddChild(false);
    setChildName("");
    setChildAge("");
    setSubscriptionType("Basic");
    setIsPaid(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.h2}>
          <View>
            <Text style={styles.headerTitle}>Your children</Text>
            <Text style={styles.subheader}>Manage Them</Text>
          </View>

          {/* <TouchableOpacity onPress={() => router.replace('/profile')}>
            <Image
              source={avatarSource}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity> */}
        </View>
      </View>

      <View>
        <TextInput
          placeholder="Search Child"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.addChild}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowAddChild(true)}
          style={styles.addChildCard}
        >
          <LinearGradient
            colors={["#078930", "#B58A00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addChildGradient}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.addChildTitle}>Add a Child</Text>
              <Text style={styles.addChildSub}>
                Create profile, manage subscription & track progress
              </Text>
            </View>

            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              }}
              style={styles.addChildImage}
            />
          </LinearGradient>
        </TouchableOpacity>
        <Modal
          visible={showAddChild}
          animationType="slide"
          transparent
          onRequestClose={() => setShowAddChild(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  Add New Child
                </Text>
                <TouchableOpacity onPress={() => setShowAddChild(false)}>
                  <Text style={{ color: "#FCD116", fontSize: 16 }}>Close</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sheetContent}>
                <InputField
                  label="Child name"
                  placeholder="Enter child's full name"
                  value={childName}
                  onChangeText={setChildName}
                  autoCapitalize="words"
                />
                <InputField
                  label="Age"
                  placeholder="e.g. 9"
                  keyboardType="number-pad"
                  value={childAge}
                  onChangeText={(value) =>
                    setChildAge(value.replace(/[^0-9]/g, ""))
                  }
                />

                <Text style={styles.modalLabel}>Subscription</Text>
                <View style={styles.chipRow}>
                  {["Basic", "Standard", "Premium"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        subscriptionType === type && styles.chipActive,
                      ]}
                      onPress={() => setSubscriptionType(type)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          subscriptionType === type && styles.chipTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.modalLabel}>Payment status</Text>
                <View style={styles.chipRow}>
                  <TouchableOpacity
                    style={[styles.chip, isPaid && styles.chipActive]}
                    onPress={() => setIsPaid(true)}
                  >
                    <Text
                      style={[styles.chipText, isPaid && styles.chipTextActive]}
                    >
                      Paid
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, !isPaid && styles.chipActive]}
                    onPress={() => setIsPaid(false)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        !isPaid && styles.chipTextActive,
                      ]}
                    >
                      Unpaid
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveChildBtn,
                    !isFormValid && styles.saveChildBtnDisabled,
                  ]}
                  onPress={handleSaveChild}
                  disabled={!isFormValid}
                >
                  <Text style={styles.saveChildText}>Save Child</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <Text
        style={{
          fontSize: 20,
          fontFamily: "Poppins-Bold",
          marginTop: 20,
          color: "white",
          marginLeft: 20,
          marginBottom: 10,
        }}
      >
        Registered Children
      </Text>
      <View style={styles.filterContainer}>
        {["All", "Paid", "Unpaid"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              filter === item && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !children.length ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "white", fontFamily: "Poppins-Regular" }}>
            Loading children...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <Child item={item} />}
          keyExtractor={(item) => item._id}
          style={{ width: "100%" }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}
        />
      )}
    </SafeAreaView>
  );
};

export default Children;
const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B12",
    width: "100%",
  },
  header: {
    height: 160,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: "flex-end",
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#E8DFA7",
    opacity: 0.9,
    letterSpacing: -0.3,
  },
  h2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#e0e0e0",
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
    marginHorizontal: 24,
    width: "90%",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#223A25",
    marginRight: 8,
    height: 32,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonSelected: {
    backgroundColor: "#078930",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  filterTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  addChildButton: {
    backgroundColor: "#078930",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  addChildButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    height: height * 0.75,
    backgroundColor: "#1A301F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetContent: {
    flex: 1,
  },
  addChild: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  addChildCard: {
    borderRadius: 22,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#142516",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  addChildGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 22,
  },

  addChildTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
  },

  addChildSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#F2E9BE",
    marginTop: 4,
    width: "85%",
  },

  addChildImage: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  searchInput: {
    backgroundColor: "#1B3120",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    width: "90%",
    marginLeft: 20,
  },
  modalLabel: {
    marginTop: 16,
    marginBottom: 8,
    color: "#EADFA6",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#223A25",
  },
  chipActive: {
    backgroundColor: "#078930",
  },
  chipText: {
    color: "#E5E7EB",
    fontFamily: "Poppins-Regular",
    fontSize: 13,
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  saveChildBtn: {
    marginTop: 20,
    backgroundColor: "#078930",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  saveChildBtnDisabled: {
    backgroundColor: "#223A25",
  },
  saveChildText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
});
