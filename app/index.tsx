import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import AppStateScreen from '@/components/AppStateScreen';
const Page = () => {
  const {isSignedIn,isLoaded} = useAuth();
  if(!isLoaded){
    return <AppStateScreen mode="splash" title="Starting Hahu" />;
  }

  if(isSignedIn){ 
    return( <Redirect href="/(root)/(tabs)/home"/>)
  }
  return( <Redirect href="/(auth)/onboarding"/>)
  
}

export default Page