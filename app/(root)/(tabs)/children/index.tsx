import { View, Text, StyleSheet, TouchableOpacity, FlatList,Dimensions, TextInput, Image, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Child from '@/components/Child';
import InputField from '@/components/InputField';
import { useChildrenStore } from '@/store/childrenStore';
import Modal from 'react-native-modal'
import AddChild from '@/components/AddChild';

const Children = () => {
  const [filter, setFilter] = useState("All"); 
  const [showAddChild, setShowAddChild] = useState(false);
  const [search,setSearch]=useState('')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [subscriptionType, setSubscriptionType] = useState<string>('Basic')
  const [isPaid, setIsPaid] = useState<boolean>(true)

  
  const children = useChildrenStore((state) => state.children);
  const loading = useChildrenStore((state) => state.loading);
  const loadChildren = useChildrenStore((state) => state.loadChildren);
  const addChild = useChildrenStore((state) => state.addChild);

useEffect(() => {
  if (!children.length && !loading) {
    loadChildren();
  }
}, [children.length, loading, loadChildren]);

const filteredData = children.filter(child => {
  const matchesFilter =
    filter === "All" ||
    (filter === "Paid" && child.paid) ||
    (filter === "Unpaid" && !child.paid);

  const matchesSearch = child.name
    .toLowerCase()
    .includes(search.toLowerCase());

  return matchesFilter && matchesSearch;
});

  const isFormValid = childName.trim().length > 0 && Number(childAge) > 0;

  const handleSaveChild = () => {
    if (!isFormValid) return;

    addChild({
      name: childName.trim(),
      age: Number(childAge),
      subscription: subscriptionType,
      paid: isPaid,
      image: "https://randomuser.me/api/portraits/lego/6.jpg",
    });

    setShowAddChild(false);
    setChildName('');
    setChildAge('');
    setSubscriptionType('Basic');
    setIsPaid(true);
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
       
        <View style={styles.h2}>
          <View>
            <Text style={styles.headerTitle}>Your children</Text>
            <Text style={styles.subheader}>Manage Them</Text>
          </View>
        </View>
      </View>

      <View>
        <TextInput
          placeholder='Search Child'
          placeholderTextColor='#999'
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
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
          isVisible={showAddChild}
         onBackdropPress={()=>setShowAddChild(false)}
        onSwipeComplete={()=>setShowAddChild(false)}
        swipeDirection="down"
        avoidKeyboard={true}
        propagateSwipe={true}
          style={{justifyContent: 'flex-end', margin: 0}}
        >
        <View style={styles.modalOverlay}>
          <AddChild/>
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

      
      {loading && !children.length ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>Loading children...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <Child item={item} />}
          keyExtractor={(item) => item._id}
          style={{ width: "100%" }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}
        />
      )}
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
    backgroundColor: "#2F2F42",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    minHeight: height * 0.75
  },
  bottomSheet: {
    height: height * 0.75, 
    backgroundColor: "#2F2F42",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
 
  sheetContent: {
    flex: 1,
    
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
searchContainer: {
  paddingHorizontal: 20,
  marginTop: 10,
},

searchInput: {
  backgroundColor: "#2A2A40",
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: "#fff",
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  width:"90%",
  marginLeft:20
},
modalLabel: {
  marginTop: 16,
  marginBottom: 8,
  color: "#E5E7EB",
  fontFamily: "Poppins-Medium",
  fontSize: 14,
},
chipRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 8,
},
chip: {
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 16,
  backgroundColor: "#3F3F5F",
},
chipActive: {
  backgroundColor: "#0286FF",
},
chipText: {
  color: "#E5E7EB",
  fontFamily: "Poppins-Regular",
  fontSize: 13,
},
chipTextActive: {
  color: "#FFFFFF",
  fontFamily: "Poppins-SemiBold",
},
saveChildBtn: {
  marginTop: 20,
  backgroundColor: "#0286FF",
  paddingVertical: 14,
  borderRadius: 18,
  alignItems: "center",
},
saveChildBtnDisabled: {
  backgroundColor: "#3F3F5F",
},
saveChildText: {
  color: "#FFFFFF",
  fontFamily: "Poppins-Bold",
  fontSize: 15,
},
});
