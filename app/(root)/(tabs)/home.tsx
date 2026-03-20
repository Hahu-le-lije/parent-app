import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import RenderChildProgress from '@/components/RenderChildProgress';
import RenderFeatureCard from '@/components/RenderFeatureCard';
import RenderRecommendation from '@/components/RenderRecommendation';
import { useChildrenStore } from '@/store/childrenStore';
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const fallbackDashboardData = {
  totalChildren: 5,
  paid: 3,
  unpaid: 2,
  totalPayments: 2400,
  activeSubs: 3,
};

const fallbackFeatures = [
  {
    id: '1',
    title: 'Discover New Games',
    description: 'Explore exciting educational games for kids!',
    imageUri: 'https://cdn-icons-png.flaticon.com/512/2920/2920308.png',
  },
  {
    id: '2',
    title: 'Learn Features',
    description: 'Master the app with interactive tutorials.',
    imageUri: 'https://cdn-icons-png.flaticon.com/512/2920/2920308.png',
  },
  {
    id: '3',
    title: 'Fun Activities',
    description: 'Engage in creative and learning activities.',
    imageUri: 'https://cdn-icons-png.flaticon.com/512/2920/2920308.png',
  },
];

const fallbackChildrenData = [
  {
    id: '1',
    name: 'Child 1',
    achievements: 10,
    progress: {
      writing: 80,
      speaking: 70,
      listening: 90,
      reading: 85,
    },
    imageUri: 'https://randomuser.me/api/portraits/lego/1.jpg',
    recommendation: 'Try the new Math Puzzle game to boost skills!',
  },
  {
    id: '2',
    name: 'Child 2',
    achievements: 8,
    progress: {
      writing: 60,
      speaking: 75,
      listening: 65,
      reading: 80,
    },
    imageUri: 'https://randomuser.me/api/portraits/lego/2.jpg',
    recommendation: 'Explore Reading Adventures for better comprehension.',
  },
  {
    id: '3',
    name: 'Child 3',
    achievements: 12,
    progress: {
      writing: 90,
      speaking: 85,
      listening: 95,
      reading: 90,
    },
    imageUri: 'https://randomuser.me/api/portraits/lego/3.jpg',
    recommendation: 'Challenge yourself with Science Experiments module.',
  },
];

