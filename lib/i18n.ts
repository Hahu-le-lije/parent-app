import type { AppLanguage } from "@/store/languageStore";

type TranslationMap = Record<AppLanguage, Record<string, string>>;

const HOME_TRANSLATIONS: TranslationMap["en"] = {
  home_dashboardOverview: "Dashboard Overview",
  home_children: "Children",
  home_paid: "Paid",
  home_unpaid: "Unpaid",
  home_unpaidAlertTitle: "⚠ Unpaid subscriptions",
  home_unpaidAlertSub: "{count} children need premium access",
  home_view: "View",

  home_exploreTitle: "Explore",
  home_exploreSub: "Fun learning experiences",

  home_aiTitle: "AI Recommendations",
  home_aiSub: "Personalized for each child",

  home_quickActionsTitle: "Quick Actions",
  home_viewChildren: "View Children",
  home_addChild: "Add a Child",
  home_subscriptions: "Subscriptions",

  home_learningProgressTitle: "Learning Progress",
  home_learningProgressSub: "Track reading, listening, speaking, and writing",
};

const SETTINGS_TRANSLATIONS: TranslationMap["en"] = {
  settings_languageTitle: "Language",
  settings_languageSub: "Choose your preferred language",
  settings_english: "English",
  settings_amharic: "Amharic",
};

const FILTER_TRANSLATIONS: TranslationMap["en"] = {
  filter_daily: "Daily",
  filter_weekly: "Weekly",
  filter_monthly: "Monthly",
  filter_yearly: "Yearly",
};

const SKILL_TRANSLATIONS: TranslationMap["en"] = {
  skill_writing: "Writing",
  skill_speaking: "Speaking",
  skill_listening: "Listening",
  skill_reading: "Reading",
};

const COMMON_TRANSLATIONS: TranslationMap["en"] = {
  common_comingSoon: "Coming Soon",
  common_comingSoonWait: "Coming soon wait",
};

const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    ...HOME_TRANSLATIONS,
    ...SETTINGS_TRANSLATIONS,
    ...FILTER_TRANSLATIONS,
    ...SKILL_TRANSLATIONS,
    ...COMMON_TRANSLATIONS,
  },
  am: {
    home_dashboardOverview: "የዳሽቦርድ አጠቃላይ",
    home_children: "ልጆች",
    home_paid: "ክፍያ ያለው",
    home_unpaid: "ክፍያ ያልተፈጸመ",
    home_unpaidAlertTitle: "⚠ ያልተከፈሉ ንዑስ መዝገቦች",
    home_unpaidAlertSub: "{count} ልጆች ፕሪሚየም መዳረሻ ይፈልጋሉ።",
    home_view: "ይመልከቱ",

    home_exploreTitle: "ይመርምሩ",
    home_exploreSub: "ተደስታ የሚማሩ ልምዶች",

    home_aiTitle: "የAI ምክሮች",
    home_aiSub: "ለእያንዳንዱ ልጅ በተጠናቀቀ",

    home_quickActionsTitle: "ፈጣን እርምጃዎች",
    home_viewChildren: "ልጆቻችንን ይመልከቱ",
    home_addChild: "አዲስ ልጅ ጨምር",
    home_subscriptions: "አባልነት",

    home_learningProgressTitle: "የእድገት መለኪያ",
    home_learningProgressSub: "ንባብ፣ መስማት፣ መናገር እና መጻፍ ይከታተሉ",

    settings_languageTitle: "ቋንቋ",
    settings_languageSub: "በምትመርጡት ቋንቋ ይምረጡ",
    settings_english: "እንግሊዝኛ",
    settings_amharic: "አማርኛ",

    filter_daily: "በየቀኑ",
    filter_weekly: "በየሳምንቱ",
    filter_monthly: "በየወሩ",
    filter_yearly: "በየዓመቱ",

    skill_writing: "መጻፍ",
    skill_speaking: "መናገር",
    skill_listening: "መስማት",
    skill_reading: "ማንበብ",

    common_comingSoon: "በቅርቡ ይመጣል",
    common_comingSoonWait: "በቅርቡ ይጠብቁ...",
  },
};

export function t(
  lang: AppLanguage,
  key: string,
  params?: Record<string, string | number>
) {
  const str = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;

  if (!params) return str;

  return str.replace(/\{(\w+)\}/g, (_match, p1) => {
    const v = params[p1];
    return v === undefined ? `{${p1}}` : String(v);
  });
}

