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

const SignIn= () => {
  const router=useRouter()
  const loadChildren = useChildrenStore((state) => state.loadChildren)

  const [form,setForm]=useState({
    email:'',
    password:'',
  })
  const [errorMsg,setErrorMsg]=useState<string|null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const {signIn,setActive,isLoaded}=useSignIn()
  const handleSubmit=async()=>{
    if(!isLoaded ||  isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    try{
      const attempt=await signIn.create({
        identifier:form.email,
        password:form.password
      })
      if(attempt.status==='complete'){
        await setActive({session:attempt.createdSessionId})
        await loadChildren()
        router.replace('/(root)/(tabs)/home')
      }
      else{
        console.log('sign in problem: ', attempt)
        setErrorMsg(attempt.status)
      }
    }catch(err:any){
      console.error('sign in error: ',JSON.stringify(err,null,2))
      setErrorMsg(err?.errors?.[0]?.longMessage || 'invalid email or password')
    }finally{
      setIsLoading(false)
      setForm({email:'',password:''})
    }
  }
  return (
    <ScrollView
    style={styles.container}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{flexGrow:1}}
    >
      <View style={styles.content}>
        <View style={styles.header}>
             <LinearGradient
                      colors={['#0286FF', '#005BB5', '#003366']} 
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      />
          <Image source={images.Logo} style={styles.image} resizeMode='contain'/>
          <Text style={styles.title}>Welcome 👋</Text>
        </View>

        <View style={styles.form}>
          
          <InputField
          label='Email Address'
          placeholder='Enter your Email'
          icon={icons.email}
          value={form.email}
          onChangeText={(value)=>setForm({...form,email:value})}
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
            secureTextEntry
          />
          
          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
           <CustomButton
           title={isLoading ? 'Signing in...' : 'Sign in'}
           onPress={handleSubmit}
           disabled={isLoading}
           bgVariant="primary"
           style={styles.button}
           IconLeft={undefined}
           IconRight={undefined}
         />
          <OAuth/>
          <Link href='/(auth)/forgot-password' style={styles.link}>
            <Text style={styles.linkHighlight}>Forgot Password?</Text>
          </Link>
           <Link href="/(auth)/sign-up" style={styles.link}>
             Don&apos;t have an account?{' '}
            <Text style={styles.linkHighlight}>Sign UP</Text>
          </Link>
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