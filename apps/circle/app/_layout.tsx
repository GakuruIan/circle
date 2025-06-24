import { useEffect } from "react";

import * as SplashScreen from "expo-splash-screen";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import "@/global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Poppins_Bold: require("../assets/fonts/Poppins-Bold.ttf"),
    Poppins_SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    Poppins_Regular: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="user/[userid]"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="contacts"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="group/[groupid]"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="chat/[chatid]"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(status)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
