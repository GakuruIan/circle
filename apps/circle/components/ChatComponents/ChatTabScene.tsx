import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ChatList from "./ChatList";

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
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate server delay
    const timeout = setTimeout(() => {
      const filtered =
        category === "all"
          ? dummyChats
          : dummyChats.filter((chat) => chat.type === category);

      setChats(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [category]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return <ChatList chats={chats} />;
};

export default ChatTabScene;
