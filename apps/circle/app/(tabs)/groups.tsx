import React from "react";
import { FlatList, View } from "react-native";

// Components
import Message from "@/components/UI/Message";

const groups = () => {
  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-2">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item) => item.toString()}
        renderItem={({ message }) => <Message />}
      />
    </View>
  );
};

export default groups;
