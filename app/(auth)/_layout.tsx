import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AppStateScreen from "@/components/AppStateScreen";

const AuthLayout = () => {
  const { isLoaded } = useAuth();
  if (!isLoaded) {
    return <AppStateScreen mode="loading" title="Preparing authentication" />;
  }
  return (
    <>
      <StatusBar translucent={true} style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
        
      </Stack>
    </>
  );
};

export default AuthLayout;
