import React, { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const defaultFaqs = (language: string): FaqItem[] => [
  {
    id: '1',
    question: t(language, 'help_faq_1_q'),
    answer: t(language, 'help_faq_1_a'),
  },
  {
    id: '2',
    question: t(language, 'help_faq_2_q'),
    answer: t(language, 'help_faq_2_a'),
  },
  {
    id: '3',
    question: t(language, 'help_faq_3_q'),
    answer: t(language, 'help_faq_3_a'),
  },
  {
    id: '4',
    question: t(language, 'help_faq_4_q'),
    answer: t(language, 'help_faq_4_a'),
  },
];

const Help = () => {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const language = useLanguageStore((s) => s.language);
  const FAQS = defaultFaqs(language);

  const toggleItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  };

  const renderFaqItem = ({ item }: { item: FaqItem }) => {
    const isOpen = item.id === openId;

    return (
      <View style={styles.faqCard}>
        <TouchableOpacity
          onPress={() => toggleItem(item.id)}
          activeOpacity={0.7}
          style={styles.faqHeader}
        >
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={isOpen ? "#0286FF" : "#9CA3AF"} 
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.faqBodyWrapper}>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t(language, 'help_title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t(language, 'help_subtitle')}
          </Text>
        </View>
      </View>

      <FlatList
        data={FAQS}
        renderItem={renderFaqItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>{t(language, 'help_getting_started')}</Text>
              <Text style={styles.infoBody}>
                • {t(language, 'help_faq_1_q')}{'\n'}
                • {t(language, 'help_faq_2_q')}{'\n'}
                • {t(language, 'help_faq_3_q')}{'\n'}
                • {t(language, 'help_faq_4_q')}
              </Text>
            </View>
            <Text style={styles.sectionHeader}>{t(language, 'section_faqs') || 'Frequently Asked Questions'}</Text>
          </>
        }
        ListFooterComponent={
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>{t(language, 'help_still_need_help') || 'Still need help?'}</Text>
            <Text style={styles.contactBody}>
              {t(language, 'help_contact_body') || "Email our support team and we'll get back to you as soon as possible."}
            </Text>
            <TouchableOpacity style={styles.emailRow}>
               <Text style={styles.contactBody}>
                 {t(language, 'help_contact_label') || 'Email:'} <Text style={styles.contactHighlight}>{t(language, 'about_support_email')}</Text>
               </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
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
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9AA0C3',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 120, 
  },
  infoCard: {
    backgroundColor: '#26264A',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#BABBC9',
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  faqCard: {
    backgroundColor: '#26264A',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    paddingRight: 10,
  },
  faqBodyWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -5,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#BABBC9',
    lineHeight: 22,
  },
  contactCard: {
    marginTop: 20,
    borderRadius: 22,
    padding: 20,
    backgroundColor: 'rgba(2, 134, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(2, 134, 255, 0.2)',
  },
  contactTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  contactBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#BABBC9',
    lineHeight: 20,
  },
  emailRow: {
    marginTop: 10,
  },
  contactHighlight: {
    fontFamily: 'Poppins-Bold',
    color: '#0286FF',
  },
});