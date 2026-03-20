import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import OAuth from '@/components/OAuth'
import { Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSignIn } from '@clerk/clerk-expo'
import { useChildrenStore } from '@/store/childrenStore'

const SignIn = () => {
  const router = useRouter()
  const loadChildren = useChildrenStore((state) => state.loadChildren)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, setActive, isLoaded } = useSignIn()

  const handleSubmit = async () => {
    if (!isLoaded || isLoading) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const attempt = await signIn.create({
        identifier: form.email.trim(),
        password: form.password
      })

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId })
        await loadChildren()
        router.replace('/(root)/(tabs)/home')
      } else {
        setErrorMsg("Please complete all sign-in steps.")
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#0286FF', '#1F1F39']} 
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image source={images.Logo} style={styles.logo} resizeMode='contain' />
          <Text style={styles.title}>Welcome Back 👋</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label='Email Address'
            placeholder='Enter your Email'
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            autoCapitalize='none'
            keyboardType='email-address'
            autoCorrect={false}
          />
          
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            secureTextEntry={!showPassword}
            rightText={showPassword ? "Hide" : "Show"}
            onRightPress={() => setShowPassword(!showPassword)}
          />
          
          {errorMsg && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <CustomButton
            title={isLoading ? 'Signing in...' : 'Sign In'}
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.button}
          />

          <OAuth />

          <View style={styles.footerLinks}>
            <Link href='/(auth)/forgot-password' style={styles.link}>
              <Text style={styles.linkSub}>Forgot Password?</Text>
            </Link>

            <Link href="/(auth)/sign-up" style={styles.link}>
              <Text style={styles.linkSub}>
                Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  content: {
    flex: 1,
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
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingLeft:10,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  button: {
    marginTop: 30,
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
  footerLinks: {
    marginTop: 25,
    alignItems: 'center',
    gap: 15,
  },
  link: {
    paddingVertical: 5,
  },
  linkSub: {
    fontSize: 15,
    color: '#BABBC9', 
    fontFamily: 'Poppins-Regular',
  },
  linkHighlight: {
    color: '#0286FF', 
    fontFamily: 'Poppins-Bold',
  },
});