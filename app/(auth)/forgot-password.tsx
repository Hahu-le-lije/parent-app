import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSignIn } from '@clerk/clerk-expo'
import Modal from 'react-native-modal'

const ForgotPassword = () => {
  const router = useRouter()
  const { signIn, isLoaded } = useSignIn()
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const codeInputRef = useRef<TextInput>(null);

  const handleSendCode = async () => {
    if (!email.trim()) {
      setErrorMsg('Email is required')
      return
    }
    setErrorMsg(null)
    if (!isLoaded) return
    setIsLoading(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim()
      })
      setShowModal(true)
      setCode('')
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Failed to send code');
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code.trim() || code.length !== 6) return;
    setErrorMsg(null)
    if (!isLoaded) return
    setIsLoading(true)
    try {
     
      setShowModal(false)
      router.push({
        pathname: '/(auth)/reset-password',
        params: { email: email.trim(), code: code.trim() }
      })
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Failed to verify code');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#0286FF', '#1F1F39']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image source={images.Logo} style={styles.logo} resizeMode='contain' />
          <Text style={styles.title}>Forgot Password</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.instructionText}>
            Enter your email address and we'll send you a 6-digit confirmation code to reset your password.
          </Text>

          <InputField
            label='Email'
            placeholder='Enter your email'
            value={email}
            onChangeText={setEmail}
            icon={icons.email}
            keyboardType='email-address'
            autoCapitalize="none"
          />

          {errorMsg && !showModal && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <CustomButton
            title={isLoading ? 'Sending...' : 'Send Code'}
            onPress={handleSendCode}
            disabled={isLoading}
            style={styles.button}
            IconLeft={null}
              IconRight={null}
          />

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.7}
        avoidKeyboard={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Email</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to{"\n"}
              <Text style={{ fontWeight: "bold", color: "#10B981" }}>{email}</Text>
            </Text>

            <TextInput
              ref={codeInputRef}
              placeholder="000000"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.codeInput}
              placeholderTextColor="#9ca3af"
            />

            {errorMsg && <Text style={[styles.errorText, { marginBottom: 10 }]}>{errorMsg}</Text>}

            <CustomButton
              title={isLoading ? "Verifying..." : "Verify Code"}
              onPress={handleVerifyCode}
              disabled={isLoading || code.length !== 6}
              style={{ width: '100%', backgroundColor: '#0286FF' }}
              IconLeft={null}
              IconRight={null}
            />

            <TouchableOpacity
              onPress={handleSendCode}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.resendText}>
                Didn't receive code? <Text style={{ color: '#0286FF', fontWeight: 'bold' }}>Resend</Text>
              </Text>
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
  header: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginTop: 15,
    alignSelf:"flex-start",
    paddingLeft:10

  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  instructionText: {
    fontSize: 15,
    color: '#BABBC9',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3D5CFF',
    height: 56,
    borderRadius: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(231, 74, 74, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0286FF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#26264A",
    borderRadius: 24,
    padding: 28,
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 22,
    color: "white",
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#BABBC9",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  codeInput: {
    width: "100%",
    height: 60,
    fontSize: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    backgroundColor: '#1F1F39',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 10,
    fontFamily: 'Poppins-Bold',
  },
  resendText: {
    fontSize: 14,
    color: '#BABBC9',
    fontFamily: 'Poppins-Regular'
  }
});