const Home = () => {
  const { user } = useUser();
  const router = useRouter();
  const featureFlatListRef = useRef<FlatList<any> | null>(null);
  const recommendationFlatListRef = useRef<FlatList<any> | null>(null);
  const [timeFilter, setTimeFilter] = useState('weekly');

  const language = useLanguageStore((s) => s.language);
  const hydrateLanguage = useLanguageStore((s) => s.hydrateLanguage);

  const { children, loading, loadChildren } = useChildrenStore();

  const avatarSource = user?.imageUrl
    ? { uri: user.imageUrl }
    : icons.person;

  useEffect(() => {
    hydrateLanguage();
  }, [hydrateLanguage]);

  useEffect(() => {
    if (!children.length && !loading) loadChildren();
  }, [children.length, loading, loadChildren]);

  const features = useMemo(() => {
    if (language === 'am') {
      return [
        {
          id: '1',
          title: 'አዳዲስ ጨዋታዎችን ይቃኙ',
          description: 'ለልጆች ተደስታ የሚማሩ ጨዋታዎችን ይፈልጉ!',
          imageUri: fallbackFeatures[0].imageUri,
        },
        {
          id: '2',
          title: 'የመማር ክፍሎች',
          description: 'በተግባራዊ ትምህርቶች አፕን ይማሩ።',
          imageUri: fallbackFeatures[1].imageUri,
        },
        {
          id: '3',
          title: 'ተደስታ እንቅስቃሴዎች',
          description: 'በፈጠራ እና ትምህርት ተግባራት ይሳተፉ።',
          imageUri: fallbackFeatures[2].imageUri,
        },
      ];
    }

    return [...fallbackFeatures];
  }, [language]);

  const childProgressItems = useMemo(() => {
    if (!children.length) return fallbackChildrenData;

    const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

    const toRecommendation = (childName: string, idx: number) => {
      const nameFirst = childName?.split(' ')[0] || childName || 'your child';
      const enTemplates = [
        'Try the Math Puzzle game to boost {name} skills!',
        'Explore Reading Adventures to improve {name} comprehension.',
        'Challenge {name} with Science Experiments!',
      ];
      const amTemplates = [
        '{name} ክህሎትን ለማጠናከር የሒሳብ ፓዝል ጨዋታን ይሞክሩ!',
        'ለተሻለ መረዳት የንባብ ጀብዱዎችን ይፈልጉ ለ{name}።',
        '{name} እንዲበረታ ከሳይንስ ሙከራዎች ጋር ይፈታተኑ!',
      ];

      const template = (language === 'am' ? amTemplates : enTemplates)[idx % 3];
      return template.replace('{name}', nameFirst);
    };

    return children.map((child, idx) => {
      const base = child.paid ? 70 : 48;
      const writing = clamp(base + (child.age % 12) * 2 + (child.paid ? 8 : -4));
      const speaking = clamp(base - 10 + (child.age % 9) * 3);
      const listening = clamp(base + 4 + (child.age % 10) * 2);
      const reading = clamp(base - 6 + (child.age % 11) * 3);
      const achievements = clamp(6 + (child.age % 10) + (child.paid ? 6 : 1));

      return {
        id: child._id,
        name: child.name,
        achievements,
        progress: { writing, speaking, listening, reading },
        imageUri: child.image,
        recommendation: toRecommendation(child.name, idx),
      };
    });
  }, [children, language]);

  const recommendations = useMemo(() => {
    return childProgressItems.map((c) => ({
      id: c.id,
      name: c.name,
      recommendation: c.recommendation,
    }));
  }, [childProgressItems]);

  const dashboardData = useMemo(() => {
    const hasChildren = children.length > 0;
    const totalChildren = hasChildren
      ? children.length
      : fallbackDashboardData.totalChildren;
    const paid = hasChildren
      ? children.filter((c) => c.paid).length
      : fallbackDashboardData.paid;
    const unpaid = hasChildren
      ? children.filter((c) => !c.paid).length
      : fallbackDashboardData.unpaid;
    return { totalChildren, paid, unpaid };
  }, [children]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (featureFlatListRef.current && features.length) {
        currentIndex = (currentIndex + 1) % features.length;
        featureFlatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

 

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
    
        <View style={styles.h2}>
          <View>
            <Text style={styles.headerTitle}>
              Hello, {user?.firstName || 'there'} 👋
            </Text>
            <Text style={styles.subheader}>Manage your child&apos;s progress</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/profile')}>
            <Image
              source={avatarSource}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
       <View style={styles.innerContent}>

          {/* DASHBOARD OVERVIEW */}
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardTitle}>
              {t(language, "home_dashboardOverview")}
            </Text>

            <View style={styles.statsRow}>
              <View
                style={[styles.statCardModern, { backgroundColor: "#5A9CFF" }]}
              >
                <Text style={styles.statNumber}>{dashboardData.totalChildren}</Text>
                <Text style={styles.statLabel}>{t(language, "home_children")}</Text>
              </View>

              <View
                style={[styles.statCardModern, { backgroundColor: "#28C76F" }]}
              >
                <Text style={styles.statNumber}>{dashboardData.paid}</Text>
                <Text style={styles.statLabel}>{t(language, "home_paid")}</Text>
              </View>

              <View
                style={[styles.statCardModern, { backgroundColor: "#EA5455" }]}
              >
                <Text style={styles.statNumber}>{dashboardData.unpaid}</Text>
                <Text style={styles.statLabel}>{t(language, "home_unpaid")}</Text>
              </View>
            </View>
          </View>

          {/* PAYMENT ALERT */}
          {dashboardData.unpaid > 0 && (
            <View style={styles.alertModern}>
              <View style={styles.alertLeft}>
                <Text style={styles.alertTitle}>
                  {t(language, "home_unpaidAlertTitle")}
                </Text>
                <Text style={styles.alertSub}>
                  {t(language, "home_unpaidAlertSub", {
                    count: dashboardData.unpaid,
                  })}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.alertBtn}
                onPress={() => router.push("/children")}
              >
                <Text style={styles.alertBtnText}>{t(language, "home_view")}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* QUICK ACTIONS */}
          <View style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>
              {t(language, "home_quickActionsTitle")}
            </Text>

            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={() => router.push("/children")}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#0286FF", "#005BB5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickActionGradient}
                >
                  <Text style={styles.quickActionText}>
                    {t(language, "home_viewChildren")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={() => router.push("/sub")}
                activeOpacity={0.9}
              >
                <View style={[styles.quickActionGradient, styles.quickActionGradientAlt]}>
                  <Text style={styles.quickActionText}>
                    {t(language, "home_subscriptions")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.quickActionWideBtn}
              onPress={() => router.push("/children")}
              activeOpacity={0.9}
            >
              <View style={styles.quickActionWideInner}>
                <Text style={styles.quickActionWideText}>
                  {t(language, "home_addChild")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* LEARNING PROGRESS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t(language, "home_learningProgressTitle")}</Text>
            <Text style={styles.sectionSub}>
              {t(language, "home_learningProgressSub")}
            </Text>
          </View>

          {loading && !children.length ? (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#0286FF" />
              <Text style={styles.loadingText}>Loading children...</Text>
            </View>
          ) : (
            <View>
              {childProgressItems.slice(0, 2).map((item) => (
                <RenderChildProgress
                  key={item.id}
                  item={item}
                  timeFilter={timeFilter}
                  setTimeFilter={setTimeFilter}
                />
              ))}
            </View>
          )}

          {/* FEATURES */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t(language, "home_exploreTitle")}</Text>
            <Text style={styles.sectionSub}>{t(language, "home_exploreSub")}</Text>
          </View>

          <FlatList
            ref={featureFlatListRef}
            data={features}
            renderItem={({ item }) => <RenderFeatureCard item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH - 40,
              offset: (SCREEN_WIDTH - 40) * index,
              index,
            })}
            snapToAlignment="center"
            decelerationRate="fast"
          />

          {/* RECOMMENDATIONS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t(language, "home_aiTitle")}</Text>
            <Text style={styles.sectionSub}>{t(language, "home_aiSub")}</Text>
          </View>

          <FlatList
            ref={recommendationFlatListRef}
            data={recommendations}
            renderItem={({ item }) => <RenderRecommendation item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            getItemLayout={(data, index) => ({
              length: 240 + 16,
              offset: (240 + 16) * index,
              index,
            })}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 4 }}
          />

          <View style={{ height: 100 }} />
</View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  header: {
    height: 160,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    opacity: 0.9,
    letterSpacing: -0.3,
  },
  h2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#e0e0e0',
  },

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContent: {
    padding: 20,
    paddingTop: 10,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0286FF',
    marginHorizontal: 6,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    opacity: 0.9,
  },


  alertCard: {
    backgroundColor: '#2A2A4A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  alertTitle: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  alertSub: {
    color: '#bbb',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  payNow: {
    color: '#0286FF',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  carousel: {
    marginBottom: 32,
  },
  dashboardCard: {
  backgroundColor: '#26264A',
  borderRadius: 22,
  padding: 18,
  marginBottom: 22,
},

dashboardTitle: {
  color: '#fff',
  fontSize: 18,
  fontFamily: 'Poppins-Bold',
  marginBottom: 14,
},

statCardModern: {
  flex: 1,
  marginHorizontal: 6,
  borderRadius: 16,
  paddingVertical: 18,
  alignItems: 'center',

  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 5,
},

alertModern: {
  backgroundColor: '#2A2A4A',
  borderRadius: 18,
  padding: 18,
  marginBottom: 26,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

alertLeft: {
  flex: 1,
},

alertBtn: {
  backgroundColor: '#0286FF',
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 12,
},

alertBtnText: {
  color: '#fff',
  fontFamily: 'Poppins-Bold',
},

sectionHeader: {
  marginBottom: 12,
  marginTop: 8,
},

sectionSub: {
  color: '#9AA0C3',
  fontSize: 13,
  fontFamily: 'Poppins-Regular',
  marginTop: -4,
  marginBottom: 8,
},

  quickActionsCard: {
    backgroundColor: '#26264A',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },

  quickActionsTitle: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },

  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 12,
  },

  quickActionBtn: {
    flex: 1,
  },

  quickActionGradient: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionGradientAlt: {
    backgroundColor: '#3A5F6B',
  },

  quickActionText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
  },

  quickActionWideBtn: {
    width: '100%',
  },

  quickActionWideInner: {
    borderRadius: 16,
    backgroundColor: '#1E1E38',
    borderWidth: 1,
    borderColor: 'rgba(2,134,255,0.6)',
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionWideText: {
    color: '#0286FF',
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
  },

  loadingArea: {
    backgroundColor: '#26264A',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  loadingText: {
    marginTop: 10,
    color: '#9AA0C3',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },

});