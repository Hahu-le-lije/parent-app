import { View, Text, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter,useLocalSearchParams } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';

const ResetPassword = () => {
  const router = useRouter();
  const {email,code} = useLocalSearchParams<{email:string,code:string}>(); 
  const { signIn, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: email || '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!form.password || !form.confirmPassword) {
      setErrorMsg('Both password fields are required');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (!isLoaded) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code!,
        password: form.password,
      });

      if (attempt.status === 'complete') {
        router.replace('/(auth)/sign-in');
      } else {
        setErrorMsg('Failed to reset password');
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <LinearGradient
              colors={['#0286FF', '#005BB5', '#003366']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Image source={images.Logo} style={styles.image} resizeMode='contain' />
            <Text style={styles.title}>Reset Password</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder='Email'
              value={form.email}
              editable={false} 
              style={[styles.input, { backgroundColor: '#3F3F5E' }]}
            />

            <TextInput
              placeholder='New Password'
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              placeholder='Confirm Password'
              value={form.confirmPassword}
              onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
              secureTextEntry
              style={styles.input}
            />

            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            <CustomButton
              title={isLoading ? 'Resetting...' : 'Reset Password'}
              onPress={handleResetPassword}
              disabled={isLoading}
              style={styles.button}
              bgVariant="primary"
              IconLeft={null}
              IconRight={null}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  input: {
    width: '90%',
    maxWidth: 400,
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#2F2F42',
    color: '#fff',
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    width: '90%',
    maxWidth: 400,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
});