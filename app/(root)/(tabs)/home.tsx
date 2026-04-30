import React, { useMemo, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  FlatList, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '@/constants';
import InlineSkeleton from '@/components/InlineSkeleton';
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';

type ChildCard = {
  id: string;
  name: string;
  image: string;
  progress: number;
  insight: string;
};

const Home = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);
  const showInlineLoader = !isLoaded;
  
  
  const [isPremium] = useState(false);

  const childrenData: ChildCard[] = [
    { id: '1', name: 'Leo', image: 'https://randomuser.me/api/portraits/lego/1.jpg', progress: 85, insight: "Leo is excelling in Logic puzzles!" },
    { id: '2', name: 'Maya', image: 'https://randomuser.me/api/portraits/lego/5.jpg', progress: 62, insight: "Maya needs more practice with Phonetics." },
    { id: '3', name: 'Kaleb', image: 'https://randomuser.me/api/portraits/lego/3.jpg', progress: 40, insight: "Kaleb is showing interest in music." },
  ];

  const [selectedChild, setSelectedChild] = useState(childrenData[0]);
  const strings = useMemo(() => {
    const name = user?.firstName || 'Parent';
    return {
      hello: t(language, 'home_hello', { name }),
      manageProgress: t(language, 'home_manage_progress'),

      yourChildren: t(language, 'home_your_children'),
      total: t(language, 'home_total', { count: childrenData.length }),

      progressTitle: t(language, 'home_progress_title', { name: selectedChild.name }),
      badges: t(language, 'home_badges'),
      learning: t(language, 'home_learning'),

      aiInsights: t(language, 'home_ai_insights'),
      detailedReport: t(language, 'home_detailed_report'),
      unlockAiTitle: t(language, 'home_unlock_ai_title'),
      unlockAiSub: t(language, 'home_unlock_ai_sub', { name: selectedChild.name }),
      upgradePremium: t(language, 'home_upgrade_premium'),

      dailyTipTitle: t(language, 'home_daily_tip_title'),
      dailyTipText: t(language, 'home_daily_tip_text'),
    };
  }, [childrenData.length, language, selectedChild.name, user?.firstName]);

  return (
    <SafeAreaView style={styles.container}>
      
    
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            {showInlineLoader ? (
              <>
                <InlineSkeleton width={180} height={24} />
                <InlineSkeleton width={170} height={14} style={{ marginTop: 10 }} />
              </>
            ) : (
              <>
                <Text style={styles.headerTitle}>{strings.hello}</Text>
                <Text style={styles.subheader}>{strings.manageProgress}</Text>
              </>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            {showInlineLoader ? (
              <InlineSkeleton width={55} height={55} borderRadius={27.5} />
            ) : (
              <Image 
                source={user?.imageUrl ? { uri: user.imageUrl } : icons.person} 
                style={styles.avatar} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
             <Text style={styles.sectionLabel}>{strings.yourChildren}</Text>
             <Text style={styles.childCount}>{strings.total}</Text>
          </View>

          {showInlineLoader ? (
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.childTab}>
                  <InlineSkeleton width={68} height={68} borderRadius={34} />
                  <InlineSkeleton width={54} height={12} style={{ marginTop: 8 }} />
                </View>
              ))}
            </View>
          ) : (
            <FlatList 
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[...childrenData, { id: 'add-btn' as const }]} 
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                if (item.id === 'add-btn') {
                  return (
                    <TouchableOpacity 
                      style={styles.addChildBtn} 
                      onPress={() => router.push('/children')} 
                    >
                      <Text style={{ color: '#0286FF', fontSize: 28 }}>+</Text>
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity 
                    onPress={() => setSelectedChild(item as ChildCard)}
                    style={styles.childTab}
                  >
                    <Image 
                      source={{ uri: (item as ChildCard).image }} 
                      style={[
                        styles.childAvatar, 
                        selectedChild.id === item.id && styles.activeChildAvatar
                      ]} 
                    />
                    <Text style={[styles.childName, selectedChild.id === item.id && styles.activeChildName]}>
                      {(item as ChildCard).name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {/* 3. PROGRESS CARD */}
        <View style={styles.progressContainer}>
           <LinearGradient colors={['#2F2F42', '#1F1F39']} style={styles.progressCard}>
              {showInlineLoader ? (
                <>
                  <InlineSkeleton width={170} height={18} style={{ marginBottom: 16 }} />
                  <InlineSkeleton width="100%" height={10} borderRadius={5} />
                  <View style={styles.statsGrid}>
                    <View style={styles.smallStat}><InlineSkeleton width={40} height={18} /><InlineSkeleton width={55} height={10} style={{ marginTop: 8 }} /></View>
                    <View style={styles.smallStat}><InlineSkeleton width={40} height={18} /><InlineSkeleton width={55} height={10} style={{ marginTop: 8 }} /></View>
                  </View>
                </>
              ) : (
                <>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{strings.progressTitle}</Text>
                <Text style={styles.cardPercent}>{selectedChild.progress}%</Text>
              </View>
              
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${selectedChild.progress}%` }]} />
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.smallStat}>
                   <Text style={styles.statVal}>12</Text>
                   <Text style={styles.statKey}>{strings.badges}</Text>
                </View>
                <View style={styles.smallStat}>
                   <Text style={styles.statVal}>4h</Text>
                   <Text style={styles.statKey}>{strings.learning}</Text>
                </View>
              </View>
                </>
              )}
           </LinearGradient>
        </View>

        {/* 4. PREMIUM vs REGULAR SECTION */}
        <View style={styles.section}>
           <Text style={styles.sectionLabel}>{strings.aiInsights}</Text>
           {showInlineLoader ? (
             <View style={styles.lockedCard}>
               <InlineSkeleton width="70%" height={16} style={{ marginBottom: 12 }} />
               <InlineSkeleton width="100%" height={12} style={{ marginBottom: 8 }} />
               <InlineSkeleton width="88%" height={12} style={{ marginBottom: 16 }} />
               <InlineSkeleton width={140} height={40} borderRadius={14} />
             </View>
           ) : isPremium ? (
             <LinearGradient 
                colors={['#0286FF', '#003366']} 
                style={styles.insightCard}
              >
                <Text style={styles.insightText}>{"\""}{selectedChild.insight}{"\""}</Text>
                <TouchableOpacity style={styles.insightBtn}>
                   <Text style={styles.insightBtnText}>{strings.detailedReport}</Text>
                </TouchableOpacity>
             </LinearGradient>
           ) : (
             <View style={styles.lockedCard}>
                <View style={styles.lockedContent}>
                   <Text style={styles.lockedTitle}>{strings.unlockAiTitle}</Text>
                   <Text style={styles.lockedSub}>{strings.unlockAiSub}</Text>
                   <TouchableOpacity 
                    style={styles.upgradeBtn}
                    onPress={() => router.push('/(root)/(tabs)/sub')}
                   >
                      <Text style={styles.upgradeBtnText}>{strings.upgradePremium}</Text>
                   </TouchableOpacity>
                </View>
             </View>
           )}
        </View>

      
        <View style={styles.section}>
            <Text style={styles.sectionLabel}>{strings.dailyTipTitle}</Text>
            {showInlineLoader ? (
              <View style={styles.tipCard}>
                <InlineSkeleton width="100%" height={12} style={{ marginBottom: 8 }} />
                <InlineSkeleton width="85%" height={12} />
              </View>
            ) : (
              <View style={styles.tipCard}>
                  <Text style={styles.tipText}>{strings.dailyTipText}</Text>
              </View>
            )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1F1F39' },
  
 
  header: { 
    height: 140, 
    paddingHorizontal: 24, 
    paddingBottom: 20, 
    justifyContent: 'flex-end' 
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 26, fontFamily: 'Poppins-Bold', color: '#fff', letterSpacing: -0.5 },
  subheader: { fontSize: 15, color: '#9AA0C3', marginTop: 2 },
  avatar: { width: 55, height: 55, borderRadius: 27.5, borderWidth: 2, borderColor: '#0286FF' },
  
  section: { marginTop: 25, paddingHorizontal: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { color: '#fff', fontSize: 18, fontFamily: 'Poppins-Bold' },
  childCount: { color: '#9AA0C3', fontSize: 12 },
  
  childTab: { alignItems: 'center', marginRight: 18 },
  childAvatar: { width: 68, height: 68, borderRadius: 34, opacity: 0.4, borderWidth: 3, borderColor: 'transparent' },
  activeChildAvatar: { opacity: 1, borderColor: '#0286FF' },
  childName: { color: '#9AA0C3', marginTop: 8, fontSize: 13, fontFamily: 'Poppins-Medium' },
  activeChildName: { color: '#fff' },
  
  addChildBtn: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#26264A', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#0286FF' },
  
  progressContainer: { padding: 24 },
  progressCard: { padding: 22, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { color: '#fff', fontSize: 18, fontFamily: 'Poppins-Bold' },
  cardPercent: { color: '#0286FF', fontSize: 20, fontFamily: 'Poppins-Bold' },
  
  progressBarBg: { height: 10, backgroundColor: '#1F1F39', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0286FF', borderRadius: 5 },
  
  statsGrid: { flexDirection: 'row', marginTop: 22, gap: 15 },
  smallStat: { flex: 1, backgroundColor: '#26264A', padding: 14, borderRadius: 18, alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 18, fontFamily: 'Poppins-Bold' },
  statKey: { color: '#9AA0C3', fontSize: 11, textTransform: 'uppercase' },

 
  insightCard: { padding: 22, borderRadius: 24 },
  insightText: { color: '#fff', fontSize: 15, lineHeight: 24, fontFamily: 'Poppins-Medium' },
  insightBtn: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 15 },
  insightBtnText: { color: '#0286FF', fontFamily: 'Poppins-Bold', fontSize: 13 },

  lockedCard: { 
  backgroundColor: '#26264A', 
  borderRadius: 24, 
  padding: 22, 
  borderStyle: 'dashed', 
  borderWidth: 1, 
  borderColor: '#3D3D5C',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 3,
},

lockedContent: {
  alignItems: 'flex-start', 
},

lockedTitle: { 
  color: '#fff', 
  fontSize: 16, 
  fontFamily: 'Poppins-Bold' 
},

lockedSub: { 
  color: '#9AA0C3', 
  fontSize: 13, 
  marginTop: 5, 
  lineHeight: 18,
  fontFamily: 'Poppins-Regular'
},

upgradeBtn: { 
  backgroundColor: 'rgba(2, 134, 255, 0.1)', 
  borderWidth: 1, 
  borderColor: '#0286FF', 
  paddingVertical: 12, 
  paddingHorizontal: 20,
  borderRadius: 14, 
  marginTop: 15, 
  alignItems: 'center',
  justifyContent: 'center'
},

upgradeBtnText: { 
  color: '#0286FF', 
  fontFamily: 'Poppins-Bold',
  fontSize: 14
},
 

  tipCard: { backgroundColor: '#2F2F42', padding: 20, borderRadius: 20 },
  tipText: { color: '#BBB', fontSize: 14, lineHeight: 22 }
});

export default Home;