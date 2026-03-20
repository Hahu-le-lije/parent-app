import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform  } from 'react-native'
import React, { useRef, useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'

import {  useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSignIn } from '@clerk/clerk-expo'
import Modal from 'react-native-modal'


const ForgotPassword = () => {
  const router=useRouter()

  const {signIn,isLoaded,setActive}=useSignIn()
  const [email, setEmail] = useState('');
  const [code,setCode]=useState('')
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const codeInputRef=useRef<TextInput>(null);

  const handleSendCode=async()=>{
    if(!email.trim()){
      setErrorMsg('Email is required')
      return
    }
    setErrorMsg(null)
    if(!isLoaded)return 
    setIsLoading(true);
    try{
      await signIn.create({
        strategy:'reset_password_email_code',
        identifier:email.trim()
      })
      setShowModal(true)
      setCode('')
    }catch(err:any){
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Failed to send code');
    }finally{
      setIsLoading(false)
    }
  }
  const handleVefrifyCode=async()=>{
    if(!code.trim() || code.length!==6) return;
    setErrorMsg(null)
    if(!isLoaded)return
    setIsLoading(true)
    try{
      const attempt=await signIn.attemptFirstFactor({
        strategy:'reset_password_email_code',
        code:code.trim()
      })
      setShowModal(false)
      router.push({
        pathname:'/(auth)/reset-password',
        params:{email:email.trim(),code:code.trim()}
      })
    }catch(err:any){
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Failed to verify code');
    }finally{
      setIsLoading(false)
    }
  }
  
  return (
   <KeyboardAvoidingView
  style={[{ flex: 1 },styles.container]}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
      
        <View style={styles.header}>
             <LinearGradient
                      colors={['#0286FF', '#005BB5', '#003366']} 
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      />
          <Image source={images.Logo} style={styles.image} resizeMode='contain'/>
          <Text style={styles.title}>Forgot Password</Text>
        </View>

        <View style={styles.form}>
        <View style={styles.inputWrapper}>
           <InputField
              label='Email'
              placeholder='Enter your email'
              value={email}
                onChangeText={setEmail}
                icon={icons.email}
                keyboardType='email-address'
            
          />
          </View>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}  
        <CustomButton
        title={isLoading ? 'Sending...' : 'Send Code'}
        onPress={handleSendCode}
        disabled={isLoading}
        style={styles.button}
        bgVariant="primary"
        IconLeft={undefined}
        IconRight={undefined}
        />
        </View>
        <Modal
  isVisible={showModal}
  onBackdropPress={() => setShowModal(false)}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  backdropOpacity={0.6}
  avoidKeyboard={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Enter Verification Code</Text>
      <Text style={styles.modalSubtitle}>
        We sent a 6-digit code to your email:{"\n"}
        <Text style={{ fontWeight: "bold", color: "#3aed58" }}>{email}</Text>
      </Text>

      <TextInput
        ref={codeInputRef}
        placeholder="123456"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.codeInput}
        placeholderTextColor="#9ca3af"
        autoFocus

      />

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <CustomButton
        title={isLoading ? "Verifying..." : "Verify Code"}
        onPress={handleVefrifyCode}
        disabled={isLoading || code.length !== 6}
        bgVariant="primary"
        IconLeft={undefined}
        IconRight={undefined}
        style={styles.button}
      />

      <TouchableOpacity
        onPress={handleSendCode}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: "#3D5CFF" }}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

  </KeyboardAvoidingView>
  )
}

export default ForgotPassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  inputWrapper: {
  width: '90%',          
  maxWidth: 400,        
  marginBottom: 16,  
    
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
     flex: 1,
  justifyContent: 'center', 
  alignItems: 'center',     
  paddingHorizontal: 24,
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
  modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.6)",
},
modalContent: {
  backgroundColor: "#2F2F42",
  borderRadius: 20,
  padding: 28,
  width: "85%",
  alignItems: "center",
},
modalTitle: {
  fontSize: 20,
  color: "white",
  fontFamily: "Poppins-Bold",
  marginBottom: 8,
},
modalSubtitle: {
  fontSize: 14,
  color: "#6b7280",
  textAlign: "center",
  marginBottom: 16,
},
codeInput: {
  width: "100%",
  height: 56,
  fontSize: 20,
  borderWidth: 2,
  borderColor: "#d1d5db",
  borderRadius: 12,
  paddingHorizontal: 16,
  textAlign: "center",
  color: "#fff",
  letterSpacing: 8,
  marginBottom: 12,
},
});