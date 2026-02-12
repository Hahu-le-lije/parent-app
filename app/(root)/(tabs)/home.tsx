import { View, Text, Button } from 'react-native';
import React from 'react';
import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';           // ← add this if using Expo Router

const Home = () => {
  const { signOut } = useClerk();
  const router = useRouter();                     // ← only if using Expo Router

  const handleLogout = async () => {
    try {
      await signOut();
      // If using Expo Router → redirect to sign-in / home / splash
      router.replace('/(auth)/sign-in');                 
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>

      <Button
        title="Log out"
        onPress={handleLogout}
        color="#ff3b30" // red for visibility during testing
      />
    </View>
  );
};

export default Home;