import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const dashboardData={
  totalChildren: 5,
  paid:3,
  unpaid:2,
  totalPayments:2400,
  activeSubs:3
}

const Home = () => {
  const { user } = useUser();
  const router = useRouter();

  
  const avatarSource = user?.imageUrl
    ? { uri: user.imageUrl }
    : icons.person;

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboardData.totalChildren}</Text>
            <Text style={styles.statLabel}>Children</Text>
          </View>
      <View style={[styles.statCard,{backgroundColor:'#28C76F'}]}>
      <Text style={styles.statNumber}>{dashboardData.paid}</Text>
      <Text style={styles.statLabel}>Paid</Text>
        </View>
      <View style={[styles.statCard,{backgroundColor:'#EA5455'}]}>
      <Text style={styles.statNumber}>{dashboardData.unpaid}</Text>
      <Text style={styles.statLabel}>Unpaid</Text>
    </View>
        </View>
      {dashboardData.unpaid > 0 && (
    <View style={styles.alertCard}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png" }}
        style={{ width: 40, height: 40, marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.alertTitle}>Unpaid subscriptions</Text>
        <Text style={styles.alertSub}>
          {dashboardData.unpaid} children need payment for Premium features
        </Text>
      </View>

      <TouchableOpacity onPress={()=>router.push('/children')}>
        <Text style={styles.payNow}>View</Text>
      </TouchableOpacity>
    </View>
  )}
   <Text style={styles.sectionTitle}>Quick Actions</Text>
   <View style={styles.actionsRow}>
    
    <TouchableOpacity style={styles.actionBtn}
      onPress={()=>router.push('/children')}>
      <Image source={{uri:"https://cdn-icons-png.flaticon.com/512/4140/4140048.png"}} style={styles.actionIcon}/>
      <Text style={styles.actionText}>Children</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionBtn}>
      <Image source={{uri:"https://cdn-icons-png.flaticon.com/512/2331/2331943.png"}} style={styles.actionIcon}/>
      <Text style={styles.actionText}>Payments</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionBtn}>
      <Image source={{uri:"https://cdn-icons-png.flaticon.com/512/1828/1828919.png"}} style={styles.actionIcon}/>
      <Text style={styles.actionText}>Analytics</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionBtn}>
      <Image source={{uri:"https://cdn-icons-png.flaticon.com/512/992/992651.png"}} style={styles.actionIcon}/>
      <Text style={styles.actionText}>Add Child</Text>
    </TouchableOpacity>

  </View>

      </View>

    
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
  content:{
  padding:20,
  marginTop:10
},

statsRow:{
  flexDirection:'row',
  justifyContent:'space-between',
  marginBottom:20
},

statCard:{
  flex:1,
  backgroundColor:'#0286FF',
  marginHorizontal:5,
  borderRadius:18,
  padding:18,
  alignItems:'center'
},

statNumber:{
  color:'#fff',
  fontSize:22,
  fontFamily:'Poppins-Bold'
},

statLabel:{
  color:'#fff',
  fontSize:13,
  fontFamily:'Poppins-Regular',
  opacity:0.9
},

alertCard:{
  backgroundColor:'#2A2A4A',
  borderRadius:16,
  padding:16,
  flexDirection:'row',
  alignItems:'center',
  marginBottom:20
},

alertTitle:{
  color:'#fff',
  fontFamily:'Poppins-Bold',
  fontSize:15
},

alertSub:{
  color:'#bbb',
  fontSize:12,
  fontFamily:'Poppins-Regular'
},

payNow:{
  color:'#0286FF',
  fontFamily:'Poppins-Bold'
},

sectionTitle:{
  color:'#fff',
  fontSize:18,
  fontFamily:'Poppins-Bold',
  marginBottom:12
},

actionsRow:{
  flexDirection:'row',
  flexWrap:'wrap',
  justifyContent:'space-between'
},

actionBtn:{
  width:'47%',
  backgroundColor:'#2A2A4A',
  borderRadius:18,
  padding:18,
  marginBottom:14,
  alignItems:'center'
},

actionIcon:{
  width:40,
  height:40,
  marginBottom:8
},

actionText:{
  color:'#fff',
  fontFamily:'Poppins-SemiBold'
},

});