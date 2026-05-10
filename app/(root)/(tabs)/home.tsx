import InlineSkeleton from "@/components/InlineSkeleton";
import { icons } from "@/constants";
import { t } from "@/lib/i18n";
import { useChildrenStore } from "@/store/childrenStore";
import { useLanguageStore } from "@/store/languageStore";
import { useProgressStore } from "@/store/progressStore";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  // Real Data Stores
  const children = useChildrenStore((state) => state.children);
  const {
    analytics,
    loadAnalytics,
    loading: loadingProgress,
  } = useProgressStore();

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string>("");
  const [isPremium] = useState(false); // Toggle based on your logic

  const showInlineLoader = !isLoaded;

  // 1. Initialize Auth and first child
  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      setAuthToken(token ?? "");
      if (children.length > 0 && !selectedChildId) {
        setSelectedChildId(children[0].id);
      }
    };
    init();
  }, [children]);

  useEffect(() => {
    if (selectedChildId && authToken) {
      loadAnalytics(selectedChildId, authToken);
    }
  }, [selectedChildId, authToken]);

  const selectedChild = useMemo(
    () => children.find((c) => c.id === selectedChildId) || children[0],
    [selectedChildId, children],
  );

  const strings = useMemo(() => {
    const name = user?.firstName || "Parent";
    return {
      hello: t(language, "home_hello", { name }),
      manageProgress: t(language, "home_manage_progress"),
      yourChildren: t(language, "home_your_children"),
      progressTitle: t(language, "home_progress_title", {
        name: selectedChild?.firstname || "",
      }),
      unlockAiSub: t(language, "home_unlock_ai_sub", {
        name: selectedChild?.firstname || "",
      }),
    };
  }, [language, selectedChild?.firstname, user?.firstName]);

  const toHours = (seconds: number = 0) => (seconds / 3600).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            {showInlineLoader ? (
              <>
                <InlineSkeleton width={180} height={24} />
                <InlineSkeleton
                  width={170}
                  height={14}
                  style={{ marginTop: 10 }}
                />
              </>
            ) : (
              <>
                <Text style={styles.headerTitle}>{strings.hello}</Text>
                <Text style={styles.subheader}>{strings.manageProgress}</Text>
              </>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            {showInlineLoader ? (
              <InlineSkeleton width={55} height={55} borderRadius={27.5} />
            ) : (
              <Image
                source={user?.imageUrl ? { uri: user.imageUrl } : icons.person}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Your Explorers</Text>
            <TouchableOpacity onPress={() => router.push("/children")}>
              <Text style={styles.seeAllText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={children}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 10,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedChildId(item.id)}
                style={[
                  styles.childPill,
                  selectedChildId === item.id && styles.activeChildPill,
                ]}
              >
                <Image
                  source={item.avatar ? { uri: item.avatar } : icons.person}
                  style={styles.pillAvatar}
                />
                <Text
                  style={[
                    styles.pillName,
                    selectedChildId === item.id && styles.activePillName,
                  ]}
                >
                  {item.firstname}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.progressContainer}>
          <LinearGradient
            colors={["#37375A", "#26264A"]}
            style={styles.heroCard}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardTag}>CURRENT STATUS</Text>
              <Text style={styles.cardTitle}>
                {selectedChild?.firstname}&apos;s Mastery
              </Text>

              <View style={styles.progressRow}>
                <View style={styles.progressTextGroup}>
                  {loadingProgress ? (
                    <ActivityIndicator color="#0286FF" />
                  ) : (
                    <Text style={styles.bigPercent}>
                      {analytics?.weekly_summary?.mastery_score ?? 0}%
                    </Text>
                  )}
                  <Text style={styles.progressSub}>Overall Mastery</Text>
                </View>
                <Ionicons
                  name="sparkles"
                  size={32}
                  color="#0286FF"
                  opacity={0.6}
                />
              </View>

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${analytics?.weekly_summary?.mastery_score ?? 0}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <View style={styles.statTile}>
              <Ionicons name="time-outline" size={20} color="#0286FF" />
              <Text style={styles.statValText}>
                {toHours(analytics?.weekly_summary?.time_spent)}h
              </Text>
              <Text style={styles.statLabelText}>Play Time</Text>
            </View>
            <View style={styles.statTile}>
              <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
              <Text style={styles.statValText}>
                {analytics?.weekly_summary?.correct_answers ?? 0}
              </Text>
              <Text style={styles.statLabelText}>Correct</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.aiInsightContainer}>
            <View style={styles.aiInsightHeader}>
              <Ionicons name="bulb" size={18} color="#10B981" />
              <Text style={styles.aiInsightTitle}>AI Recommendation</Text>
            </View>

            {isPremium ? (
              <Text style={styles.insightText}>
                {analytics?.daily_summary?.generated_explanation ||
                  "Not enough data yet. Keep playing!"}
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.lockedAiOverlay}
                onPress={() => router.push("/sub")}
              >
                <Ionicons name="lock-closed" size={20} color="#9AA0C3" />
                <Text style={styles.lockedAiText}>{strings.unlockAiSub}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F1F39" },
  header: { paddingHorizontal: 24, paddingVertical: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontFamily: "Poppins-Bold", color: "#fff" },
  subheader: { fontSize: 14, color: "#9AA0C3", fontFamily: "Poppins-Regular" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#0286FF",
  },

  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionLabel: { color: "#fff", fontSize: 18, fontFamily: "Poppins-Bold" },
  seeAllText: { color: "#0286FF", fontSize: 14 },

  childPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#26264A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  activeChildPill: { backgroundColor: "#0286FF", borderColor: "#0286FF" },
  pillAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  pillName: { color: "#9AA0C3", fontSize: 14, fontFamily: "Poppins-Medium" },
  activePillName: { color: "#fff" },

  progressContainer: { paddingHorizontal: 24, marginTop: 20 },
  heroCard: { borderRadius: 24, padding: 24 },
  cardInfo: { flex: 1 },
  cardTag: { color: "#0286FF", fontSize: 10, fontFamily: "Poppins-Bold" },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginTop: 4,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  progressTextGroup: { justifyContent: "center" },
  bigPercent: { color: "#fff", fontSize: 32, fontFamily: "Poppins-Bold" },
  progressSub: { color: "#9AA0C3", fontSize: 12 },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0286FF",
    borderRadius: 4,
  },

  statsGrid: { flexDirection: "row", gap: 12 },
  statTile: {
    flex: 1,
    backgroundColor: "#26264A",
    padding: 16,
    borderRadius: 20,
  },
  statValText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginTop: 8,
  },
  statLabelText: { color: "#9AA0C3", fontSize: 12 },

  aiInsightContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  aiInsightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  aiInsightTitle: {
    color: "#10B981",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  lockedAiOverlay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  lockedAiText: { color: "#9AA0C3", fontSize: 13 },
  insightText: { color: "#fff", fontSize: 14, lineHeight: 20 },
});

export default Home;
