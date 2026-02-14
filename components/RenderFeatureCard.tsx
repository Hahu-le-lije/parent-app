import { View, Text,ImageBackground,StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RenderFeatureCard = ({ item }) => {
  
    return (
    <ImageBackground
      source={{ uri: item.imageUri }}
      style={styles.featureCard}
      imageStyle={{ borderRadius: 18 }}
    >
      <View style={styles.featureOverlay}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
    </ImageBackground>
  )};

export default RenderFeatureCard
const styles = StyleSheet.create({
  featureCard: {
    width: SCREEN_WIDTH - 40,
    height: 200,
    marginRight: 0,
    justifyContent: 'flex-end',
    borderRadius: 18,
    overflow: 'hidden',
  },
  featureOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
  },
  featureDescription: {
    color: '#e0e0e0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  }
})