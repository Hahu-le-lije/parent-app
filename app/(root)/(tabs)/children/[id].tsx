import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  LayoutAnimation,


} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChildrenStore } from '@/store/childrenStore';

import Child2 from '@/components/Child2';
import { icons } from '@/constants';

const ChildDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const children = useChildrenStore((state) => state.children);
  
  const assignLastPurchasedToChild = useChildrenStore(
    (state) => state.assignLastPurchasedToChild,
  );
  const deleteChild = useChildrenStore((state) => state.deleteChild);

  const child = useMemo(
    () => children.find((c) => c._id === String(id)),
    [children, id],
  );

  // const handleAssignPlan = () => {
  //   if (!child) return;
  //   assignLastPurchasedToChild(child._id);
  // };

  // const handleDeleteChild = () => {
  //   if (!child) return;
  //   Alert.alert(
  //     'Delete child',
  //     `Are you sure you want to remove ${child.name}?`,
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: () => {
  //           deleteChild(child._id);
  //           router.replace('/(root)/(tabs)/children');
  //         },
  //       },
  //     ],
  //   );
  // };

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#3B82F6" />
  //       <Text style={styles.loadingText}>Loading child details...</Text>
  //     </SafeAreaView>
  //   );
  // }

  // if (!child) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <Text style={styles.errorTitle}>Child not found</Text>
  //       <Text style={styles.errorText}>
  //         Please go back to the children list and try again.
  //       </Text>
  //       <TouchableOpacity
  //         style={styles.backToListButton}
  //         onPress={() => router.replace('/(root)/(tabs)/children')}
  //       >
  //         <Text style={styles.backToListButtonText}>Back to Children</Text>
  //       </TouchableOpacity>
  //     </SafeAreaView>
  //   );
  // }

 

  const [open , setOpen] = React.useState(false);

  const skills = [
    { label: 'Reading', value: 82, color: '#3B82F6' },
    { label: 'Listening', value: 74, color: '#8B5CF6' },
    { label: 'Speaking', value: 68, color: '#EC4899' },
    { label: 'Writing', value: 90, color: '#10B981' },
  ];
    const strongest = skills.reduce((prev, curr) =>
  curr.value > prev.value ? curr : prev
);

const weakest = skills.reduce((prev, curr) =>
  curr.value < prev.value ? curr : prev
);
const weeks = [
  'This Week',
  'Last Week',
  '2 Weeks Ago',
  '3 Weeks Ago',
  '4 Weeks Ago',
];
// ===== WEEK DATA =====
const weekData = [
  { day: 'M', minutes: 20 },
  { day: 'T', minutes: 35 },
  { day: 'W', minutes: 15 },
  { day: 'T', minutes: 40 },
  { day: 'F', minutes: 25 },
  { day: 'S', minutes: 10 },
  { day: 'S', minutes: 30 },
];

const maxMinutes = Math.max(...weekData.map(item => item.minutes));
const totalMinutes = weekData.reduce((sum, item) => sum + item.minutes, 0);

const [selectedWeek, setSelectedWeek] = React.useState('This Week');
const [showWeekSelector, setShowWeekSelector] = React.useState(false);

  return (
   <SafeAreaView style={styles.container} edges={['top']}>
     <View style={styles.c3}>
            <TouchableOpacity onPress={()=>router.back()}>
                <View style={{width:40,height:40,justifyContent:"center",alignItems:"center",backgroundColor:"white",borderRadius:50}}>
                    <Image source={icons.backArrow} resizeMode='contain' style={{width:20,height:20}}/>
                </View>
            </TouchableOpacity>
            <Text style={{fontSize:20,color:"#fff",marginLeft:50,fontFamily:"Poppins-Bold"}}>
                Learning Progress
            </Text>
         
        </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
  showsVerticalScrollIndicator={false}
      >
        <View style={styles.childProfile}>
          <Child2 item={child!}/>
        </View>
        <View style={styles.ai}>
          <Text style={styles.aiTitle}>Insights About The child</Text>
          <TouchableOpacity
          onPress={()=>{
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setOpen(!open)
          }}
          activeOpacity={0.8}
          >
            <View style={styles.aiHeader}>
             
              <View style={styles.aitoggle}>
               <Text style={{fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#3B82F6',}}>{open===true ? 'Close' : 'Open'}</Text>
              </View>
             
            </View>
          </TouchableOpacity>
          {open && (
            <View style={styles.aiContent}>
              <Text style={styles.aiIntro}>
                Quick AI summary for {child?.name || 'this child'}:
              </Text>

              

              <Text style={styles.recommendation}>
                Suggestion:{'\n'}
                Focus more on {weakest.label.toLowerCase()} activities this week.{' '}
                Short 10–15 minute sessions combined with {strongest.label.toLowerCase()}{' '}
                tasks usually work best to keep {child?.name?.split(' ')[0] || 'them'} motivated.
              </Text>

             
              
            </View>
          )}
        </View>
        <View style={styles.statsContainer}>
          {[
            { label: 'Accuracy', value: '87%' },
            { label: 'Words Learned', value: '124' },
            { label: 'Sessions', value: '18' },
            { label: 'Completed Lessons', value: '9' },
          ].map((item, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.streak}>

          <Text style={{fontSize:13,fontFamily:"Poppins-SemiBold",color:"#D1D5DB"}}>💠 Days Streak</Text>
          <Text style={{fontSize:25,fontFamily:"Poppins-Bold",color:"white"}}>12</Text>
          <Text style={{fontSize:13,fontFamily:"Poppins-SemiBold",color:"#D1D5DB"}}>Personal Best: 20</Text>
        </View>
        <View style={styles.weekContainer}>
  <View style={styles.weekHeader}>
    <Text style={styles.sectionTitle}>Time Spent</Text>

    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => setShowWeekSelector(!showWeekSelector)}
    >
      <Text style={styles.dropdownText}>{selectedWeek}</Text>
    </TouchableOpacity>
  </View>

  {showWeekSelector && (
    <View style={styles.weekList}>
      {weeks.map((week, index) => (
        <TouchableOpacity
          key={index}
          style={styles.weekItem}
          onPress={() => {
            setSelectedWeek(week);
            setShowWeekSelector(false);
          }}
        >
          <Text style={styles.weekItemText}>{week}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}

 
  <Text style={styles.totalTime}>
    Total: {totalMinutes} minutes
  </Text>

 
  <View style={styles.chartContainer}>
    {weekData.map((item, index) => {
      const heightPercentage = (item.minutes / maxMinutes) * 120;

      return (
        <View key={index} style={styles.barWrapper}>
          <Text style={styles.barValue}>
            {item.minutes}m
          </Text>

          <View
            style={[
              styles.bar,
              { height: heightPercentage },
            ]}
          />

          <Text style={styles.barLabel}>{item.day}</Text>
        </View>
      );
    })}
  </View>
</View>

        <View style={styles.performanceContainer}>
  <Text style={styles.sectionTitle}>Performance by Category</Text>

  {skills.map((skill, index) => (
    <View key={index} style={{ marginTop: 14 }}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillLabel}>{skill.label}</Text>
        <Text style={styles.skillPercent}>{skill.value}%</Text>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${skill.value}%`,
              backgroundColor: skill.color,
            },
          ]}
        />
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
  weekList: {
  backgroundColor: '#1E1E38',
  borderRadius: 12,
  paddingVertical: 6,
  marginBottom: 12,
  marginTop: 6,

 

  elevation: 6,
},

weekItem: {
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderBottomWidth: 0.5,
  borderBottomColor: '#2F2F42',
},

weekItemText: {
  color: '#fff',
  fontSize: 14,
  fontFamily: 'Poppins-Regular',
},
  weekContainer: {
  width: '95%',
  alignSelf: 'center',
  marginTop: 20,
  backgroundColor: '#2F2F42',
  borderRadius: 12,
  padding: 16,
},

totalTime: {
  color: '#D1D5DB',
  fontSize: 13,
  fontFamily: 'Poppins-Regular',
  marginBottom: 12,
},

chartContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  height: 160,
},

barWrapper: {
  alignItems: 'center',
  flex: 1,
},

bar: {
  width: 16,
  backgroundColor: '#3B82F6',
  borderRadius: 8,
  marginBottom: 6,
},

barLabel: {
  fontSize: 12,
  color: '#D1D5DB',
  fontFamily: 'Poppins-Regular',
},

barValue: {
  fontSize: 12,
  color: '#fff',
  fontFamily: 'Poppins-Regular',
  marginBottom: 4,
},
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  childProfile:{
    width:"100%",
    display:"flex",
    alignItems:"center",
    marginTop:20
  },
   c3:{
        display:"flex",
        flexDirection:"row",
      
        
        alignItems:"center",
        justifyContent:"flex-start",
        paddingHorizontal:16,
        width:"100%",
        marginTop:20
        
    },
    ai:{
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    marginTop:20,
    width:"95%",
    marginHorizontal:10,
    opacity:0.9
    },
    aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  aiTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  aitoggle:{
    backgroundColor:"white",
    height:30,
    width:80,
    borderRadius:50,
    justifyContent:"center",
    alignItems:"center"
  },
  aiContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  aiIntro: {
    fontSize: 15,
    color: '#C7C7FF',
    marginBottom: 16,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },

  recommendation: {
    fontSize: 14.5,
    color: '#D0D0FF',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#1E1E38',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  
  streak:{
    backgroundColor:"#2F2F42",
    width:"95%",
    marginHorizontal:10,
    height:100,
    borderRadius:10,
    marginTop:20,
    display:"flex",
    alignItems:"flex-start",
    paddingLeft:20,
    justifyContent:"center",
    paddingBottom:20,
    paddingTop:20
  },
  statsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  width: '95%',
  alignSelf: 'center',
  marginTop: 20,
},
statBox: {
  width: '48%',
  backgroundColor: '#2F2F42',
  borderRadius: 12,
  paddingVertical: 16,
  paddingHorizontal: 12,
  marginBottom: 12,
},
statValue: {
  fontSize: 20,
  fontFamily: 'Poppins-Bold',
  color: '#fff',
},
statLabel: {
  fontSize: 13,
  fontFamily: 'Poppins-Regular',
  color: '#D1D5DB',
  marginTop: 4,
},
weekHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
},
sectionTitle: {
  fontSize: 16,
  fontFamily: 'Poppins-Bold',
  color: '#fff',
},
dropdown: {
  backgroundColor: '#3B82F6',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},
dropdownText: {
  color: '#fff',
  fontSize: 13,
  fontFamily: 'Poppins-Regular',
},
performanceContainer: {
  width: '95%',
  alignSelf: 'center',
  marginTop: 20,
  marginBottom: 30,
  backgroundColor: '#2F2F42',
  borderRadius: 12,
  padding: 16,
},
skillHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
},
skillLabel: {
  fontSize: 14,
  fontFamily: 'Poppins-SemiBold',
  color: '#fff',
},
skillPercent: {
  fontSize: 14,
  fontFamily: 'Poppins-Regular',
  color: '#D1D5DB',
},
progressBackground: {
  height: 10,
  backgroundColor: '#1E1E38',
  borderRadius: 8,
  overflow: 'hidden',
},
progressFill: {
  height: '100%',
  borderRadius: 8,
},
})