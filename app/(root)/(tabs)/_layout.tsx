import { Tabs } from 'expo-router';
import { View, Image, ImageSourcePropType, Platform } from 'react-native';
import { icons } from '@/constants';
import { StatusBar } from 'expo-status-bar';

interface TabIconProps {
  focused: boolean;
  source: ImageSourcePropType;
}

const TabIcon = ({ focused, source }: TabIconProps) => {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          paddingHorizontal: 18,
          borderRadius: 999,
          transitionProperty: 'all',
          transitionDuration: '150ms', // smooth feel
        },
        focused && {
          backgroundColor: 'rgba(114, 63, 229, 0.22)', // softer purple glow
        },
      ]}
    >
      <View
        style={[
          {
            width: 40,
            height: 40,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: focused ? '#723FE5' : 'transparent',
            shadowColor: focused ? '#723FE5' : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: focused ? 6 : 0,
          },
        ]}
      >
        <Image
          source={source}
          style={{
            width: focused ? 26 : 24,
            height: focused ? 26 : 24,
            tintColor: focused ? '#ffffff' : '#A0AEC0',
            opacity: focused ? 1 : 0.85,
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const TabLayout = () => {
  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#A0AEC0',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: -2,
            letterSpacing: -0.2,
          },
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 28 : 0, 
            left: 16,
            right: 16,
            height: 72,
            borderRadius: 32,
            backgroundColor: '#1F1F39', 
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: 'rgba(31,31,27,0.08)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 12,
            paddingBottom: Platform.OS === 'ios' ? 20 : 0,
            paddingTop: 8,
            overflow: 'hidden', 
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />,
          }}
        />

        {/* Uncomment when ready */}
        {/* <Tabs.Screen
          name="rides"
          options={{
            title: 'Rides',
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.list} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.chat} />,
          }}
        /> */}
        <Tabs.Screen
        name="children"
        options={{
          title:'Children',
          tabBarIcon:({focused})=><TabIcon focused={focused} source={icons.person}/>
        }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.profile} />,
          }}
        />
      </Tabs>

      <StatusBar translucent={false} style="auto" backgroundColor={'#003366'}/> 
    </>
  );
};

export default TabLayout;