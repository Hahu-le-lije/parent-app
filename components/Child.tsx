import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'


type ChildProps = {
  item: {
  id: string;
  dob: Date;
  subscription: string;
  paid: boolean;
  avatar: string;
  username: string;
  password:string
  firstname:string
  lastname:string
  }
}

const Child = ({ item }: ChildProps) => {
  const router = useRouter()

  const goToDetails = () => {
    router.push({
      pathname: '/(root)/(tabs)/children/[id]',
      params: { id: item.id },
    })
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


  return (
    <TouchableOpacity style={styles.container} onPress={goToDetails}>
     
      <Image
        resizeMode='cover'
        source={{ uri: item.avatar }}
        style={styles.imageH}
      />

    
      <View style={styles.main}>
        <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
        <Text style={styles.age}>Age: {calculateAge(item.dob)}</Text>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.subscription}</Text>
          </View>
          <View style={[styles.badge, item.paid ? { backgroundColor: "#28a745" } : { backgroundColor: "#dc3545" }]}>
            <Text style={styles.badgeText}>{item.paid ? "Paid" : "Unpaid"}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.arrow}>→</Text>
     
    </TouchableOpacity>
  )
}

export default Child


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "#2F2F42",
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageH: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#C4C4C4",
  },
  main: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  age: {
    fontSize: 14,
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
  arrow: {
  fontSize: 24,
  color: "#fff",
  marginLeft: 8,
}
})
