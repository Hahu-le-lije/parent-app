import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useRef, useEffect ,useState} from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import RenderChildProgress from '@/components/RenderChildProgress';
import RenderFeatureCard from '@/components/RenderFeatureCard';
import RenderRecommendation from '@/components/RenderRecommendation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const dashboardData = {
  totalChildren: 5,
  paid: 3,
  unpaid: 2,
  totalPayments: 2400,
  activeSubs: 3,
};

const features = [
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

const childrenData = [
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
    imageUri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
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
    imageUri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
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
    imageUri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
    recommendation: 'Challenge yourself with Science Experiments module.',
  },
];

const Home = () => {
  const { user } = useUser();
  const router = useRouter();
  const featureFlatListRef = useRef(null);
  const recommendationFlatListRef = useRef(null);
  const [timeFilter, setTimeFilter] = useState('weekly');

  const avatarSource = user?.imageUrl
    ? { uri: user.imageUrl }
    : icons.person;

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (featureFlatListRef.current) {
        currentIndex = (currentIndex + 1) % features.length;
        featureFlatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

 

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#0286FF', '#005BB5', '#003366']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.h2}>
          <View>
            <Text style={styles.headerTitle}>
              Hello, {user?.firstName || 'there'} 👋
            </Text>
            <Text style={styles.subheader}>Let the fun begin</Text>
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
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dashboardData.totalChildren}</Text>
              <Text style={styles.statLabel}>Children</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#28C76F' }]}>
              <Text style={styles.statNumber}>{dashboardData.paid}</Text>
              <Text style={styles.statLabel}>Paid</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#EA5455' }]}>
              <Text style={styles.statNumber}>{dashboardData.unpaid}</Text>
              <Text style={styles.statLabel}>Unpaid</Text>
            </View>
          </View>

          
          {dashboardData.unpaid > 0 && (
            <View style={styles.alertCard}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' }}
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>Unpaid subscriptions</Text>
                <Text style={styles.alertSub}>
                  {dashboardData.unpaid} children need payment for Premium features
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/children')}>
                <Text style={styles.payNow}>View</Text>
              </TouchableOpacity>
            </View>
          )}

          
          <Text style={styles.sectionTitle}>Hahu Lelje </Text>
          <FlatList
            ref={featureFlatListRef}
            data={features}
            renderItem={({ item }) => <RenderFeatureCard item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH - 40,
              offset: (SCREEN_WIDTH - 40) * index,
              index,
            })}
            snapToAlignment="center"
            decelerationRate="fast"
          />

          
          <Text style={styles.sectionTitle}>Children Achievements and Progress</Text>
          <FlatList
            data={childrenData}
            renderItem={(item)=><RenderChildProgress item={item} timeFilter={timeFilter} setTimeFilter={setTimeFilter}/>}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
          />

          
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <FlatList
            ref={recommendationFlatListRef}
            data={childrenData}
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
            contentContainerStyle={{ paddingHorizontal: 20, paddingRight: 20 }} 
          />
          <View style={{ height: 60 }} />
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

  // Alert Card
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

  
});