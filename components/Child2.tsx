import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable'; // Make sure it's imported like this (not destructured)
import { useChildrenStore } from "@/store/childrenStore";
import { useRouter } from 'expo-router';
type ChildProps = {
  item: {
    id: string;
    dob: Date;
    subscription: string;
    paid: boolean;
    avatar: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
  };
};

const Child2 = ({ item }: ChildProps) => {
  const { deleteChild } = useChildrenStore();
  const router = useRouter();
  if (!item) {
    return <View style={styles.container}><Text style={{ color: 'red' }}>Error: Child data not found</Text></View>;
  }
  

  const calculateAge = (dob: Date) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        if (!item?.id) return;
        Alert.alert(
          "Delete Child",
          "Are you sure you want to delete this child?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () =>{ deleteChild(item.id)
                router.push('/(root)/(tabs)/children')
              },
            },
          ]
        );
      }}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>   
      <Swipeable renderRightActions={renderRightActions}>
     
        <View style={styles.content}>
          <Image source={{ uri: item.avatar }} style={styles.imageH} />
          <View style={styles.main}>
            <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
            <Text style={styles.age}>Age: {calculateAge(item.dob)}</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.subscription}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  item.paid ? { backgroundColor: "#28a745" } : { backgroundColor: "#dc3545" },
                ]}
              >
                <Text style={styles.badgeText}>{item.paid ? "Paid" : "Unpaid"}</Text>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    </View>
  );
};

export default Child2;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#2F2F42",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden', 
  },
  content: {                 
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    minHeight: 150,          
  },
  imageH: {
    width: 120,
    height: 120,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#C4C4C4",
  },
  main: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 25,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  age: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#ddd",
    marginTop: 2,
  },
  badges: {
    flexDirection: "row",
    marginTop: 6,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 12,
    marginVertical: 8,
    marginRight: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});