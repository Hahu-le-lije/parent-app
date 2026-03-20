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
import Modal from 'react-native-modal';
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
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  const validateFrom = () => {
    if (!form.firstname.trim() || !form.lastname.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      return "All fields are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Invalid email address";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(form.password)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/[0-9]/.test(form.password)) {
      return "Password must include at least one number";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

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
        // Reduced timeout for better UX
        setTimeout(() => {
          router.replace('/(root)/(tabs)/home');
        }, 2500);
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Invalid code');
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
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      enableAutomaticScroll={true}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#0286FF', '#1F1F39']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image source={images.Logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Create Account</Text>
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
            placeholder="Enter Your Email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            keyboardType="email-address"
          />
          <InputField
            label="Password"
            placeholder="••••••••"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            secureTextEntry={!showPassword}
            rightText={showPassword ? "Hide" : "Show"}
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
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <CustomButton
            title={isLoading ? 'Creating...' : 'Sign Up'}
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.button}
          />

          <OAuth />

          <View style={styles.footerLinks}>
            <Link href='/(auth)/forgot-password' style={styles.link}>
              <Text style={styles.linkSub}>Forgot Password?</Text>
            </Link>

            <Link href="/(auth)/sign-in" style={styles.link}>
              <Text style={styles.linkSub}>
                Already have an account? <Text style={styles.linkHighlight}>Log in</Text>
              </Text>
            </Link>
          </View>
        </View>
      </View>

      {/* SUCCESS MODAL */}
      <Modal 
        isVisible={showSuccess}
        animationIn={'bounceIn'}
        animationOut={'fadeOut'}
        backdropOpacity={0.7}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successImageContainer}>
              <Image source={icons.checkmark} style={styles.verifiedImage} resizeMode='contain' />
            </View>
            <Text style={styles.successTitle}>Verified!</Text>
            <Text style={styles.successSubtitle}>Account created successfully</Text>
            <CustomButton
              title="Continue"
              style={{ marginTop: 20, backgroundColor: "#0286FF", width: '100%' }}
              onPress={() => router.replace('/(root)/(tabs)/home')}
            />
          </View>
        </View>
      </Modal>

      {/* VERIFICATION MODAL */}
      <Modal
        isVisible={pendingVerified}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropOpacity={0.7}
        avoidKeyboard={true}
        onBackdropPress={() => setPendingVerified(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Verify Email</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={{ fontWeight: 'bold', color: "#10B981" }}>{form.email}</Text>
            </Text>
            
            <TextInput
              ref={codeInputRef}
              placeholder="000000"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#9ca3af"
              style={styles.otpInput}
            />

            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            <CustomButton
              title={isLoading ? 'Verifying...' : 'Verify'}
              onPress={handleVerify}
              disabled={isLoading || code.length !== 6}
              style={{ marginTop: 15, backgroundColor: '#0286FF', width: '100%' }}
            />

            <TouchableOpacity
              onPress={() => signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.resendText}>
                Didn't receive code? <Text style={{ color: '#0286FF' }}>Resend</Text>
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
  container: { flex: 1, backgroundColor: '#1F1F39' },
  content: { flex: 1 },
  header: { 
    width: '100%', 
    height: 220, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative'
  },
  logo: { width: 150, height: 150 },
  title: { 
    fontSize: 26, 
    fontFamily: 'Poppins-Bold', 
    color: 'white', 
    marginTop: 10,
    alignSelf:"flex-start"
  },
  form: { 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: 40 
  },
  button: { 
    marginTop: 40, 
    backgroundColor: '#3D5CFF', 
    height: 56, 
    borderRadius: 16 
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
    fontFamily: 'Poppins-Medium' 
  },
  footerLinks: { marginTop: 25, alignItems: 'center', gap: 12 },
  link: { paddingVertical: 4 },
  linkSub: { fontSize: 14, color: '#BABBC9', fontFamily: 'Poppins-Regular' },
  linkHighlight: { color: '#0286FF', fontFamily: 'Poppins-Bold' },
  
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: '#26264A',
    borderRadius: 24,
    padding: 28,
    width: '88%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  successImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#0286FF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  verifiedImage: { width: 40, height: 40, tintColor: '#fff' },
  successTitle: { fontSize: 24, fontFamily: 'Poppins-Bold', color: 'white' },
  successSubtitle: { fontSize: 15, color: '#BABBC9', textAlign: 'center', marginTop: 8 },
  
  modalTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: 'white', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#BABBC9', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  otpInput: {
    width: '100%',
    height: 60,
    fontSize: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    backgroundColor: '#1F1F39',
    color: '#FFFFFF',
    marginVertical: 15,
    textAlign: 'center',
    letterSpacing: 10,
    fontFamily: 'Poppins-Bold',
  },
  resendText: { fontSize: 13, color: '#BABBC9', fontFamily: 'Poppins-Regular' },
});