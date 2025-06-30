import Avatar from "@/components/UI/Avatar";
import React from "react";
import { FlatList, Text, View } from "react-native";

const Status = () => {
  return (
    <View className="py-2 mb-4">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          // add the touchable to add user story
          <View className="items-start justify-center gap-x-4 mr-4">
            <Avatar variant="md" />
            <Text
              className="dark:text-white font-poppins_light font-normal tracking-normal text-sm mt-1 line-clamp-1"
              numberOfLines={1}
            >
              Username
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Status;
