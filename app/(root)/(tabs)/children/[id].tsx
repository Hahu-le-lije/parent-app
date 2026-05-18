import ChildInsightsPanel from "@/components/ChildInsightsPanel";
import ChildProfile from "@/components/ChildProfile";
import ChildProgress from "@/components/ChildProgress";
import StateMessage from "@/components/StateMessage";
import SubjectToggle from "@/components/SubjectToggle";
import { useChildrenStore } from "@/store/childrenStore";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const childrenLoading = useChildrenStore((state) => state.loading);
  const childrenError = useChildrenStore((state) => state.error);
  const loadChildren = useChildrenStore((state) => state.loadChildren);
  const [tok, setTok] = React.useState<string>("");
  const { getToken } = useAuth();

  const child = useMemo(
    () => children.find((c) => c.id === String(id)),
    [children, id],
  );

  useEffect(() => {
    const getter = async () => {
      try {
        const token = await getToken();
        setTok(token ?? "");
      } catch {
        setTok("");
      }
    };

    void getter();
  }, [getToken]);

  useEffect(() => {
    if (!tok || child) {
      return;
    }
    if (!childrenLoading && !childrenError && children.length === 0) {
      void loadChildren(tok);
    }
  }, [tok, child, childrenError, childrenLoading, children.length, loadChildren]);

  if (!child) {
    const retryLoad = () => {
      if (tok) {
        void loadChildren(tok);
      }
    };

    if (!tok || childrenLoading) {
      return (
        <SafeAreaView style={styles.container} edges={["top"]}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0286FF" />
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <StateMessage
            type={childrenError ? "error" : "empty"}
            title={childrenError ? "Child profile could not load" : "Child not found"}
            message={
              childrenError ??
              "This profile may have been removed or is still syncing."
            }
            actionLabel={childrenError ? "Try again" : undefined}
            onAction={childrenError ? retryLoad : undefined}
          />
        </View>
      </SafeAreaView>
    );
  }

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
            Tracking {child.firstname} {child.lastname}
            {"'s"} growth
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ChildProfile {...child} />
        <ChildInsightsPanel childId={child.id} token={tok} />
        <ChildProgress childId={child.id} token={tok} />
        <SubjectToggle childId={child.id} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChildDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F1F39" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
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
