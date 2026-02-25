import { useAuth } from "@clerk/clerk-expo";
import {  Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";


const AuthLayout = () => {
  const {isLoaded} = useAuth();
if(!isLoaded){
    return (
      <View style={{display:"flex",flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large" color="#7C3AED"/>
      </View>
    )
  }
  return (
    <>
      <StatusBar translucent={true} style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </>
  );
};

export default AuthLayout;