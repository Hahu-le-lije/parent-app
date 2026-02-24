import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const About = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>About Hahu</Text>
            <Text style={styles.headerSubtitle}>
              Learn more about the app and our mission
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionBody}>
            Hahu is built to make learning fun, engaging, and stress‑free for both children and
            parents. We combine playful experiences with meaningful progress tracking so you can see
            how your child is growing every day.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>What You Can Do</Text>
          <Text style={styles.sectionBody}>
            - Create and manage child profiles{'\n'}
            - Track skills like reading, listening, speaking, and writing{'\n'}
            - Unlock premium content with subscriptions{'\n'}
            - Get AI‑powered recommendations tailored to each child
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <Text style={styles.sectionBody}>
            We care about building a safe, inclusive, and motivating learning environment. Your
            data is handled responsibly, and every feature is designed to support positive learning
            habits rather than screen overload.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need Support?</Text>
          <Text style={styles.infoBody}>
            If something doesn&apos;t feel right or you have ideas to make Hahu better, we&apos;d
            love to hear from you.
          </Text>
          <Text style={styles.infoBody}>
            Contact us at: <Text style={styles.highlight}>support@hahu.app</Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hahu App · v1.0.0</Text>
          <Text style={styles.footerTextMuted}>Made with care for curious minds.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#26264A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#D1D5DB',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#26264A',
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: 6,
  },
  infoBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#E5E7EB',
    lineHeight: 20,
  },
  highlight: {
    fontFamily: 'Poppins-SemiBold',
    color: '#60A5FA',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#9CA3AF',
  },
  footerTextMuted: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
});


