import { Stack } from "expo-router";
import React from "react";

// components
import ThemeIcon from "@/components/UI/ThemeIcon";

// icons
import { MoveLeft } from "lucide-react-native";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="signup"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => <ThemeIcon icon={MoveLeft} size={28} />,
          headerTitle: "",
        }}
      />
      {/* <Stack.Screen
        name="verification"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => <ThemeIcon icon={MoveLeft} size={28} />,
          headerTitle: "",
        }}
      /> */}
      <Stack.Screen name="setup" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
