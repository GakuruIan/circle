import React from "react";
import { Platform, Pressable, TouchableOpacity, View } from "react-native";

import { Tabs } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// icons
import {
  Camera,
  ClockFading,
  EllipsisVertical,
  MessageCircle,
  Phone,
  Search,
  Settings,
  SquarePen,
  Users,
} from "lucide-react-native";

//color scheme
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
// components
import Avatar from "@/components/UI/Avatar";
import HeaderTitle from "@/components/UI/HeaderTitle";
import ThemeIcon from "@/components/UI/ThemeIcon";

const TabLayout = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Colors based on theme
  const activeColor = Colors.primary;
  const inactiveColor = isDark ? "#fff" : "#222";
  const backgroundColor = isDark ? "#000" : "#ffffff";
  const border = isDark ? "#B1B4BA" : "#D4D7DB";

  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={null}>
            {props.children}
          </Pressable>
        ),
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerPressColor: "transparent",
        tabBarStyle: {
          backgroundColor,
          borderTopColor: border,
          paddingTop: 5,
          height: 50 + insets.bottom,
          paddingBottom:
            insets.bottom > 0
              ? insets.bottom
              : Platform.select({
                  ios: 20, // Default padding for iOS
                  android: 20, // Default padding for Android
                }),
        },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Messages" />,
          headerRight: () => (
            <View className="flex-row items-center gap-x-2 mr-2">
              <TouchableOpacity className="mx-2">
                <ThemeIcon icon={SquarePen} size={22} />
              </TouchableOpacity>

              <TouchableOpacity className="mx-2">
                <ThemeIcon icon={Camera} size={22} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerTitle: () => <HeaderTitle title="Groups" />,
          headerRight: () => (
            <View className="flex-row items-center gap-x-2 mr-2">
              <TouchableOpacity>
                <ThemeIcon icon={EllipsisVertical} size={22} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="status"
        options={{
          title: "Status",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => (
            <ClockFading size={size} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Status" />,
          headerRight: () => (
            <View className="flex-row items-center gap-x-2 mr-2">
              <TouchableOpacity className="mr-3">
                <ThemeIcon icon={Search} size={22} />
              </TouchableOpacity>

              <TouchableOpacity>
                <ThemeIcon icon={EllipsisVertical} size={22} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="calls"
        options={{
          title: "Calls",
          headerShown: true,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => <Phone size={size} color={color} />,
          headerTitle: () => <HeaderTitle title="Calls" />,
          headerRight: () => (
            <View className="flex-row items-center gap-x-2 mr-2">
              <TouchableOpacity className="mr-3">
                <ThemeIcon icon={Search} size={22} />
              </TouchableOpacity>

              <TouchableOpacity>
                <ThemeIcon icon={EllipsisVertical} size={22} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          tabBarIcon: ({ focused }) => <Avatar variant="xs" />,
          headerRight: () => (
            <TouchableOpacity className="mr-3">
              <ThemeIcon icon={Settings} />
            </TouchableOpacity>
          ),
          headerTitle: () => <HeaderTitle title="Profile" />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
