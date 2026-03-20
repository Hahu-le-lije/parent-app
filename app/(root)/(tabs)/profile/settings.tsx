import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore, type AppLanguage } from "@/store/languageStore";
import { useRouter } from "expo-router";
import { t } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";

const LanguageOption = ({
  selected,
  onPress,
  label,
  icon,
}: {
  lang: AppLanguage;
  selected: boolean;
  onPress: () => void;
  label: string;
  icon: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.optionBtn, selected && styles.optionBtnSelected]}
      activeOpacity={0.8}
    >
      <Text style={styles.optionEmoji}>{icon}</Text>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark-circle" size={20} color="#0286FF" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );
};

const Settings = () => {
  const router = useRouter();
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
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Manage your app preferences and language
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{strings.languageTitle}</Text>
          
          <View style={styles.optionList}>
            <LanguageOption
              lang="en"
              selected={language === "en"}
              onPress={() => setLanguage("en")}
              label={strings.english}
              icon="🇺🇸"
            />
            
            <View style={styles.divider} />

            <LanguageOption
              lang="am"
              selected={language === "am"}
              onPress={() => setLanguage("am")}
              label={strings.amharic}
              icon="🇪🇹"
            />
          </View>
        </View>

        
        <View style={styles.footerHint}>
          <Ionicons name="information-circle-outline" size={16} color="#9AA0C3" />
          <Text style={styles.footerHintText}>
            {language === "am"
              ? "ቋንቋው ተቀይሯል፤ የHome ጽሑፍ ይለወጣል።"
              : "Language updated. Content will change automatically."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F39",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#26264A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTextContainer: {
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#9AA0C3",
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#26264A",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  cardLabel: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
  },
  optionList: {
    backgroundColor: "#1E1E38",
    borderRadius: 16,
    overflow: "hidden",
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  optionBtnSelected: {
    backgroundColor: "rgba(2, 134, 255, 0.08)",
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    color: "#BABBC9",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  checkIcon: {
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 16,
  },
  footerHint: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  footerHintText: {
    color: "#9AA0C3",
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    textAlign: "center",
  },
});