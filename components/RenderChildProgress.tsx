import { View, Text , TouchableOpacity,Image,StyleSheet} from 'react-native'
import { useRouter } from 'expo-router';
import { useState } from 'react';
const RenderChildProgress = ({ item,timeFilter,setTimeFilter }) => {
    const router = useRouter();

    return (   
  <TouchableOpacity 
    style={styles.progressCard} 
    onPress={() => router.push(`/children/${item.id}`)}
    activeOpacity={0.92}
  >
    <Image source={{ uri: item.imageUri }} style={styles.childAvatar} />

      <View style={styles.progressInfo}>
        <View style={styles.childHeaderRow}>
          <Text style={styles.childName}>{item.name}</Text>
          <Text style={styles.achievementsBadge}>
            {item.achievements} achievements
          </Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {['daily', 'weekly', 'monthly', 'yearly'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                timeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  timeFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      
      <View style={styles.graphContainer}>
        {Object.entries(item.progress).map(([key, value]) => (
          <View key={key} style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barSkillLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Text style={styles.barPercentage}>{value}%</Text>
            </View>
            
            <View style={styles.barBackground}>
              <View 
                style={[
                  styles.barFill,
                  { width: `${value}%` },
                
                  key === 'writing' && { backgroundColor: '#FF6B6B' },
                  key === 'speaking' && { backgroundColor: '#4ECDC4' },
                  key === 'listening' && { backgroundColor: '#45B7D1' },
                  key === 'reading' && { backgroundColor: '#96CEB4' },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
)};
export default RenderChildProgress
const styles = StyleSheet.create({
progressCard: {
    backgroundColor: '#25253A',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333350',
  },
  childAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#0286FF55',
  },

  progressInfo: {
    flex: 1,
  },
  childHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  childName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontFamily: 'Poppins-Bold',
  },
  achievementsBadge: {
    color: '#FFD166',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    backgroundColor: '#2A2A4A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A2A4A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },

  filterButtonActive: {
    backgroundColor: '#0286FF',
  },

  filterButtonText: {
    color: '#AAAAAA',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },

  graphContainer: {
    gap: 14,
  },

  barRow: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  barSkillLabel: {
    color: '#CCCCDD',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },

  barPercentage: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  barBackground: {
    height: 12,
    backgroundColor: '#3A3A55',
    borderRadius: 6,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#0286FF', 
  },

})