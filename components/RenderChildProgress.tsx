import { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';

const RenderChildProgress = ({ item, timeFilter, setTimeFilter }) => {
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  type SkillKey = "writing" | "speaking" | "listening" | "reading";
  type FilterKey = "daily" | "weekly" | "monthly" | "yearly";
  const FILTERS: readonly FilterKey[] = ["daily", "weekly", "monthly", "yearly"];

  const animValues = {
    writing: useRef(new Animated.Value(0)).current,
    speaking: useRef(new Animated.Value(0)).current,
    listening: useRef(new Animated.Value(0)).current,
    reading: useRef(new Animated.Value(0)).current,
  } as Record<SkillKey, Animated.Value>;

  
  useEffect(() => {
    Object.keys(item.progress).forEach((skill) => {
      const skillKey = skill as SkillKey;
      animValues[skillKey].setValue(0);

      Animated.timing(animValues[skillKey], {
        toValue: item.progress[skillKey],
        duration: 900,
        useNativeDriver: false,
      }).start();
    });
  }, [timeFilter]);

  const filterLabels = useMemo(() => {
    return {
      daily: t(language, 'filter_daily'),
      weekly: t(language, 'filter_weekly'),
      monthly: t(language, 'filter_monthly'),
      yearly: t(language, 'filter_yearly'),
    } as Record<FilterKey, string>;
  }, [language]);

  const skillLabels = useMemo(() => {
    return {
      writing: t(language, 'skill_writing'),
      speaking: t(language, 'skill_speaking'),
      listening: t(language, 'skill_listening'),
      reading: t(language, 'skill_reading'),
    } as Record<SkillKey, string>;
  }, [language]);

  const colorMap: Record<SkillKey, string> = {
    writing: '#FF6B6B',
    speaking: '#4ECDC4',
    listening: '#5A9CFF',
    reading: '#A66BFF',
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => Alert.alert(t(language, 'common_comingSoon'), t(language, 'common_comingSoonWait'))}
    >
      
      <Image source={{ uri: item.imageUri }} style={styles.avatar} />

      <View style={{ flex: 1 }}>
       
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.badge}>{item.achievements} achievements</Text>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => (
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
                {filterLabels[filter]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.grid}>
          {Object.entries(item.progress).map(([skill, value]) => {
            const skillKey = skill as SkillKey;
            const animatedWidth = animValues[skillKey].interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            });

            return (
              <View key={skill} style={styles.skillCard}>
                <Text style={styles.skillTitle}>
                  {skillLabels[skillKey]}
                </Text>

                <View style={styles.barBg}>
                  <Animated.View
                    style={[
                      styles.barFill,
                      {
                        width: animatedWidth,
                        backgroundColor: colorMap[skillKey],
                      },
                    ]}
                  />
                </View>

                <Animated.Text style={styles.percent}>
                  {animValues[skillKey].interpolate({
                    inputRange: [0, value],
                    outputRange: ['0%', `${value}%`],
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
    backgroundColor: '#1E1E2E',
    borderRadius: 26,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,

    borderWidth: 1,
    borderColor: '#2F2F48',
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 18,
    borderWidth: 3,
    borderColor: '#0286FF',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    alignItems: 'center',
  },

  name: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },

  badge: {
    backgroundColor: '#2A2A4A',
    color: '#FFD166',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },

  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#2A2A4A',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },

  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },

  filterActive: {
    backgroundColor: '#0286FF',
  },

  filterText: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },

  filterTextActive: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },

  /* GRID */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  skillCard: {
    width: '48%',
    backgroundColor: '#25253A',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  skillTitle: {
    color: '#EAEAF5',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },

  barBg: {
    height: 8,
    backgroundColor: '#3A3A55',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: 10,
  },

  percent: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'Poppins-Medium',
  },
});
