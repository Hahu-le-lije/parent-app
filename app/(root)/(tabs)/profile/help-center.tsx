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
import { Ionicons } from '@expo/vector-icons';


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
    answer: 'Go to the Children tab and tap on "Add a Child". Fill in the basic information such as name and age, then save the profile.',
  },
  {
    id: '2',
    question: 'How does progress tracking work?',
    answer: 'We track progress across key skills like reading, listening, speaking and writing. Every activity contributes to their growth.',
  },
  {
    id: '3',
    question: 'How do subscriptions work?',
    answer: 'Subscriptions unlock premium content. You can manage billing and see subscription status directly from your dashboard.',
  },
  {
    id: '4',
    question: 'I found a bug or error.',
    answer: 'Please send a description and screenshots to support@hahu.app so our team can investigate immediately.',
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
          <Text style={styles.headerTitle}>Help Center</Text>
          <Text style={styles.headerSubtitle}>
            Find quick answers or reach out for support
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
              <Text style={styles.infoTitle}>Getting Started</Text>
              <Text style={styles.infoBody}>
                • Create your account and sign in.{'\n'}
                • Add children from the Children tab.{'\n'}
                • Explore progress on your dashboard.{'\n'}
                • Upgrade to premium for full access.
              </Text>
            </View>
            <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
          </>
        }
        ListFooterComponent={
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactBody}>
              Email our support team and we'll get back to you as soon as possible.
            </Text>
            <TouchableOpacity style={styles.emailRow}>
               <Text style={styles.contactBody}>
                 Email: <Text style={styles.contactHighlight}>support@hahu.app</Text>
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