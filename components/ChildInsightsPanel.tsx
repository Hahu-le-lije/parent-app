import { formatOptionalDateTime, formatRatioAsPercent } from "@/lib/formatLearning";
import { t } from "@/lib/i18n";
import { useLanguageStore } from "@/store/languageStore";
import { useRecommendationStore } from "@/store/analysisStore";
import type { RecommendationHistoryItem } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

type ChildInsightsPanelProps = {
  childId: string;
  token: string;
};

function sortHistoryNewestFirst(
  items: RecommendationHistoryItem[],
): RecommendationHistoryItem[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime(),
  );
}

const DashboardStatCard = ({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: IoniconsName;
  accent: string;
}) => (
  <View style={[styles.statCard, { borderColor: `${accent}44` }]}>
    <View style={[styles.statIconWrap, { backgroundColor: `${accent}22` }]}>
      <Ionicons name={icon} size={22} color={accent} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ChildInsightsPanel = ({ childId, token }: ChildInsightsPanelProps) => {
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  const {
    recommendation,
    history,
    dashboard,
    loadingRecommendation,
    loadingHistory,
    loadingDashboard,
    recommendationError,
    historyError,
    historyPremiumLocked,
    dashboardError,
    loadChildInsights,
    fetchRecommendation,
    fetchHistory,
    fetchDashboardStatus,
  } = useRecommendationStore();

  useEffect(() => {
    if (!childId || !token) {
      return;
    }
    void loadChildInsights(childId, token);
  }, [childId, token, loadChildInsights]);

  const sortedHistory = useMemo(
    () => sortHistoryNewestFirst(history?.history ?? []),
    [history],
  );

  const strings = useMemo(
    () => ({
      latestTitle: t(language, "children_insight_latest_title"),
      historyTitle: t(language, "children_insight_history_title"),
      dashboardTitle: t(language, "children_insight_dashboard_title"),
      nextUpdate: t(language, "children_insight_next_update"),
      tier: t(language, "children_insight_tier"),
      emptyHistory: t(language, "children_insight_history_empty"),
      viewPlans: t(language, "children_insight_view_plans"),
      retry: t(language, "children_insight_retry"),
      health: t(language, "children_insight_dash_health"),
      timeToday: t(language, "children_insight_dash_time_today"),
      weeklyAcc: t(language, "children_insight_dash_weekly_acc"),
      consistency: t(language, "children_insight_dash_consistency"),
    }),
    [language],
  );

  const dashboardCards = useMemo(() => {
    const d = dashboard;
    if (!d) {
      return null;
    }
    const minutes =
      d.time_spent_today_minutes == null || Number.isNaN(d.time_spent_today_minutes)
        ? "—"
        : `${Math.max(0, Math.round(d.time_spent_today_minutes))}m`;
    return (
      <View style={styles.dashboardGrid}>
        <DashboardStatCard
          label={strings.health}
          value={d.learning_health_score}
          icon="heart"
          accent="#34D399"
        />
        <DashboardStatCard
          label={strings.timeToday}
          value={minutes}
          icon="time"
          accent="#38BDF8"
        />
        <DashboardStatCard
          label={strings.weeklyAcc}
          value={formatRatioAsPercent(d.weekly_accuracy)}
          icon="analytics"
          accent="#FBBF24"
        />
        <DashboardStatCard
          label={strings.consistency}
          value={d.consistency_status}
          icon="pulse"
          accent="#A78BFA"
        />
      </View>
    );
  }, [dashboard, strings]);

  const renderLatestRecommendation = () => {
    if (loadingRecommendation) {
      return (
        <View style={styles.blockPad}>
          <ActivityIndicator color="#0286FF" />
        </View>
      );
    }
    if (recommendationError) {
      return (
        <View style={styles.blockPad}>
          <Text style={styles.error}>{recommendationError}</Text>
          <TouchableOpacity
            onPress={() => void fetchRecommendation(childId, token)}
            style={styles.retryBtn}
          >
            <Text style={styles.retryText}>{strings.retry}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!recommendation?.recommendation_text) {
      return (
        <Text style={styles.muted}>
          {t(language, "children_insight_no_recommendation")}
        </Text>
      );
    }
    const next = formatOptionalDateTime(
      recommendation.next_update_expected_at,
    );
    return (
      <View style={styles.latestCard}>
        <Text style={styles.latestBody}>
          {recommendation.recommendation_text}
        </Text>
        <View style={styles.latestMetaRow}>
          <Text style={styles.meta}>
            {formatOptionalDateTime(recommendation.generated_at) ?? ""}
          </Text>
          {recommendation.tier ? (
            <View style={styles.tierPill}>
              <Text style={styles.tierPillText}>
                {strings.tier}: {recommendation.tier}
              </Text>
            </View>
          ) : null}
        </View>
        {next ? (
          <Text style={styles.nextUpdate}>
            {strings.nextUpdate}: {next}
          </Text>
        ) : null}
      </View>
    );
  };

  const renderHistory = () => {
    if (loadingHistory) {
      return (
        <View style={styles.blockPad}>
          <ActivityIndicator color="#0286FF" />
        </View>
      );
    }
    if (historyPremiumLocked) {
      return (
        <View style={styles.premiumCard}>
          <Ionicons name="lock-closed" size={22} color="#9AA0C3" />
          <Text style={styles.premiumText}>
            {historyError ?? t(language, "children_insight_history_premium")}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/sub")}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>{strings.viewPlans}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (historyError) {
      return (
        <View style={styles.blockPad}>
          <Text style={styles.error}>{historyError}</Text>
          <TouchableOpacity
            onPress={() => void fetchHistory(childId, token)}
            style={styles.retryBtn}
          >
            <Text style={styles.retryText}>{strings.retry}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (sortedHistory.length === 0) {
      return <Text style={styles.muted}>{strings.emptyHistory}</Text>;
    }
    return (
      <View style={styles.historyList}>
        {sortedHistory.map((item, index) => (
          <View
            key={`${item.generated_at}-${index}`}
            style={styles.historyCard}
          >
            <Text style={styles.historyDate}>
              {formatOptionalDateTime(item.generated_at) ?? ""}
            </Text>
            <Text style={styles.historyText}>{item.recommendation_text}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDashboard = () => {
    if (loadingDashboard) {
      return (
        <View style={styles.blockPad}>
          <ActivityIndicator color="#0286FF" />
        </View>
      );
    }
    if (dashboardError) {
      return (
        <View style={styles.blockPad}>
          <Text style={styles.error}>{dashboardError}</Text>
          <TouchableOpacity
            onPress={() => void fetchDashboardStatus(childId, token)}
            style={styles.retryBtn}
          >
            <Text style={styles.retryText}>{strings.retry}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!dashboard) {
      return (
        <Text style={styles.muted}>
          {t(language, "children_insight_dashboard_empty")}
        </Text>
      );
    }
    return dashboardCards;
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>{strings.latestTitle}</Text>
      {renderLatestRecommendation()}

      <Text style={[styles.sectionTitle, styles.sectionSpacer]}>
        {strings.historyTitle}
      </Text>
      {renderHistory()}

      <Text style={[styles.sectionTitle, styles.sectionSpacer]}>
        {strings.dashboardTitle}
      </Text>
      {renderDashboard()}
    </View>
  );
};

export default ChildInsightsPanel;

const styles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 12,
  },
  sectionSpacer: { marginTop: 28 },
  blockPad: { paddingVertical: 12, alignItems: "center", gap: 8 },
  latestCard: {
    backgroundColor: "#26264A",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(2, 134, 255, 0.25)",
  },
  latestBody: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Poppins-Regular",
  },
  latestMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  meta: {
    color: "#9AA0C3",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  tierPill: {
    backgroundColor: "rgba(2, 134, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tierPillText: {
    color: "#7DD3FC",
    fontSize: 11,
    fontFamily: "Poppins-Bold",
  },
  nextUpdate: {
    marginTop: 10,
    color: "#9AA0C3",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  muted: {
    color: "#9AA0C3",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },
  error: {
    color: "#FCA5A5",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  retryBtn: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(248, 113, 113, 0.12)",
  },
  retryText: {
    color: "#FECACA",
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
  premiumCard: {
    backgroundColor: "#26264A",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    gap: 10,
  },
  premiumText: {
    color: "#9AA0C3",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  primaryBtn: {
    marginTop: 4,
    backgroundColor: "#0286FF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 13,
  },
  historyList: { gap: 12 },
  historyCard: {
    backgroundColor: "#26264A",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  historyDate: {
    color: "#9AA0C3",
    fontSize: 11,
    marginBottom: 6,
    fontFamily: "Poppins-Regular",
  },
  historyText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
  },
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#26264A",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Poppins-Bold",
  },
  statLabel: {
    color: "#9AA0C3",
    fontSize: 11,
    marginTop: 4,
    fontFamily: "Poppins-Regular",
  },
});
