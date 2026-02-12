
import {  Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {useFonts} from 'expo-font'
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

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
    <>
      <Stack>
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="index" options={{headerShown:false}}/>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
