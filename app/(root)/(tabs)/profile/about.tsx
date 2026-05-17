import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 



const About = () => {
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

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
          <Text style={styles.headerTitle}>{t(language, 'about_title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t(language, 'about_subtitle')}
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
             <Text style={styles.sectionTitle}>{t(language, 'about_our_mission')}</Text>
          </View>
          <Text style={styles.sectionBody}>{t(language, 'about_our_mission_body')}</Text>
        </View>

        
        <View style={styles.sectionCard}>
          <View style={styles.iconHeadingRow}>
             <Ionicons name="list-outline" size={20} color="#0286FF" />
             <Text style={styles.sectionTitle}>{t(language, 'about_what_you_can_do')}</Text>
          </View>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• {t(language, 'about_bullet_create')}</Text>
            <Text style={styles.bulletItem}>• {t(language, 'about_bullet_track')}</Text>
            <Text style={styles.bulletItem}>• {t(language, 'about_bullet_unlock')}</Text>
            <Text style={styles.bulletItem}>• {t(language, 'about_bullet_monitor')}</Text>
          </View>
        </View>

       
        <View style={styles.sectionCard}>
          <View style={styles.iconHeadingRow}>
             <Ionicons name="shield-checkmark-outline" size={20} color="#0286FF" />
             <Text style={styles.sectionTitle}>{t(language, 'about_our_values')}</Text>
          </View>
          <Text style={styles.sectionBody}>{t(language, 'about_values_body')}</Text>
        </View>

        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t(language, 'about_need_support')}</Text>
          <Text style={styles.infoBody}>
            {t(language, 'about_need_support_body')}
          </Text>
          <TouchableOpacity 
            style={styles.emailContainer}
            onPress={() => {/* Add Linking.openURL('mailto:support@hahu.app') */}}
          >
            <Text style={styles.infoBody}>
              {t(language, 'about_contact')} <Text style={styles.highlight}>{t(language, 'about_support_email')}</Text>
            </Text>
          </TouchableOpacity>
        </View>

      
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t(language, 'about_footer_text')}</Text>
          <Text style={styles.footerTextMuted}>{t(language, 'about_footer_muted')}</Text>
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