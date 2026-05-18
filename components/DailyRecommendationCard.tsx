import { formatShortDateTime } from "@/lib/formatLearning";
import { t } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n/types";
import type { Recommendation } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  language: AppLanguage;
  recommendation: Recommendation | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  upgradeHint?: string | null;
  onPressUpgrade?: () => void;
};

const DailyRecommendationCard = ({
  language,
  recommendation,
  loading,
  error,
  onRetry,
  upgradeHint,
  onPressUpgrade,
}: Props) => {
  const title = t(language, "home_daily_rec_card_title");
  const empty = t(language, "home_daily_rec_empty");
  const loadingLabel = t(language, "home_daily_rec_loading");
  const retry = t(language, "home_daily_rec_retry");

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={20} color="#10B981" />
          <Text style={styles.title}>{title}</Text>
        </View>
        {recommendation?.tier ? (
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{recommendation.tier}</Text>
          </View>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.centerBlock}>
          <ActivityIndicator color="#10B981" />
          <Text style={styles.muted}>{loadingLabel}</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.centerBlock}>
          <Ionicons name="alert-circle" size={22} color="#F87171" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>{retry}</Text>
          </TouchableOpacity>
          {upgradeHint && onPressUpgrade ? (
            <TouchableOpacity
              onPress={onPressUpgrade}
              style={styles.upgradeLink}
            >
              <Text style={styles.upgradeLinkText}>{upgradeHint}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {!loading && !error && recommendation?.recommendation_text ? (
        <View>
          <Text style={styles.body}>{recommendation.recommendation_text}</Text>
          <Text style={styles.meta}>
            {formatShortDateTime(recommendation.generated_at)}
          </Text>
        </View>
      ) : null}

      {!loading && !error && !recommendation?.recommendation_text ? (
        <View style={styles.rowMuted}>
          <Ionicons name="document-text-outline" size={20} color="#9AA0C3" />
          <Text style={styles.muted}>{empty}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default DailyRecommendationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  title: {
    color: "#10B981",
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },
  tierBadge: {
    backgroundColor: "rgba(2, 134, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    color: "#7DD3FC",
    fontSize: 11,
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
  },
  body: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Poppins-Regular",
  },
  meta: {
    marginTop: 10,
    color: "#9AA0C3",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  centerBlock: { alignItems: "center", gap: 10, paddingVertical: 8 },
  rowMuted: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  muted: {
    color: "#9AA0C3",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(248, 113, 113, 0.15)",
  },
  retryText: {
    color: "#FECACA",
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
  upgradeLink: { marginTop: 4 },
  upgradeLinkText: {
    color: "#0286FF",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
});
