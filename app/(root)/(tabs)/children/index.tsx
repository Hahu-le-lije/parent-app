import { View, Text, StyleSheet, TouchableOpacity, FlatList,Dimensions, TextInput, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Child from '@/components/Child';

import { useChildrenStore } from '@/store/childrenStore';
import Modal from 'react-native-modal'
import AddChild from '@/components/AddChild';

const Children = () => {
  const [filter, setFilter] = useState("All"); 
  const [showAddChild, setShowAddChild] = useState(false);
  const [search,setSearch]=useState('')

  
  const children = useChildrenStore((state) => state.children);
  const loading = useChildrenStore((state) => state.loading);
  const loadChildren = useChildrenStore((state) => state.loadChildren);


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




  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your children</Text>
        <Text style={styles.subheader}>Manage profiles & progress</Text>
      </View>

    
      <View style={styles.searchContainer}>
        <TextInput
          placeholder='Search Child'
          placeholderTextColor='#999'
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

   
      <View style={styles.addChildSection}>
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
              <Text style={styles.addChildSub} numberOfLines={1}>
                Create profile & track progress
              </Text>
            </View>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png" }}
              style={styles.addChildImage}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {["All", "Paid", "Unpaid"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, filter === item && styles.filterButtonSelected]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      
      {loading && !children.length ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading children...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <Child item={item} />}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40, width:"100%",alignItems:"center" }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        isVisible={showAddChild}
        onBackdropPress={() => setShowAddChild(false)}
        onSwipeComplete={() => setShowAddChild(false)}
        swipeDirection="down"
        avoidKeyboard={true}
        propagateSwipe={true}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <AddChild />
      </Modal>
    </SafeAreaView>
  );
}
export default Children;
const {height}=Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  subheader: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9AA0C3',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#2A2A40",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  addChildSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  addChildCard: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  addChildGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  addChildTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
  addChildSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#e0e0e0',
    marginTop: 2,
  },
  addChildImage: {
    width: 45,
    height: 45,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#2A2A40",
    marginRight: 10,
    minWidth: 70,
    alignItems: "center",
  },
  filterButtonSelected: {
    backgroundColor: "#0286FF",
  },
  filterText: {
    color: "#9AA0C3",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  filterTextSelected: {
    color: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#9AA0C3',
    fontFamily: 'Poppins-Regular'
  }
});