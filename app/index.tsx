import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
const Page = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#078930" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }
  return <Redirect href="/(auth)/onboarding" />;
};

export default Page;
