import ChildProfile from "@/components/ChildProfile";
import ChildProgress from "@/components/ChildProgress";
import { useChildrenStore } from "@/store/childrenStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { useAuth } from "@clerk/clerk-expo";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubjectToggle from "@/components/SubjectToggle";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChildDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const children = useChildrenStore((state) => state.children);
  const [tok, setTok] = React.useState<string>('');
  const { getToken } = useAuth();
   useEffect(() => {
    const getter = async () => {
      try {
        const token = await getToken();
        setTok(token ?? "");
        console.log("token:", token);
      } catch (error) {
        console.log("Error getting token:", error);
      }
    };
  
    getter();
  }, []);

  const child = useMemo(
    () => children.find((c) => c.id === String(id)),
    [children, id],
  );



  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Learning Progress</Text>
          <Text style={styles.headerSubtitle}>
            Tracking {child?.firstname + " " + child?.lastname || "Child"}{"'s"}
            growth
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ChildProfile {...child!} />
        <ChildProgress childId={child!.id} token={tok} />
       <SubjectToggle childId={child!.id} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChildDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F1F39" },
  header: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 15 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#26264A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  headerTextContainer: { marginBottom: 5 },
  headerTitle: { fontSize: 26, fontFamily: "Poppins-Bold", color: "#fff" },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#9AA0C3",
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },

  
 
});
