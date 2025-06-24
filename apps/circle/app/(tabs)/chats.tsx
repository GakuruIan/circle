import React from "react";
import { FlatList, View } from "react-native";

// components
import Status from "@/components/Status/Status";
import Message from "@/components/UI/Message";

const chats = () => {
  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-2">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        ListHeaderComponent={<Status />}
        keyExtractor={(item) => item.toString()}
        renderItem={({ message }) => <Message />}
      />
    </View>
  );
};

export default chats;
