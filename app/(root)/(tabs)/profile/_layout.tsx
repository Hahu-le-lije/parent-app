import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { icons } from '@/constants';
import { useLanguageStore } from '@/store/languageStore';
import { t } from '@/lib/i18n';

export default function ProfileLayout() {
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  const BackButton = () => (
    <TouchableOpacity
      onPress={() => router.back()}
      style={styles.backButtonContainer}
      activeOpacity={0.7}
    >
      <View style={styles.backButton}>
        <Image
          source={icons.backArrow} 
          style={styles.backIcon}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1F1F39', },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: 'Poppins-Bold', fontSize: 24,  },

      
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-account"
        options={{ title: t(language, 'profile_edit_account'), headerShown:false }}
      />
      <Stack.Screen name="settings" options={{ title: t(language, 'profile_settings'), headerShown:false }} />
      <Stack.Screen
        name="help-center"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="about"
        options={{ headerShown: false }}
      />

    </Stack>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    marginLeft: 12,
    marginRight:60
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 18,
    color: '#0286FF',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  backIcon: {
    width: 35,
    height: 35,
    tintColor: '#0286FF',
  },
});
