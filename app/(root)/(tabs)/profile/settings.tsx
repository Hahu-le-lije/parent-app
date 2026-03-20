import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore, type AppLanguage } from "@/store/languageStore";
import { t } from "@/lib/i18n";

const LanguageOption = ({
  lang,
  selected,
  onPress,
  label,
}: {
  lang: AppLanguage;
  selected: boolean;
  onPress: () => void;
  label: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.optionBtn, selected && styles.optionBtnSelected]}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const Settings = () => {
  const language = useLanguageStore((s) => s.language);
  const hydrateLanguage = useLanguageStore((s) => s.hydrateLanguage);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  useEffect(() => {
    hydrateLanguage();
  }, [hydrateLanguage]);

  const strings = useMemo(() => {
    return {
      languageTitle: t(language, "settings_languageTitle"),
      languageSub: t(language, "settings_languageSub"),
      english: t(language, "settings_english"),
      amharic: t(language, "settings_amharic"),
    };
  }, [language]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{strings.languageTitle}</Text>
          <Text style={styles.cardSub}>{strings.languageSub}</Text>

          <View style={styles.optionRow}>
            <LanguageOption
              lang="en"
              selected={language === "en"}
              onPress={() => setLanguage("en")}
              label={strings.english}
            />
            <LanguageOption
              lang="am"
              selected={language === "am"}
              onPress={() => setLanguage("am")}
              label={strings.amharic}
            />
          </View>
        </View>

        <View style={styles.footerHint}>
          <Text style={styles.footerHintText}>
            {language === "am"
              ? "ቋንቋው ተቀይሯል፤ የHome ጽሑፍ ይለወጣል።"
              : "Language updated. Home text will change automatically."}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F39",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#26264A",
    borderRadius: 18,
    padding: 18,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
  },
  cardSub: {
    color: "#9AA0C3",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
    lineHeight: 18,
  },
  optionRow: {
    flexDirection: "row",
    gap: 12,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: "#1E1E38",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  optionBtnSelected: {
    backgroundColor: "rgba(2,134,255,0.20)",
    borderColor: "#0286FF",
  },
  optionText: {
    color: "#E5E7EB",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#fff",
  },
  footerHint: {
    marginTop: 16,
    alignItems: "center",
  },
  footerHintText: {
    color: "#9AA0C3",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});