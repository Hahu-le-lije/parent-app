import { View, Text,TouchableOpacity,StyleSheet ,Image,Alert} from 'react-native'
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';


 const RenderRecommendation = ({ item }) =>{ 
    const language = useLanguageStore((s) => s.language);
    return (
    <TouchableOpacity
      style={styles.recommendationCard}
      onPress={() =>
        Alert.alert(
          t(language, 'common_comingSoon'),
          `${t(language, 'common_comingSoonWait')}\nNavigating to child ${item.id} details will be available soon.`
        )
      }
    >
      <View style={styles.recommendationHeader}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png' }} style={styles.recommendationIcon} />
        <Text style={styles.recommendationName}>{item.name}</Text>
      </View>
      <Text style={styles.recommendationText}>{item.recommendation}</Text>
    </TouchableOpacity>
  )};
export default RenderRecommendation
const styles=StyleSheet.create({
    recommendationCard: {
    width: 240,
    backgroundColor: '#2A2A4A',
    borderRadius: 18,
    padding: 16,
    marginRight: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  recommendationName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  recommendationText: {
    color: '#ddd',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
    
})