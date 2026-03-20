import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  Alert, ActivityIndicator, ScrollView 
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/constants';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Reduced quality for faster base64 upload
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]?.base64) return;

    const asset = result.assets[0];
    setPreviewUri(asset.uri);

    try {
      setUploading(true);
      const base64DataUrl = `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
      await user?.setProfileImage({ file: base64DataUrl });
      await user?.reload();
      Alert.alert('Success', 'Profile picture updated!');
      setPreviewUri(null);
    } catch (err: any) {
      Alert.alert('Upload Failed', 'Image may be too large.');
      setPreviewUri(null);
    } finally {
      setUploading(false);
    }
  };

  const displayImage = previewUri || user?.imageUrl || icons.person;

  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView ensures the Logout button is reachable above the Tab Bar */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
          <Text style={styles.subheader}>Manage your personal info</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} disabled={uploading} activeOpacity={0.8}>
            <View style={styles.imageWrapper}>
              <Image
                source={typeof displayImage === 'string' ? { uri: displayImage } : displayImage}
                style={styles.profileImage}
              />
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" size="small" />
                </View>
              )}
              <View style={styles.cameraBadge}>
                 <Text style={{fontSize: 14}}>📷</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        <View style={styles.menuCard}>
          <MenuItem title="Edit Account" onPress={() => {router.push('/(root)/(tabs)/profile/edit-account')}} />
          <MenuItem title="Settings" onPress={() => router.push('/(root)/(tabs)/profile/settings')} />
          <MenuItem title="Help Center" onPress={() => {router.push('/(root)/(tabs)/profile/help-center')}} />
          <MenuItem title="Privacy Policy" onPress={() => {router.push('/(root)/(tabs)/profile/about')}} isLast />
        </View>

        <TouchableOpacity
          style={[styles.logoutBtn, uploading && styles.logoutBtnDisabled]}
          onPress={handleLogout}
          disabled={uploading}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({ title, onPress, isLast }: { title: string, onPress: () => void, isLast?: boolean }) => (
  <TouchableOpacity style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
    <Image source={ icons.arrowDown} style={styles.arrow} />
  </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  scrollContent: {
    paddingBottom: 40, 
  },
  header: {
    height: 120, 
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  subheader: {
    fontSize: 14,
    color: '#9AA0C3',
    fontFamily: 'Poppins-Regular',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0286FF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0286FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1F1F39',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 15,
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#9AA0C3',
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: '#26264A', 
    marginHorizontal: 24,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  arrow: {
    width: 16,
    height: 16,
    tintColor: '#9AA0C3',
    transform: [{ rotate: '-90deg' }], 
  },
  logoutBtn: {
    marginTop: 30,
    marginHorizontal: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutBtnDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    color: '#EF4444',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});