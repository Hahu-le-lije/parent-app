import AppStateScreen from "@/components/AppStateScreen";
import Child from "@/components/Child";
import InlineSkeleton from "@/components/InlineSkeleton";
import StateMessage from "@/components/StateMessage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddChild from "@/components/AddChild";
import { t } from "@/lib/i18n";
import { useChildrenStore } from "@/store/childrenStore";
import { useLanguageStore } from "@/store/languageStore";
import { useAuth } from "@clerk/clerk-expo";
import Modal from "react-native-modal";
const Children = () => {
  const [filter, setFilter] = useState("All");
  const [showAddChild, setShowAddChild] = useState(false);
  const [search, setSearch] = useState("");
  const language = useLanguageStore((state) => state.language);
  const { getToken } = useAuth();

  const children = useChildrenStore((state) => state.children);
  const loading = useChildrenStore((state) => state.loading);
  const error = useChildrenStore((state) => state.error);
  const loadChildren = useChildrenStore((state) => state.loadChildren);

  useEffect(() => {
    const loadChildrenWithToken = async () => {
      if (!children.length && !loading && !error) {
        const token = await getToken();
        if (token) {
          loadChildren(token);
        }
      }
    };

    loadChildrenWithToken();
  }, [children.length, error, loading, loadChildren, getToken]);

  const filteredData = children.filter((child) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Paid" && child.paid) ||
      (filter === "Unpaid" && !child.paid);

    const matchesSearch = (child.firstname + " " + child.lastname)
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const showInlineLoader = loading && children.length > 0;
  const retryLoadChildren = async () => {
    const token = await getToken();
    if (token) {
      void loadChildren(token);
    }
  };

  const strings = useMemo(
    () => ({
      headerTitle: t(language, "children_headerTitle"),
      subheader: t(language, "children_subheader"),
      searchPlaceholder: t(language, "children_search_placeholder"),
      addTitle: t(language, "children_add_title"),
      addSub: t(language, "children_add_sub"),
      loadingTitle: t(language, "children_loading_title"),
      loadingSub: t(language, "children_loading_sub"),
      filterAll: t(language, "children_filter_all"),
      filterPaid: t(language, "children_filter_paid"),
      filterUnpaid: t(language, "children_filter_unpaid"),
    }),
    [language],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.headerTitle}</Text>
        <Text style={styles.subheader}>{strings.subheader}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder={strings.searchPlaceholder}
          placeholderTextColor="#999"
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
            colors={["#0286FF", "#005BB5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addChildGradient}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.addChildTitle}>{strings.addTitle}</Text>
              <Text style={styles.addChildSub} numberOfLines={1}>
                {strings.addSub}
              </Text>
            </View>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              }}
              style={styles.addChildImage}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {[
          { value: "All", label: strings.filterAll },
          { value: "Paid", label: strings.filterPaid },
          { value: "Unpaid", label: strings.filterUnpaid },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.filterButton,
              filter === item.value && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter(item.value)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item.value && styles.filterTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !children.length ? (
        <AppStateScreen
          title={strings.loadingTitle}
          subtitle={strings.loadingSub}
        />
      ) : (
        <>
          {error && !children.length ? (
            <View style={styles.stateWrap}>
              <StateMessage
                type="error"
                title="Children could not load"
                message={error}
                actionLabel="Try again"
                onAction={retryLoadChildren}
              />
            </View>
          ) : null}

          {showInlineLoader && (
            <View style={styles.inlineLoaderWrap}>
              <InlineSkeleton
                width={180}
                height={14}
                style={{ marginBottom: 14 }}
              />
              <InlineSkeleton
                width="100%"
                height={90}
                borderRadius={16}
                style={{ marginBottom: 12 }}
              />
              <InlineSkeleton width="100%" height={90} borderRadius={16} />
            </View>
          )}
          {!error || children.length ? (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => <Child item={item} />}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.stateWrap}>
                  <StateMessage
                    title={children.length ? "No matching children" : "No children yet"}
                    message={
                      children.length
                        ? "Try a different search or filter."
                        : "Add a child profile to start tracking learning progress."
                    }
                  />
                </View>
              }
              contentContainerStyle={{
                paddingBottom: 40,
                width: "100%",
                alignItems: "center",
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : null}
        </>
      )}

      <Modal
        isVisible={showAddChild}
        onBackdropPress={() => setShowAddChild(false)}
        onSwipeComplete={() => setShowAddChild(false)}
        swipeDirection="down"
        avoidKeyboard={true}
        propagateSwipe={true}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <AddChild onClose={() => setShowAddChild(false)} />
      </Modal>
    </SafeAreaView>
  );
};
export default Children;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F39",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  subheader: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#9AA0C3",
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
    overflow: "hidden",
  },
  addChildGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  addChildTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
  },
  addChildSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#e0e0e0",
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
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9AA0C3",
    fontFamily: "Poppins-Regular",
  },
  inlineLoaderWrap: {
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  stateWrap: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
});
