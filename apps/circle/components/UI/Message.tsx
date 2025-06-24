import React from "react";
import { Text, View } from "react-native";

// components
import Avatar from "./Avatar";

const Message = () => {
  return (
    <View className="flex-row  flex-1 items-start py-2 mb-1 ">
      <Avatar variant="md" />
      {/* message snippet */}
      <View className="flex-col flex-1 ml-2">
        {/* username and time */}
        <View className="flex-row items-center justify-between mb-1">
          {/* username */}
          <Text className="dark:text-white text-sm font-medium font-poppins_semibold tracking-wide">
            Username
          </Text>
          {/* time */}
          <Text className="dark:text-gray-400 text-gray-600 font-poppins_regular text-xs">
            19:00
          </Text>
        </View>

        <View className="flex-row flex-1 items-start justify-between">
          <View className="flex-1">
            <Text
              className="text-sm font-poppins_regular dark:text-white max-w-"
              numberOfLines={1}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates perferendis mollitia beatae laborum, dolor tempore.
            </Text>
          </View>

          <View className="w-5 h-5 items-center justify-center bg-primary  rounded-full ">
            <Text className="font-poppins_regular text-sm text-white">1</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Message;
