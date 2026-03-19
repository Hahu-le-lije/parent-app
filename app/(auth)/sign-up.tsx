import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from 'react-native';
import Modal  from 'react-native-modal';
import React, { useState, useRef } from 'react';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import OAuth from '@/components/OAuth';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignUp } from '@clerk/clerk-expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const SignUp = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',

  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerified, setPendingVerified] = useState(false);
  const [code, setCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const codeInputRef = useRef<TextInput>(null);



  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword,setConfirmPassword]=useState(false)

  const validateFrom=()=>{
    if(!form.firstname.trim() || !form.lastname.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()){
      return "All Fields are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    return "Invalid email address";
  }
    if(form.password.length<6){
      return "Password must be at least 6 characters"
    }
      if (!/[A-Z]/.test(form.password)) {
    return "Password must include at least one uppercase letter";
  }

  if (!/[0-9]/.test(form.password)) {
    return "Password must include at least one number";
  }

    if(form.password !== form.confirmPassword){
      return "Passwords do not match"
    }
    return null
  }

  const handleSubmit = async () => {
  setErrorMsg(null);

  const error = validateFrom();
  if (error) {
    setErrorMsg(error);
    return;
  }

  if (!isLoaded) return;
  setIsLoading(true);

  try {
    await signUp.create({
      firstName: form.firstname.trim(),
      lastName: form.lastname.trim(),
      emailAddress: form.email.trim(),
      password: form.password,
    });

    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

    setPendingVerified(true);
    setCode('');
  } catch (err: any) {
    setErrorMsg(err?.errors?.[0]?.longMessage || 'Something went wrong');
  } finally {
    setIsLoading(false);
  }
};
  const handleVerify = async () => {
    if (!isLoaded || !code.trim()) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });

        setPendingVerified(false);
        setShowSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 4000));
        router.replace('/(root)/(tabs)/home');

      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Invalid code');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAwareScrollView
    style={styles.container}
    enableOnAndroid={true}
    extraScrollHeight={40}
    extraHeight={120}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ flexGrow: 1,paddingBottom:40 }}
    showsVerticalScrollIndicator={false}
    enableAutomaticScroll={true}
    
    >
     
        <View style={styles.content}>
          <View style={styles.header}>
            <LinearGradient
              colors={['#0286FF', '#005BB5', '#003366']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Image source={images.Logo} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>Create Your Account</Text>
          </View>

          <View style={styles.form}>
            
           
            
            <InputField
              label="First Name"
              placeholder="Enter your First Name"
              icon={icons.person}
              value={form.firstname}
              onChangeText={(value) => setForm({ ...form, firstname: value })}
            />
            <InputField
              label="Last Name"
              placeholder="Enter your Last Name"
              icon={icons.person}
              value={form.lastname}
              onChangeText={(value) => setForm({ ...form, lastname: value })}
            />
            <InputField
            label="Email"
            placeholder='Enter Your Email'
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            keyboardType='email-address'
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
              secureTextEntry={!showPassword}
              rightText={showConfirmPassword ? "Hide" : "Show"}
              onRightPress={() => setShowPassword(!showPassword)}
            />
            <InputField
              label="Confirm Password"
              placeholder="Confirm Your Password"
              icon={icons.lock}
              value={form.confirmPassword}
              onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
              secureTextEntry={!showConfirmPassword}
              rightText={showConfirmPassword ? "Hide" : "Show"}
              onRightPress={() => setConfirmPassword(!showConfirmPassword)}
            />

            {errorMsg && !pendingVerified && (
              <Text style={styles.errorText}>{errorMsg}</Text>
            )}

            <CustomButton
              title={isLoading ? 'Creating...' : 'Sign Up'}
              onPress={handleSubmit}
              disabled={isLoading}
              bgVariant="primary"
              style={styles.button}
            />

            <OAuth />
            <Link href='/(auth)/forgot-password' style={styles.link}>
                        <Text style={styles.linkHighlight}>Forgot Password?</Text>
            </Link>

            <Link href="/(auth)/sign-in" style={styles.link}>
              Already have an account? <Text style={styles.linkHighlight}>Log in</Text>
            </Link>
          </View>
        </View>
      


    <Modal isVisible={showSuccess}
    animationIn={'bounceIn'}
    animationOut={'fadeOut'}
    animationOutTiming={350}
    animationInTiming={700}
    backdropOpacity={0.65}
    
    backdropTransitionInTiming={400}
    backdropTransitionOutTiming={300}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
           <Image source={icons.checkmark} style={[styles.verifiedImage,{tintColor:'#fff'}]} resizeMode='contain'/>
          <Text style={[styles.successTitle, { color: 'white' }]}>Verified!</Text>
            <Text style={[styles.successSubtitle, { color: '#d1d5db' }]}>
              Account created successfully
            </Text>
          <CustomButton
          title="Continue"
          style={{marginTop:20, backgroundColor:"#3D5CFF"}}
          onPress={()=>router.replace('/(root)/(tabs)/home')}
          /> 
        </View>    
      </View>
    </Modal>
    <Modal
    isVisible={pendingVerified}
    animationOut={'slideOutDown'}
    animationIn={'slideInUp'}
    animationInTiming={420}
    animationOutTiming={320}
    backdropOpacity={0.6}
    avoidKeyboard={true}
    onBackdropPress={()=>setPendingVerified(false)}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContent}
        >
           <Text style={styles.modalTitle}>Verify Your Email</Text>
           <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'bold',color:"#3aed58" }}>
                {form.email}
              </Text>
            </Text>
          <TextInput
              ref={codeInputRef}
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry={false}
              placeholderTextColor="#9ca3af"
              style={{
                width: '100%',
                height: 56,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 20,
                borderWidth: 2,
                borderColor: code.length === 6 ? '#10b92f' : '#d1d5db',
                borderRadius: 12,
                backgroundColor: '#3E3E55',
                color: '#FFFFFF',
                marginVertical: 16,
                textAlign: 'center',
                letterSpacing: 8,
                borderBottomWidth:2
            
              }}
            />
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
          <CustomButton
              title={isLoading ? 'Verifying...' : 'Verify'}
              onPress={handleVerify}
              disabled={isLoading || code.length !== 6}
              bgVariant="primary"
              style={{ marginTop: 15, backgroundColor: '#3D5CFF' }}
            />

          <TouchableOpacity
              onPress={() => signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.resendText}>
                Did not receive code? <Text style={{ color: '#08f573' }}>Resend</Text>
              </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>

    </Modal>
      
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
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
    paddingBottom: 80,
    marginBottom:50,
    
  },
  button: {
    marginTop: 60,
    width: '100%',
    backgroundColor: '#3D5CFF',
  },
  errorText: {
    color: '#e74a4a',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2F2F42',
    borderRadius: 20,
    padding: 28,
    width: '82%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  resendText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  verifiedImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    backgroundColor:"#3D5CFF",
    borderRadius:50
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  successSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
  },
});