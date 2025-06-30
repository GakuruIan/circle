import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View, Animated } from "react-native";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

// native theme
import { useColorScheme } from "nativewind";

// router
import { useRouter } from "expo-router";

// splashScreen
import * as SplashScreen from "expo-splash-screen";

// firebase
import {
  getAuth,
  onAuthStateChanged,
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";

SplashScreen.preventAutoHideAsync();

const Index = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const router = useRouter();

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user: FirebaseAuthTypes.User | null) => {
        // Animate splash fade-in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        // Delay navigation for 2 seconds
        const timer = setTimeout(async () => {
          await SplashScreen.hideAsync();

          if (user) {
            router.replace("/(tabs)/chats");
          } else {
            router.replace("/(auth)/signup");
          }
        }, 2000);

        // Clear timeout on cleanup
        return () => clearTimeout(timer);
      }
    );

    return unsubscribe;
  }, [fadeAnim, router]);

  return (
    <>
      <StatusBar
        style={isDark ? "dark" : "light"}
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView className="flex-1 dark:bg-dark-300 bg-white">
        <View className="flex-1 relative items-center justify-center">
          <View className="border size-10 rounded-full border-gray-950 dark:border-gray-50" />

          <Text className="dark:text-white font-poppins_semibold  mt-4 text-3xl tracking-wider">
            Circle
          </Text>

          <View className="absolute items-center bottom-10 gap-y-4">
            <ActivityIndicator size="small" color="#03BD49" />

            <View>
              <Text className="dark:text-white font-poppins_regular text-sm -tracking-tight font-medium">
                Powered by GakuruCodes
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Index;
