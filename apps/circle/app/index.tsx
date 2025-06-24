import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

// native theme
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";

const index = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

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

            <Link href="/contacts" className="dark:text-white">
              Powered by GakuruCodes
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default index;
