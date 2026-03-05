import RenderChildProgress from "@/components/RenderChildProgress";
import RenderFeatureCard from "@/components/RenderFeatureCard";
import RenderRecommendation from "@/components/RenderRecommendation";
import { icons } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const dashboardData = {
  totalChildren: 5,
  paid: 3,
  unpaid: 2,
  totalPayments: 2400,
  activeSubs: 3,
};

const features = [
  {
    id: "1",
    title: "Discover New Games",
    description: "Explore exciting educational games for kids!",
    imageUri: "https://cdn-icons-png.flaticon.com/512/2920/2920308.png",
  },
  {
    id: "2",
    title: "Learn Features",
    description: "Master the app with interactive tutorials.",
    imageUri: "https://cdn-icons-png.flaticon.com/512/2920/2920308.png",
  },
  {
    id: "3",
    title: "Fun Activities",
    description: "Engage in creative and learning activities.",
    imageUri: "https://cdn-icons-png.flaticon.com/512/2920/2920308.png",
  },
];

const childrenData = [
  {
    id: "1",
    name: "Child 1",
    achievements: 10,
    progress: {
      writing: 80,
      speaking: 70,
      listening: 90,
      reading: 85,
    },
    imageUri: "https://randomuser.me/api/portraits/lego/1.jpg",
    recommendation: "Try the new Math Puzzle game to boost skills!",
  },
  {
    id: "2",
    name: "Child 2",
    achievements: 8,
    progress: {
      writing: 60,
      speaking: 75,
      listening: 65,
      reading: 80,
    },
    imageUri: "https://randomuser.me/api/portraits/lego/2.jpg",
    recommendation: "Explore Reading Adventures for better comprehension.",
  },
  {
    id: "3",
    name: "Child 3",
    achievements: 12,
    progress: {
      writing: 90,
      speaking: 85,
      listening: 95,
      reading: 90,
    },
    imageUri: "https://randomuser.me/api/portraits/lego/3.jpg",
    recommendation: "Challenge yourself with Science Experiments module.",
  },
];

