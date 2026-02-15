import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/InputField'; // adjust path
import { LinearGradient } from 'expo-linear-gradient';

const EditAccount = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setFullName(user.firstName || '');
    }
  }, [isLoaded, user]);

  const handleSave = async () => {
    if (!isLoaded || !user) return;

    setError(null);

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    let passwordUpdate = {};
    if (newPassword || currentPassword) {
      if (!currentPassword) {
        setError('Current password is required');
        return;
      }
      if (!newPassword) {
        setError('New password is required');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters');
        return;
      }
      passwordUpdate = {
        password: newPassword,
        currentPassword,
      };
    }

    setLoading(true);

    try {
      await user.update({
        firstName: fullName.trim(),
        lastName: '',
        ...passwordUpdate,
      });

      Alert.alert('Success', 'Account updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Update error:', err);
      let msg = 'Failed to update account. Please try again.';
      if (err?.errors?.[0]?.code === 'form_password_incorrect') {
        msg = 'Current password is incorrect';
      } else if (err?.errors?.[0]?.message) {
        msg = err.errors[0].message;
      }
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const currentNamePlaceholder = fullName
    ? `Current: ${fullName}`
    : 'Enter your full name';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Edit Account</Text>
          <Text style={styles.subtitle}>Update your information</Text>

          <View style={styles.card}>
            <InputField
              label="Full Name"
              placeholder={currentNamePlaceholder}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.sectionTitle}>Change Password</Text>
          <View style={styles.card}>
            <InputField
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              returnKeyType="next"
            />
            <InputField
              label="New Password"
              placeholder="Enter new password (min 8 chars)"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              returnKeyType="next"
            />
            <InputField
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              returnKeyType="done"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F39',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: 12,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#2A2A4A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  saveButton: {
    borderRadius: 50,
    paddingVertical: 16,
    marginTop: 16,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#A1A1AA',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
