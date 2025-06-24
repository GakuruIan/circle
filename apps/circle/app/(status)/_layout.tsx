import React from "react";

import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[type]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[userid]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
