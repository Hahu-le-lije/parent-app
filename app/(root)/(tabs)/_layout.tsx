import { Tabs } from 'expo-router';
import { View, Image, ImageSourcePropType } from 'react-native';
import { icons } from '@/constants';

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
          paddingVertical: 6,
          paddingHorizontal: 16,
          borderRadius: 999, 
        },
        focused && {
          backgroundColor: 'rgba(114, 47, 229, 0.18)', 
        },
      ]}
    >
      <View
        style={[
          {
            width: 28,
            height: 28,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
          },
          focused && {
            backgroundColor: '#723FE5', // solid purple circle when active
          },
        ]}
      >
        <Image
          source={source}
          style={{
            width: focused ? 24 : 22,
            height: focused ? 24 : 22,
            tintColor: focused ? 'white' : '#9CA3AF', // white when active, gray when inactive
            opacity: focused ? 1 : 0.7,
          }}
          resizeMode='contain'
        />
      </View>
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#3d3f45', 
          borderTopColor: '#374151',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
          marginBottom:10,
          marginHorizontal: 16,
          borderRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4,
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
      />*/}

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.profile} />,
        }}
      /> 
    </Tabs>
  );
};

export default TabLayout;