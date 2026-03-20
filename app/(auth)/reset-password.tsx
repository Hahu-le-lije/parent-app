import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';

const ResetPassword = () => {
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{ email: string; code: string }>();
  const { signIn, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: email || '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!form.password || !form.confirmPassword) {
      setErrorMsg('Both password fields are required');
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
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
        setErrorMsg('Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.longMessage || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#0286FF', '#1F1F39']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image source={images.Logo} style={styles.logo} resizeMode='contain' />
          <Text style={styles.title}>New Password</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.instructionText}>
            Set a strong password to protect your account.
          </Text>

          <InputField
            label='Email'
            placeholder='Email'
            value={form.email}
            editable={false}
            icon={icons.email}
            style={{ opacity: 0.6 }} 
          />

          <InputField
            label="New Password"
            placeholder="••••••••"
            icon={icons.lock}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry={!showPassword}
            rightText={showPassword ? "Hide" : "Show"}
            onRightPress={() => setShowPassword(!showPassword)}
          />

          <InputField
            label="Confirm Password"
            placeholder="••••••••"
            icon={icons.lock}
            value={form.confirmPassword}
            onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            rightText={showConfirmPassword ? "Hide" : "Show"}
            onRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {errorMsg && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <CustomButton
            title={isLoading ? 'Resetting...' : 'Update Password'}
            onPress={handleResetPassword}
            disabled={isLoading}
            style={styles.button}
            IconLeft={null}
            IconRight={null}
          />
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
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginTop: 10,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 15,
    color: '#BABBC9',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 25,
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
});