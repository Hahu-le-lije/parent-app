import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChildrenStore } from '@/store/childrenStore';
import { Ionicons } from '@expo/vector-icons';
import Child2 from '@/components/Child2';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChildDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const children = useChildrenStore((state) => state.children);
  
  const child = useMemo(
    () => children.find((c) => c._id === String(id)),
    [children, id],
  );

  const [open, setOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const [showWeekSelector, setShowWeekSelector] = useState(false);

  const skills = [
    { label: 'Reading', value: 82, color: '#0286FF' },
    { label: 'Listening', value: 74, color: '#8B5CF6' },
    { label: 'Speaking', value: 68, color: '#EC4899' },
    { label: 'Writing', value: 90, color: '#10B981' },
  ];

  const strongest = skills.reduce((prev, curr) => curr.value > prev.value ? curr : prev);
  const weakest = skills.reduce((prev, curr) => curr.value < prev.value ? curr : prev);
  
  const weeks = ['This Week', 'Last Week', '2 Weeks Ago', '3 Weeks Ago'];
  const weekData = [
    { day: 'M', minutes: 20 }, { day: 'T', minutes: 35 }, { day: 'W', minutes: 15 },
    { day: 'T', minutes: 40 }, { day: 'F', minutes: 25 }, { day: 'S', minutes: 10 }, { day: 'S', minutes: 30 },
  ];

  const maxMinutes = Math.max(...weekData.map(item => item.minutes));
  const totalMinutes = weekData.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* CONSISTENT HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Learning Progress</Text>
          <Text style={styles.headerSubtitle}>Tracking {child?.name || 'Child'}'s growth</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.childProfile}>
          <Child2 item={child!} />
        </View>
        <View style={styles.credentialsCard}>
          <Text style={styles.cardLabel}>Child Account Access</Text>
          
          <View style={styles.credentialRow}>
            <View style={styles.credentialInfo}>
              <Text style={styles.credentialLabel}>Username</Text>
              <Text style={styles.credentialValue}>{child?.username || 'Not set'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.copyIcon} 
              onPress={() => copyToClipboard(child?.username || '')}
            >
              <Ionicons name="copy-outline" size={18} color="#0286FF" />
            </TouchableOpacity>
          </View>

          <View style={styles.credentialDivider} />

          <View style={styles.credentialRow}>
            <View style={styles.credentialInfo}>
              <Text style={styles.credentialLabel}>Password</Text>
              <Text style={styles.credentialValue}>••••••••</Text> 

            </View>
            <TouchableOpacity style={styles.copyIcon}>
              <Ionicons name="eye-outline" size={18} color="#9AA0C3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI INSIGHTS CARD */}
        <View style={[styles.aiCard, open && styles.aiCardExpanded]}>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setOpen(!open);
            }}
            activeOpacity={0.9}
            style={styles.aiHeader}
          >
            <View style={styles.aiTitleRow}>
              <Ionicons name="sparkles" size={20} color="#0286FF" />
              <Text style={styles.aiTitle}>AI Insights</Text>
            </View>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>{open ? 'Close' : 'View'}</Text>
            </View>
          </TouchableOpacity>

          {open && (
            <View style={styles.aiContent}>
              <Text style={styles.aiIntro}>Quick summary for {child?.name?.split(' ')[0]}:</Text>
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationText}>
                  <Text style={{ fontFamily: 'Poppins-Bold', color: '#10B981' }}>Suggestion: </Text>
                  Focus more on {weakest.label.toLowerCase()} activities. Short 10–15 min sessions with {strongest.label.toLowerCase()} tasks work best.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Accuracy', value: '87%', icon: 'checkmark-done' },
            { label: 'Words', value: '124', icon: 'book' },
            { label: 'Sessions', value: '18', icon: 'play' },
            { label: 'Lessons', value: '9', icon: 'trophy' },
          ].map((item, index) => (
            <View key={index} style={styles.statBox}>
              <Ionicons name={item.icon as any} size={16} color="#9AA0C3" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

     
        <View style={styles.streakCard}>
          <View>
            <Text style={styles.streakLabel}>💠 Day Streak</Text>
            <Text style={styles.streakValue}>12</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBest}>Best: 20</Text>
          </View>
        </View>

       
        <View style={styles.chartCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Time Spent</Text>
            <TouchableOpacity 
              style={styles.weekPicker} 
              onPress={() => setShowWeekSelector(!showWeekSelector)}
            >
              <Text style={styles.weekPickerText}>{selectedWeek}</Text>
              <Ionicons name="chevron-down" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          {showWeekSelector && (
            <View style={styles.dropdownMenu}>
              {weeks.map((w, i) => (
                <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => {
                  setSelectedWeek(w);
                  setShowWeekSelector(false);
                }}>
                  <Text style={styles.dropdownItemText}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.totalText}>Total: {totalMinutes} minutes</Text>

          <View style={styles.barChart}>
            {weekData.map((item, index) => {
              const barHeight = (item.minutes / maxMinutes) * 100;
              return (
                <View key={index} style={styles.barColumn}>
                  <Text style={styles.barValue}>{item.minutes}m</Text>
                  <View style={[styles.barBase, { height: barHeight + 20, backgroundColor: index === 3 ? '#0286FF' : '#3E3E66' }]} />
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* PERFORMANCE CATEGORIES */}
        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Skills Breakdown</Text>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillRow}>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.label}</Text>
                <Text style={styles.skillValue}>{skill.value}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${skill.value}%`, backgroundColor: skill.color }]} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChildDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1F1F39' },
  header: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 15 },
  backButton: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#26264A',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTextContainer: { marginBottom: 5 },
  headerTitle: { fontSize: 26, fontFamily: 'Poppins-Bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#9AA0C3' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  childProfile: { alignItems: 'center', marginVertical: 10,width:"100%" },
  
 
  aiCard: {
    backgroundColor: '#26264A', borderRadius: 22, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(2, 134, 255, 0.3)', overflow: 'hidden',
  },
  aiCardExpanded: { borderColor: '#0286FF' },
  aiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  aiTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#fff' },
  aiBadge: { backgroundColor: 'rgba(2, 134, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  aiBadgeText: { color: '#0286FF', fontSize: 12, fontFamily: 'Poppins-Bold' },
  aiContent: { paddingHorizontal: 18, paddingBottom: 18 },
  aiIntro: { fontSize: 13, color: '#9AA0C3', marginBottom: 10, fontFamily: 'Poppins-Regular' },
  recommendationBox: { backgroundColor: '#1E1E38', padding: 14, borderRadius: 14, borderLeftWidth: 3, borderLeftColor: '#10B981' },
  recommendationText: { fontSize: 13, color: '#BABBC9', lineHeight: 20, fontFamily: 'Poppins-Regular' },

  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  statBox: { width: '48%', backgroundColor: '#26264A', borderRadius: 18, padding: 16, marginBottom: 12 },
  statValue: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#fff' },
  statLabel: { fontSize: 12, fontFamily: 'Poppins-Regular', color: '#9AA0C3' },

 
  streakCard: {
    backgroundColor: '#26264A', borderRadius: 18, padding: 20, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  streakLabel: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#BABBC9' },
  streakValue: { fontSize: 32, fontFamily: 'Poppins-Bold', color: '#fff' },
  streakBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  streakBest: { color: '#9AA0C3', fontSize: 12, fontFamily: 'Poppins-Medium' },


  chartCard: { backgroundColor: '#26264A', borderRadius: 22, padding: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#fff' },
  weekPicker: { backgroundColor: '#0286FF', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  weekPickerText: { color: '#fff', fontSize: 12, fontFamily: 'Poppins-Bold' },
  totalText: { color: '#9AA0C3', fontSize: 13, marginBottom: 20 },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  barColumn: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 10, color: '#9AA0C3', marginBottom: 4 },
  barBase: { width: 14, borderRadius: 7, marginBottom: 6 },
  barLabel: { fontSize: 11, color: '#9AA0C3', fontFamily: 'Poppins-Medium' },
  dropdownMenu: { backgroundColor: '#1E1E38', borderRadius: 12, marginBottom: 15, padding: 4 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  dropdownItemText: { color: '#fff', fontSize: 13 },

  
  performanceCard: { backgroundColor: '#26264A', borderRadius: 22, padding: 20 },
  skillRow: { marginTop: 16 },
  skillInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  skillName: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#fff' },
  skillValue: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0286FF' },
  progressBarBg: { height: 8, backgroundColor: '#1E1E38', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },

  credentialsCard: {
    backgroundColor: '#26264A',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  cardLabel: {
    color: '#9AA0C3',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  credentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  credentialInfo: {
    flex: 1,
  },
  credentialLabel: {
    fontSize: 11,
    color: '#9AA0C3',
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  credentialValue: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  copyIcon: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  credentialDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 12,
  },
});