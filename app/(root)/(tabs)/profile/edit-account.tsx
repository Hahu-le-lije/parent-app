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

const EditAccount = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill with current firstName (which is your full name)
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

    // Password validation (optional section)
    let passwordUpdate = {};
    if (newPassword || currentPassword) {
      if (!currentPassword) {
        setError('Current password is required to change password');
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
        firstName: fullName.trim(),  // ← entire name saved here
        lastName: '',                // explicitly clear lastName (or omit if already empty)
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

          {/* Full Name (saved as firstName in Clerk) */}
          <InputField
            label="Full Name"
            placeholder={currentNamePlaceholder}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          {/* Password Change (optional) */}
          <Text style={styles.sectionTitle}>Change Password (optional)</Text>

          <InputField
            label="Current Password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            returnKeyType="next"
          />

          <InputField
            label="New Password"
            placeholder="Enter new password (min 8 characters)"
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

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

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
    backgroundColor: '#F8F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginVertical: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  saveButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 100,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});