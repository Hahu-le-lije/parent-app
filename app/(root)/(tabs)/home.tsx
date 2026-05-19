import DailyRecommendationCard from "@/components/DailyRecommendationCard";
import InlineSkeleton from "@/components/InlineSkeleton";
import StateMessage from "@/components/StateMessage";
import { icons } from "@/constants";
import { t } from "@/lib/i18n";
import { useChildrenStore } from "@/store/childrenStore";
import { useLanguageStore } from "@/store/languageStore";
import { useRecommendationStore } from "@/store/analysisStore";
import { useProgressStore } from "@/store/progressStore";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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


  const children = useChildrenStore((state) => state.children);
  const childrenLoading = useChildrenStore((state) => state.loading);
  const childrenError = useChildrenStore((state) => state.error);
  const loadChildren = useChildrenStore((state) => state.loadChildren);
  const {
    analytics,
    loadAllProgress,
    loading: loadingProgress,
    error: progressError,
  } = useProgressStore();

  const {
    recommendation,
    loadingRecommendation,
    recommendationError,
    fetchRecommendation,
  } = useRecommendationStore();

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string>("");

  const showInlineLoader = !isLoaded;

  
  useEffect(() => {
    const init = async () => {
      const token = await getToken({template:"testing"});
      console.log(token)
      setAuthToken(token ?? "");
      if (token && children.length === 0 && !childrenLoading && !childrenError) {
        void loadChildren(token);
      }
      if (children.length > 0 && !selectedChildId) {
        setSelectedChildId(children[0].id);
      }
    };
    void init();
  }, [children, childrenError, childrenLoading, getToken, loadChildren, selectedChildId]);

  useFocusEffect(
    useCallback(() => {
      if (selectedChildId && authToken) {
        void loadAllProgress(authToken, selectedChildId);
        void fetchRecommendation(selectedChildId, authToken);
      }
    }, [
      selectedChildId,
      authToken,
      loadAllProgress,
      fetchRecommendation,
    ]),
  );

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
      manage: t(language, "home_manage"),
      currentStatus: t(language, "home_current_status"),
      overallMastery: t(language, "home_overall_mastery"),
      playTime: t(language, "home_play_time"),
      correct: t(language, "home_correct"),
    };
  }, [language, user?.firstName]);

  const toHours = (seconds: number = 0) => (seconds / 3600).toFixed(1);
  const masteryScore = Math.max(
    0,
    Math.min(100, analytics?.weekly_summary?.mastery_score ?? 0),
  );
  const retryChildren = () => {
    if (authToken) {
      void loadChildren(authToken);
    }
  };
  const retryProgress = () => {
    if (selectedChildId && authToken) {
      void loadAllProgress(authToken, selectedChildId);
    }
  };

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
            <Text style={styles.sectionLabel}>{strings.yourChildren}</Text>
            <TouchableOpacity onPress={() => router.push("/children")}>
              <Text style={styles.seeAllText}>{strings.manage}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={children}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.horizontalState}>
                {childrenLoading ? (
                  <InlineSkeleton width={180} height={52} borderRadius={25} />
                ) : (
                  <StateMessage
                    type={childrenError ? "error" : "empty"}
                    title={childrenError ? "Children could not load" : "No children yet"}
                    message={
                      childrenError ??
                      "Add a child profile to see progress and recommendations here."
                    }
                    actionLabel={childrenError ? "Try again" : undefined}
                    onAction={childrenError ? retryChildren : undefined}
                  />
                )}
              </View>
            }
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
              <Text style={styles.cardTag}>{strings.currentStatus}</Text>
              <Text style={styles.cardTitle}>
                {selectedChild ? `${selectedChild.firstname}'s Mastery` : "No child selected"}
              </Text>

              {progressError && selectedChild ? (
                <View style={styles.heroState}>
                  <Text style={styles.heroErrorText}>{progressError}</Text>
                  <TouchableOpacity onPress={retryProgress} style={styles.heroRetryBtn}>
                    <Text style={styles.heroRetryText}>Try again</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.progressRow}>
                  <View style={styles.progressTextGroup}>
                    {loadingProgress ? (
                      <ActivityIndicator color="#0286FF" />
                    ) : (
                      <Text style={styles.bigPercent}>{masteryScore}%</Text>
                    )}
                    <Text style={styles.progressSub}>{strings.overallMastery}</Text>
                  </View>
                  <Ionicons
                    name="sparkles"
                    size={32}
                    color="#0286FF"
                    opacity={0.6}
                  />
                </View>
              )}

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${masteryScore}%`,
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
                {progressError ? "--" : `${toHours(analytics?.weekly_summary?.time_spent)}h`}
              </Text>
              <Text style={styles.statLabelText}>{strings.playTime}</Text>
            </View>
            <View style={styles.statTile}>
              <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
              <Text style={styles.statValText}>
                {progressError ? "--" : (analytics?.weekly_summary?.correct_answers ?? 0)}
              </Text>
              <Text style={styles.statLabelText}>{strings.correct}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <DailyRecommendationCard
            language={language}
            recommendation={recommendation}
            loading={Boolean(selectedChild) && loadingRecommendation}
            error={recommendationError}
            onRetry={() => {
              if (selectedChildId && authToken) {
                void fetchRecommendation(selectedChildId, authToken);
              }
            }}
            upgradeHint={
              !selectedChild?.paid
                ? t(language, "home_daily_rec_upgrade_hint")
                : null
            }
            onPressUpgrade={
              !selectedChild?.paid ? () => router.push("/sub") : undefined
            }
          />
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
  horizontalState: { width: 280 },
  heroState: {
    marginTop: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.25)",
  },
  heroErrorText: {
    color: "#FCA5A5",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },
  heroRetryBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(248, 113, 113, 0.14)",
  },
  heroRetryText: {
    color: "#FECACA",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
});

export default Home;