const Home = () => {
  const { user } = useUser();
  const router = useRouter();
  const featureFlatListRef = useRef<FlatList<(typeof features)[number]> | null>(
    null,
  );
  const recommendationFlatListRef = useRef<FlatList<
    (typeof childrenData)[number]
  > | null>(null);
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [selectedChildId, setSelectedChildId] = useState(childrenData[0].id);
  const [showChildDropdown, setShowChildDropdown] = useState(false);

  const selectedChild =
    childrenData.find((child) => child.id === selectedChildId) ??
    childrenData[0];

  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : icons.person;

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (featureFlatListRef.current) {
        currentIndex = (currentIndex + 1) % features.length;
        featureFlatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#0B5E2B", "#B58A00", "#8B1D25"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.h2}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>
                Hello, {user?.firstName || "there"} 👋
              </Text>
              <Text style={styles.subheader}>Let the fun begin</Text>
            </View>
            <TouchableOpacity onPress={() => router.replace("/profile")}>
              <Image
                source={avatarSource}
                style={styles.avatar}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContent}>
          {/* DASHBOARD OVERVIEW */}
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardTitle}>Dashboard Overview</Text>

            <View style={styles.statsRow}>
              <View
                style={[styles.statCardModern, { backgroundColor: "#078930" }]}
              >
                <Text style={styles.statNumber}>
                  {dashboardData.totalChildren}
                </Text>
                <Text style={styles.statLabel}>Children</Text>
              </View>

              <View
                style={[styles.statCardModern, { backgroundColor: "#FCD116" }]}
              >
                <Text style={styles.statNumber}>{dashboardData.paid}</Text>
                <Text style={styles.statLabel}>Paid</Text>
              </View>

              <View
                style={[styles.statCardModern, { backgroundColor: "#DA121A" }]}
              >
                <Text style={styles.statNumber}>{dashboardData.unpaid}</Text>
                <Text style={styles.statLabel}>Unpaid</Text>
              </View>
            </View>
          </View>

          {/* PAYMENT ALERT */}
          {dashboardData.unpaid > 0 && (
            <View style={styles.alertModern}>
              <View style={styles.alertLeft}>
                <Text style={styles.alertTitle}>⚠ Unpaid subscriptions</Text>
                <Text style={styles.alertSub}>
                  {dashboardData.unpaid} children need premium access
                </Text>
              </View>

              <TouchableOpacity
                style={styles.alertBtn}
                onPress={() => router.push("/children")}
              >
                <Text style={styles.alertBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* FEATURES */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <Text style={styles.sectionSub}>Fun learning experiences</Text>
          </View>

          <FlatList
            ref={featureFlatListRef}
            data={features}
            renderItem={({ item }) => <RenderFeatureCard item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH - 40,
              offset: (SCREEN_WIDTH - 40) * index,
              index,
            })}
            snapToAlignment="center"
            decelerationRate="fast"
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Children Progress</Text>
            <Text style={styles.sectionSub}>Track learning growth</Text>
          </View>

          <View style={styles.progressSelectorWrap}>
            <TouchableOpacity
              style={styles.childDropdownBtn}
              activeOpacity={0.85}
              onPress={() => setShowChildDropdown((prev) => !prev)}
            >
              <Text style={styles.childDropdownText}>{selectedChild.name}</Text>
              <Text style={styles.childDropdownChevron}>
                {showChildDropdown ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {showChildDropdown && (
              <View style={styles.childDropdownMenu}>
                {childrenData.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={styles.childDropdownItem}
                    onPress={() => {
                      setSelectedChildId(child.id);
                      setShowChildDropdown(false);
                    }}
                  >
                    <Text style={styles.childDropdownItemText}>
                      {child.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <RenderChildProgress
            item={selectedChild}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
          />

          {/* RECOMMENDATIONS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            <Text style={styles.sectionSub}>Personalized for each child</Text>
          </View>

          <FlatList
            ref={recommendationFlatListRef}
            data={childrenData}
            renderItem={({ item }) => <RenderRecommendation item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            getItemLayout={(data, index) => ({
              length: 240 + 16,
              offset: (240 + 16) * index,
              index,
            })}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 4 }}
          />

          <View style={styles.footerSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B12",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerCard: {
    minHeight: 118,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(252,209,22,0.35)",
    shadowColor: "#080812",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 7,
  },
  headerTextWrap: {
    flexShrink: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#FFFBEA",
    letterSpacing: -0.2,
  },
  subheader: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(255,241,183,0.95)",
    letterSpacing: 0,
  },
  h2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: "#FCD116",
    backgroundColor: "#e0e0e0",
  },

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContent: {
    padding: 20,
    paddingTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 10,
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 26,
    fontFamily: "Poppins-Bold",
  },
  statLabel: {
    color: "#F8F8F8",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: -2,
  },
  alertTitle: {
    color: "#FFF5E0",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  alertSub: {
    color: "#FFE8C7",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },

  sectionTitle: {
    color: "#FFF7D6",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
  },
  carousel: {
    marginBottom: 28,
  },
  dashboardCard: {
    backgroundColor: "#112518",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(252,209,22,0.24)",
    shadowColor: "#0D0D1B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },

  dashboardTitle: {
    color: "#FFF2B0",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 14,
  },

  statCardModern: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#0A0A14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  alertModern: {
    backgroundColor: "#5E1F1F",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(252,209,22,0.35)",
  },

  alertLeft: {
    flex: 1,
    paddingRight: 10,
  },

  alertBtn: {
    backgroundColor: "#078930",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
  },

  alertBtnText: {
    color: "#FFFBEA",
    fontFamily: "Poppins-Bold",
  },

  sectionHeader: {
    marginBottom: 10,
    marginTop: 6,
  },

  sectionSub: {
    color: "#EAD98C",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: -6,
    marginBottom: 8,
  },

  progressSelectorWrap: {
    marginBottom: 12,
    zIndex: 20,
  },
  childDropdownBtn: {
    backgroundColor: "#17311D",
    borderWidth: 1,
    borderColor: "rgba(252,209,22,0.35)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childDropdownText: {
    color: "#FFF8D8",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
  childDropdownChevron: {
    color: "#FCD116",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  childDropdownMenu: {
    marginTop: 6,
    backgroundColor: "#102618",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(252,209,22,0.28)",
    overflow: "hidden",
  },
  childDropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(252,209,22,0.2)",
  },
  childDropdownItemText: {
    color: "#EADFA6",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },

  footerSpacer: {
    height: 100,
  },
});
