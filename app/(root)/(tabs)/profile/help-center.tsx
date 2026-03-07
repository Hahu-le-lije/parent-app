import React, { useState } from 'react';
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'How do I add a child?',
    answer:
      'Go to the Children tab and tap on "Add a Child". Fill in the basic information such as name, age and subscription type, then save the profile.',
  },
  {
    id: '2',
    question: 'How does progress tracking work?',
    answer:
      'We track progress across key skills like reading, listening, speaking and writing. Each activity your child completes contributes to their overall progress in these areas.',
  },
  {
    id: '3',
    question: 'How do subscriptions and payments work?',
    answer:
      'Subscriptions unlock premium content and features for your child. You can see which children are paid or unpaid from your dashboard and manage billing from your account settings.',
  },
  {
    id: '4',
    question: 'I found a bug or something looks wrong.',
    answer:
      'We appreciate you taking the time to report issues. Please send a short description and screenshots (if possible) to support@hahu.app so we can investigate quickly.',
  },
];

const Help = () => {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

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
          activeOpacity={0.8}
          style={styles.faqHeader}
        >
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Text style={styles.faqToggle}>{isOpen ? '−' : '+'}</Text>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Help Center</Text>
            <Text style={styles.headerSubtitle}>
              Find quick answers or reach out for support
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={FAQS}
        renderItem={renderFaqItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
 
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Getting Started</Text>
              <Text style={styles.infoBody}>
                1. Create your account and sign in.{'\n'}
                2. Add your children from the Children tab.{'\n'}
                3. Explore the Home dashboard to see progress and recommendations.{'\n'}
                4. Upgrade to premium to unlock all features.
              </Text>
            </View>
            <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
          </>
        }
        ListFooterComponent={
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactBody}>
              Our team is here to support you. Reach out any time and we&apos;ll get back to you as
              soon as possible.
            </Text>
            <Text style={styles.contactBody}>
              Email: <Text style={styles.contactHighlight}>support@hahu.app</Text>
            </Text>
          </View>
        }
       
        ListFooterComponentStyle={{ paddingBottom: Platform.select({ ios: 80, android: 100 }) }}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.select({
      ios: 120,   
      android: 100, 
    }),
  },
  header: {
    height: 150,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#111827',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  backIcon: {
    color: '#F9FAFB',
    fontSize: 18,
    marginTop: -1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#E5E7EB',
    opacity: 0.9,
  },
  scroll: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#26264A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#D1D5DB',
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#E5E7EB',
    marginBottom: 10,
  },
  faqCard: {
    backgroundColor: '#26264A',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginRight: 8,
  },
  faqToggle: {
    fontSize: 22,
    color: '#9CA3AF',
    width: 22,
    textAlign: 'center',
  },
  faqBodyWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#D1D5DB',
    lineHeight: 20,
  },
  contactCard: {
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#26264A',
  },
  contactTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: 6,
  },
  contactBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#E5E7EB',
    lineHeight: 20,
  },
  contactHighlight: {
    fontFamily: 'Poppins-SemiBold',
    color: '#60A5FA',
  },
});
