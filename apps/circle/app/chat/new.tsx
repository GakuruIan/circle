import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useFindOrCreateChat } from "@/hooks/mutations/useFindOrCreateChat";

export default function NewChatScreen() {
  const { recipient } = useLocalSearchParams<{ recipient: string }>();

  const router = useRouter();

  const chatMutation = useFindOrCreateChat();

  const FindOrCreate = async () => {
    if (recipient) {
      const chat = await chatMutation.mutateAsync(recipient);

      router.replace(`/chat/${chat?.id}`);
    }
  };

  useEffect(() => {
    FindOrCreate();
  }, [recipient]);

  return (
    <View className="flex-1 items-center justify-center bg-light-100 dark:bg-dark-100">
      {chatMutation.isPending && (
        <View className="flex-col space-y-2">
          <ActivityIndicator size="large" color="#03BD49" />
          <Text className="dark:text-white">Starting chat...</Text>
        </View>
      )}

      {chatMutation.isError && (
        <Text className="text-red-500 mt-4">
          {chatMutation.error instanceof Error
            ? chatMutation.error.message
            : "Something went wrong"}
        </Text>
      )}
    </View>
  );
}
