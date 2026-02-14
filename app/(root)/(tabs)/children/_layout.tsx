import { Stack } from 'expo-router';

export default function ChildrenLayout() {
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
      
    </Stack>
  );
}