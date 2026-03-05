import { icons } from "@/constants";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SIDE_MENU_WIDTH = 220;

const routeIconMap: Record<string, ImageSourcePropType> = {
  home: icons.home,
  children: icons.person,
  sub: icons.list,
  profile: icons.profile,
};

const routeTitleMap: Record<string, string> = {
  home: "Home",
  children: "Children",
  sub: "Subscriptions",
  profile: "Profile",
};

const SidePopoutTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDE_MENU_WIDTH - 24)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: open ? 0 : -SIDE_MENU_WIDTH - 24,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [open, slideAnim]);

  useEffect(() => {
    setOpen(false);
  }, [state.index]);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {open && (
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
      )}

      <Animated.View
        style={[
          styles.sidePanel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Text style={styles.menuTitle}>Menu</Text>

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key]?.options;
          const label =
            typeof options?.title === "string"
              ? options.title
              : routeTitleMap[route.name] || route.name;

          const iconSource = routeIconMap[route.name] || icons.home;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.menuItem, isFocused && styles.menuItemActive]}
              onPress={onPress}
            >
              <Image
                source={iconSource}
                style={[styles.menuIcon, isFocused && styles.menuIconActive]}
                resizeMode="contain"
              />
              <Text
                style={[styles.menuLabel, isFocused && styles.menuLabelActive]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      <TouchableOpacity
        style={styles.menuToggle}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={styles.menuToggleText}>{open ? "<" : ">"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const TabLayout = () => {
  return (
    <>
      <Tabs
        initialRouteName="home"
        tabBar={(props) => <SidePopoutTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />

        <Tabs.Screen
          name="children"
          options={{
            title: "Children",
          }}
        />
        <Tabs.Screen
          name="sub"
          options={{
            title: "Subscriptions",
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>

      <StatusBar
        translucent={false}
        style="light"
        backgroundColor={"#0D1B12"}
      />
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sidePanel: {
    position: "absolute",
    left: 12,
    top: "50%",
    marginTop: -150,
    width: SIDE_MENU_WIDTH,
    backgroundColor: "#102618",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(252,209,22,0.28)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
  },
  menuTitle: {
    color: "#FCD116",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  menuItemActive: {
    backgroundColor: "rgba(7,137,48,0.28)",
  },
  menuIcon: {
    width: 20,
    height: 20,
    tintColor: "#D9CC8A",
    marginRight: 10,
  },
  menuIconActive: {
    tintColor: "#FFFFFF",
  },
  menuLabel: {
    color: "#D9CC8A",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
  menuLabelActive: {
    color: "#FFFFFF",
  },
  menuToggle: {
    position: "absolute",
    left: 12,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#078930",
    borderWidth: 2,
    borderColor: "#FCD116",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuToggleText: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 24,
    fontFamily: "Poppins-Bold",
  },
});
