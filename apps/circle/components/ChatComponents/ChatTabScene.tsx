import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// components
import ChatList from "./ChatList";

// hooks
import { useFetchUserChats } from "@/hooks/queries/useFetchChats";

// Dummy data simulating server response
const dummyChats = [
  { id: 1, type: "group", name: "Dev Team" },
  { id: 2, type: "family", name: "Mom" },
  { id: 3, type: "group", name: "Study Buddies" },
  { id: 4, type: "family", name: "Dad" },
  { id: 5, type: "work", name: "CEO" },
  { id: 6, type: "all", name: "Alice" },
];

const ChatTabScene = ({ category }: { category: string }) => {
  const { isLoading, data: chats, isError } = useFetchUserChats(category);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center dark:text-white text-lg font-medium">
          We couldn’t load your chats.
        </Text>
        <Text className="text-center dark:text-white text-gray-500 mt-2">
          Please check your internet connection and try again.
        </Text>
      </View>
    );
  }

  return <ChatList chats={chats} />;
};

export default ChatTabScene;
