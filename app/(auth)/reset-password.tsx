import { View, Text, ScrollView, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import OAuth from '@/components/OAuth'
import { Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSignIn } from '@clerk/clerk-expo'
import { useChildrenStore } from '@/store/childrenStore'

const ResetPassword= () => {
  const router=useRouter()


  const [form,setForm]=useState({
    email:'',
    password:'',
  })
  
  
  return (
   
      <View style={styles.container}>
        <View style={styles.header}>
             <LinearGradient
                      colors={['#0286FF', '#005BB5', '#003366']} 
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      />
          <Image source={images.Logo} style={styles.image} resizeMode='contain'/>
          <Text style={styles.title}>Reset Password</Text>
        </View>

        <View style={styles.form}>
    
         
          
        </View>
      </View>
    
  )
}

export default ResetPassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'relative',
    width: '100%',
    height: 260,
    
  },
  image: {
    width: '100%',
    height: 260,
  },
  title: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  button: {
    marginTop: 28,
    width: '100%',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  link: {
    marginTop: 28,
    fontSize: 16,
    textAlign: 'center',
    color: '#4b5563',
  },
  linkHighlight: {
    color: '#7C3AED',
    fontFamily: 'Poppins-SemiBold',
  },
});