import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// components
import ChatList from "./ChatList";

// hooks
import { useFetchUserChats } from "@/hooks/queries/useFetchChats";

const ChatTabScene = ({ category }: { category: string }) => {
  const {
    isLoading,
    data: chats,
    isError,
    error,
  } = useFetchUserChats(category);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  if (isError && !isLoading) {
    console.log(error);
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
