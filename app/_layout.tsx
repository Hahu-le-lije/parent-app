
import {  Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {useFonts} from 'expo-font'
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {ClerkProvider} from '@clerk/clerk-expo'
import {tokenCache} from '@clerk/clerk-expo/token-cache';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
export default function RootLayout() {
const [loaded]=useFonts({
  "Poppins-Regular":require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
  "Poppins-Medium":require("../assets/fonts/Poppins/Poppins-Medium.ttf"), 
  "Poppins-SemiBold":require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
  "Poppins-Bold":require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
  "Abyssinica_SIL":require("../assets/fonts/Abyssinica_SIL/AbyssinicaSIL-Regular.ttf")
})
useEffect(()=>{
  if(loaded) SplashScreen.hideAsync();
},[loaded])
if(!loaded){
  return null;
}

  return (
    <GestureHandlerRootView style={{flex:1}}>
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(root)"  />
      
      </Stack>
      <StatusBar translucent={true} />
    </ClerkProvider>
    </GestureHandlerRootView>
  );
}
