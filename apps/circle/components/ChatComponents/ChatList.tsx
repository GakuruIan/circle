import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";

// components
import Message from "../UI/Message";
import ThemeIcon from "../UI/ThemeIcon";

// icons
import { Archive } from "lucide-react-native";

// theming
import { Colors } from "@/constants/Colors";

type props = {
  chats: any[];
};

const ChatList = ({ chats }: props) => {
  const { height } = Dimensions.get("screen");

  return (
    <View className="flex-1   pt-2">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={chats}
        ListHeaderComponent={() => (
          <View className="flex-row items-center justify-between w-full mb-6 px-2">
            <Text className="text-base font-poppins_semibold dark:text-gray-400 text-gray-500">
              Archive
            </Text>

            <ThemeIcon
              size={20}
              icon={Archive}
              darkColor={Colors.light_gray}
              lightColor={Colors.light_gray}
            />
          </View>
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Message
            id={item.id}
            username={item.name}
            time={item.lastMessage.sentAt}
            message={item.lastMessage.text}
            unreadCount={item.unreadCount}
          />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,

              alignItems: "center",
              justifyContent: "center",
              height: height * 0.65,
            }}
          >
            <Text className="text-gray-700 dark:text-gray-400 font-poppins_semibold font-medium text-xl tracking-wide mb-1">
              No chats yet 👋.
            </Text>
            <Text className="text-gray-500  dark:text-gray-400 font-poppins_regular text-base tracking-wide">
              Say hi to someone and break the silence!
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ChatList;
