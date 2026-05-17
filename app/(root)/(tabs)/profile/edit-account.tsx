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
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import InputField from '@/components/InputField'; 
import { LinearGradient } from 'expo-linear-gradient';

const EditAccount = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);
  const strings = {
    title: t(language, 'edit_title'),
    subtitle: t(language, 'edit_subtitle'),
    firstNameLabel: t(language, 'label_first_name'),
    firstNamePlaceholder: t(language, 'placeholder_first_name'),
    lastNameLabel: t(language, 'label_last_name'),
    lastNamePlaceholder: t(language, 'placeholder_last_name'),
    sectionSecurity: t(language, 'section_security'),
    currentPasswordLabel: t(language, 'label_current_password'),
    currentPasswordPlaceholder: t(language, 'placeholder_current_password'),
    newPasswordLabel: t(language, 'label_new_password'),
    newPasswordPlaceholder: t(language, 'placeholder_new_password'),
    confirmPasswordLabel: t(language, 'label_confirm_new_password'),
    confirmPasswordPlaceholder: t(language, 'placeholder_confirm_new_password'),
    saveChanges: t(language, 'save_changes'),
    cancel: t(language, 'cancel'),
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [isLoaded, user]);

  const handleSave = async () => {
    if (!isLoaded || !user) return;
    setError(null);

    // Validation
    if (!firstName.trim()) {
      setError(t(language, 'validation_first_name_required'));
      return;
    }

    let passwordUpdate = {};
    if (newPassword || currentPassword) {
      if (!currentPassword) {
        setError(t(language, 'validation_current_password_required'));
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(t(language, 'validation_password_mismatch'));
        return;
      }
      if (newPassword.length < 8) {
        setError(t(language, 'validation_password_length'));
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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...passwordUpdate,
      });

      Alert.alert(t(language, 'save_success') || 'Success', t(language, 'save_success'), [
        { text: t(language, 'save_ok') || 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Update error:', err);
      let msg = t(language, 'save_failed') || 'Failed to update account. Please try again.';
      if (err?.errors?.[0]?.code === 'form_password_incorrect') {
        msg = t(language, 'current_password_incorrect') || 'Current password is incorrect';
      } else if (err?.errors?.[0]?.message) {
        msg = err.errors[0].message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0286FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* HEADER WITH BACK BUTTON */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{strings.title}</Text>
            <Text style={styles.subtitle}>{strings.subtitle}</Text>
          </View>

          {/* NAME SECTION */}
          <View style={styles.card}>
            <InputField
              label={strings.firstNameLabel}
              placeholder={strings.firstNamePlaceholder}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <View style={{ height: 15 }} />
            <InputField
              label={strings.lastNameLabel}
              placeholder={strings.lastNamePlaceholder}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          {/* PASSWORD SECTION */}
          <Text style={styles.sectionTitle}>{strings.sectionSecurity}</Text>
          <View style={styles.card}>
            <InputField
              label={strings.currentPasswordLabel}
              placeholder={strings.currentPasswordPlaceholder}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            <View style={{ height: 15 }} />
            <InputField
              label={strings.newPasswordLabel}
              placeholder={strings.newPasswordPlaceholder}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <View style={{ height: 15 }} />
            <InputField
              label={strings.confirmPasswordLabel}
              placeholder={strings.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0286FF', '#005BB5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>{strings.saveChanges}</Text>
              )}
            </LinearGradient>
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
    backgroundColor: '#1F1F39',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F39',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#26264A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#9AA0C3',
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 12,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#26264A',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  saveButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#9AA0C3',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
});