import React, { useCallback } from "react";

// routing
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

// firebase auth
import auth from "@react-native-firebase/auth";

// components
import ChatTabs from "@/components/ChatComponents/ChatTabs";

const chats = () => {
  useFocusEffect(
    useCallback(() => {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        router.replace("/(auth)/signup");
      }
    }, [])
  );

  return <ChatTabs />;
};

export default chats;
