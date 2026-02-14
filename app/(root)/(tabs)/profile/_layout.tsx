import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,          
        headerStyle: { backgroundColor: '#0286FF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: 'Poppins-Bold' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="edit-account" options={{ title: 'Edit Account' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="help-center" options={{ title: 'Help Center' }} />
      <Stack.Screen name="about" options={{ title: 'About App' }} />
    </Stack>
  );
}