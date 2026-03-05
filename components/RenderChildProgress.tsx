import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const RenderChildProgress = ({ item, timeFilter, setTimeFilter }) => {
  const router = useRouter();

  const animValues = {
    writing: useRef(new Animated.Value(0)).current,
    speaking: useRef(new Animated.Value(0)).current,
    listening: useRef(new Animated.Value(0)).current,
    reading: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    Object.keys(item.progress).forEach((skill) => {
      animValues[skill].setValue(0);

      Animated.timing(animValues[skill], {
        toValue: item.progress[skill],
        duration: 900,
        useNativeDriver: false,
      }).start();
    });
  }, [timeFilter]);

  const colorMap = {
    writing: "#DA121A",
    speaking: "#B58A00",
    listening: "#078930",
    reading: "#FCD116",
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => Alert.alert("coming soon wait")}
    >
      <Image source={{ uri: item.imageUri }} style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.badge}>{item.achievements} achievements</Text>
        </View>

        <View style={styles.filterRow}>
          {["daily", "weekly", "monthly", "yearly"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setTimeFilter(filter)}
              style={[
                styles.filterBtn,
                timeFilter === filter && styles.filterActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  timeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.grid}>
          {Object.entries(item.progress).map(([skill, value]) => {
            const animatedWidth = animValues[skill].interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            });

            return (
              <View key={skill} style={styles.skillCard}>
                <Text style={styles.skillTitle}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </Text>

                <View style={styles.barBg}>
                  <Animated.View
                    style={[
                      styles.barFill,
                      {
                        width: animatedWidth,
                        backgroundColor: colorMap[skill],
                      },
                    ]}
                  />
                </View>

                <Animated.Text style={styles.percent}>
                  {animValues[skill].interpolate({
                    inputRange: [0, value],
                    outputRange: ["0%", `${value}%`],
                  })}
                </Animated.Text>
              </View>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderChildProgress;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#14261A",
    borderRadius: 26,
    padding: 20,
    flexDirection: "row",
    marginBottom: 22,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,

    borderWidth: 1,
    borderColor: "#3F5A3B",
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 18,
    borderWidth: 3,
    borderColor: "#FCD116",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },

  badge: {
    backgroundColor: "#213523",
    color: "#FCD116",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },

  filterRow: {
    flexDirection: "row",
    backgroundColor: "#203322",
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },

  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },

  filterActive: {
    backgroundColor: "#078930",
  },

  filterText: {
    color: "#aaa",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },

  filterTextActive: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },

  /* GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  skillCard: {
    width: "48%",
    backgroundColor: "#1D3020",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  skillTitle: {
    color: "#FFF7D8",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },

  barBg: {
    height: 8,
    backgroundColor: "#2B472E",
    borderRadius: 10,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 10,
  },

  percent: {
    color: "#D6D7BA",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins-Medium",
  },
});
