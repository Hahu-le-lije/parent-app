import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 



const About = () => {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>About Hahu</Text>
          <Text style={styles.headerSubtitle}>
            Learn more about the app and our mission
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
       
        <View style={styles.sectionCard}>
          <View style={styles.iconHeadingRow}>
             <Ionicons name="rocket-outline" size={20} color="#0286FF" />
             <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.sectionBody}>
            Hahu is built to make learning fun, engaging, and stress‑free for both children and
            parents. We combine playful experiences with meaningful progress tracking so you can see
            how your child is growing every day.
          </Text>
        </View>

        
        <View style={styles.sectionCard}>
          <View style={styles.iconHeadingRow}>
             <Ionicons name="list-outline" size={20} color="#0286FF" />
             <Text style={styles.sectionTitle}>What You Can Do</Text>
          </View>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Create and manage child profiles</Text>
            <Text style={styles.bulletItem}>• Track skills like reading and speaking</Text>
            <Text style={styles.bulletItem}>• Unlock premium AI recommendations</Text>
            <Text style={styles.bulletItem}>• Monitor daily learning streaks</Text>
          </View>
        </View>

       
        <View style={styles.sectionCard}>
          <View style={styles.iconHeadingRow}>
             <Ionicons name="shield-checkmark-outline" size={20} color="#0286FF" />
             <Text style={styles.sectionTitle}>Our Values</Text>
          </View>
          <Text style={styles.sectionBody}>
            We care about building a safe, inclusive, and motivating learning environment. Your
            data is handled responsibly, and every feature is designed to support positive learning
            habits.
          </Text>
        </View>

        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need Support?</Text>
          <Text style={styles.infoBody}>
            If something doesn't feel right or you have ideas to make Hahu better, we'd love to hear from you.
          </Text>
          <TouchableOpacity 
            style={styles.emailContainer}
            onPress={() => {/* Add Linking.openURL('mailto:support@hahu.app') */}}
          >
            <Text style={styles.infoBody}>
              Contact us at: <Text style={styles.highlight}>support@hahu.app</Text>
            </Text>
          </TouchableOpacity>
        </View>

      
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hahu App · v1.0.0</Text>
          <Text style={styles.footerTextMuted}>Made with care for curious minds.</Text>
        </View>
        
        
        <View style={{ height: 40 }} />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  sectionCard: {
    backgroundColor: '#26264A',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  iconHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#BABBC9',
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 5,
  },
  bulletItem: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#BABBC9',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: 'rgba(2, 134, 255, 0.05)',
    borderRadius: 22,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(2, 134, 255, 0.2)',
  },
  infoTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#BABBC9',
    lineHeight: 20,
  },
  emailContainer: {
    marginTop: 10,
  },
  highlight: {
    fontFamily: 'Poppins-Bold',
    color: '#0286FF',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#9AA0C3',
  },
  footerTextMuted: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#5F607E',
  },
});