import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList,Modal,Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Child from '@/components/Child';

const data = [
  {
    _id: "1",
    id: 1,
    name: "John Doe",
    age: 10,
    subscription: "Premium",
    paid: true,
    image: "https://randomuser.me/api/portraits/lego/1.jpg"
  },
  {
    _id: "2",
    id: 2,
    name: "Sophia Smith",
    age: 8,
    subscription: "Basic",
    paid: false,
    image: "https://randomuser.me/api/portraits/lego/2.jpg"
  },
  {
    _id: "3",
    id: 3,
    name: "Liam Johnson",
    age: 12,
    subscription: "Premium",
    paid: true,
    image: "https://randomuser.me/api/portraits/lego/3.jpg"
  },
  {
    _id: "4",
    id: 4,
    name: "Emma Williams",
    age: 9,
    subscription: "Standard",
    paid: true,
    image: "https://randomuser.me/api/portraits/lego/4.jpg"
  },
  {
    _id: "5",
    id: 5,
    name: "Noah Brown",
    age: 11,
    subscription: "Premium",
    paid: false,
    image: "https://randomuser.me/api/portraits/lego/5.jpg"
  }
];

const Children = () => {
  const { user } = useUser();
  const router = useRouter();
  const [filter, setFilter] = useState("All"); 
  const [showAddChild, setShowAddChild] = useState(false);

  const avatarSource = user?.imageUrl
    ? { uri: user.imageUrl }
    : icons.person;

  const filteredData = data.filter(child => {
    if (filter === "All") return true;
    if (filter === "Paid") return child.paid;
    if (filter === "Unpaid") return !child.paid;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <LinearGradient
          colors={['#0286FF', '#005BB5', '#003366']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.h2}>
          <View>
            <Text style={styles.headerTitle}>Your children</Text>
            <Text style={styles.subheader}>Manage Them</Text>
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

      
      <View style={styles.addChild}>
         <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => setShowAddChild(true)}
    style={styles.addChildCard}
  >
    <LinearGradient
      colors={['#0286FF', '#005BB5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.addChildGradient}
    >
      
      <View style={{ flex: 1 }}>
        <Text style={styles.addChildTitle}>Add a Child</Text>
        <Text style={styles.addChildSub}>
          Create profile, manage subscription & track progress
        </Text>
      </View>

    
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png" }}
        style={styles.addChildImage}
      />
    </LinearGradient>
  </TouchableOpacity>
        <Modal
        visible={showAddChild}
        animationType='slide'
        transparent
        onRequestClose={()=>setShowAddChild(false)}
        >

       
        <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
                <Text style={{fontFamily:"Poppins-Bold",fontSize:18,color:"white"}}>
                    Add New Child
                </Text>
                <TouchableOpacity onPress={()=>setShowAddChild(false)}>
                        <Text style={{color:"#0286FF",fontSize:16}}>Close</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sheetContent}>
        <Text style={{ color: "#fff" }}>Here goes your form inputs for child name, age, subscription, etc.</Text>
      </View>
        </View>
        </View>
        </Modal>

      </View>

      <Text style={{ fontSize: 20, fontFamily: "Poppins-Bold", marginTop: 20, color: "white" , marginLeft: 20,marginBottom: 10 }}>Registered Children</Text>
      <View style={styles.filterContainer}>
        
        {["All", "Paid", "Unpaid"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              filter === item && styles.filterButtonSelected
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextSelected
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <Child item={item} />}
        keyExtractor={(item) => item._id}
        style={{ width: "100%" }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}
      />
    </SafeAreaView>
  );
};

export default Children;
const {height}=Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
    width: "100%"
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
  
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
    marginHorizontal: 24,
    width: "90%",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#3F3F5F",
    marginRight: 8,
    height:32,
    width:100,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonSelected: {
    backgroundColor: "#0286FF",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  filterTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  addChildButton: {
    backgroundColor: "#0286FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start"
  },
  addChildButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    height: height * 0.75, 
    backgroundColor: "#2F2F42",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  sheetContent: {
    flex: 1,
    // add your form styling here
  },
  addChild:{
  paddingHorizontal:20,
  marginTop:20,
  marginBottom:10
},

addChildCard:{
  borderRadius:22,
  overflow:'hidden',
  elevation:8,
  shadowColor:'#000',
  shadowOpacity:0.3,
  shadowRadius:10,
  shadowOffset:{width:0,height:6}
},

addChildGradient:{
  flexDirection:'row',
  alignItems:'center',
  padding:20,
  borderRadius:22
},

addChildTitle:{
  fontFamily:'Poppins-Bold',
  fontSize:18,
  color:'#fff'
},

addChildSub:{
  fontFamily:'Poppins-Regular',
  fontSize:13,
  color:'#e0e0e0',
  marginTop:4,
  width:'85%'
},

addChildImage:{
  width:70,
  height:70,
  marginLeft:10
},

});
