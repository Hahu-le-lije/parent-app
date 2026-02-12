import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import OAuth from '@/components/OAuth';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignUp } from '@clerk/clerk-expo';

const SignUp = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerified, setPendingVerified] = useState(false);
  const [code, setCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const codeInputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      await signUp.create({
        firstName: form.name.trim(),
        emailAddress: form.email.trim(),
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerified(true);
      setCode('');
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Something went wrong');
      console.error(JSON.stringify(err, null, 2));
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
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Invalid code');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (pendingVerified && codeInputRef.current) {
      const timer = setTimeout(() => {
        codeInputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pendingVerified]);

  
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        router.replace('/(root)/(tabs)/home'); 
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess,router]);

  return (
    <>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
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
              label="Full Name"
              placeholder="Enter your full name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
              autoCapitalize="words"
            />
            <InputField
              label="Email Address"
              placeholder="Enter your Email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <InputField
              label="Phone Number"
              placeholder="Enter your Phone Number"
              icon={icons.marker}
              value={form.phoneNumber}
              onChangeText={(value) => setForm({ ...form, phoneNumber: value })}
              keyboardType="phone-pad"
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
              secureTextEntry
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

            <Link href="/(auth)/sign-in" style={styles.link}>
              Already have an account? <Text style={styles.linkHighlight}>Log in</Text>
            </Link>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={pendingVerified}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPendingVerified(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'bold' }}>
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
                borderWidth: 1,
                borderColor: code.length === 6 ? '#10b981' : '#d1d5db',
                borderRadius: 12,
                backgroundColor: '#f9fafb',
                color: '#111827',
                marginVertical: 16,
                textAlign: 'center',
                letterSpacing: 8,
              }}
            />

            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            <CustomButton
              title={isLoading ? 'Verifying...' : 'Verify'}
              onPress={handleVerify}
              disabled={isLoading || code.length !== 6}
              bgVariant="primary"
              style={{ marginTop: 12 }}
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

      
      <Modal visible={showSuccess} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.successModal]}>
            <Image
              source={icons.checkmark}
              style={styles.verifiedImage}
              resizeMode="contain"
            />
            <Text style={styles.successTitle}>Verified!</Text>
            <Text style={styles.successSubtitle}>Account created successfully</Text>
            <ActivityIndicator size="small" color="#fff" style={{ marginTop: 24 }} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
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
    color: '#1f2937',
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
    color: '#4b5563',
    textAlign: 'center',
  },
  successModal: {
    backgroundColor: '#10b981', // green
    paddingVertical: 40,
  },
  verifiedImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
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
  }
});