import { Redirect, Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import {View,ActivityIndicator} from 'react-native'
import { useAuth } from "@clerk/clerk-expo"
const AuthLayout=()=>{
  const {isLoaded,isSignedIn}=useAuth();
  if(!isLoaded){
    return(
      <View style={{display:"flex",flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large" color="#7C3AED"/>
      </View>
    )
  }
  if(isSignedIn){
     return <Redirect href="/(root)/(tabs)/home" />;
  }
    return (
        <>
    <StatusBar translucent={false} style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
      </>
    )
}
export default AuthLayout