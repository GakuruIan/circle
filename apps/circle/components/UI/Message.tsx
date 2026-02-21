import React from "react";
import { Text, View } from "react-native";

// components
import Avatar from "./Avatar";
import SwipeableRow from "./SwipeableRow";

// utils
import { formatMessageTime } from "@/lib/utils";

// router
import { Link } from "expo-router";

interface MessageProps {
  id: string;
  username: string;
  time: string;
  message: string;
  unreadCount: number;
}

const Message = ({
  id,
  username,
  time,
  message,
  unreadCount,
}: MessageProps) => {
  return (
    <SwipeableRow>
      <Link href={`/chat/${id}`} className="flex flex-row flex-1">
        <View className="flex-row  flex-1 items-start py-2 mb-1 px-1.5">
          <Avatar variant="md" />
          {/* message snippet */}
          <View className="flex-col flex-1 ml-2">
            {/* username and time */}
            <View className="flex-row items-center justify-between mb-1">
              {/* username */}
              <Text className="dark:text-white text-base font-medium font-poppins_semibold tracking-wide">
                {username}
              </Text>
              {/* time */}
              <Text className="dark:text-gray-400 text-gray-600 font-poppins_regular text-xs">
                {formatMessageTime(time)}
              </Text>
            </View>

            <View className="flex-row flex-1 items-start justify-between">
              <View className="flex-1">
                <Text
                  className="text-sm font-poppins_regular dark:text-white max-w-"
                  numberOfLines={1}
                >
                  {message}
                </Text>
              </View>
              {unreadCount > 0 && (
                <View className="w-5 h-5 items-center justify-center bg-primary  rounded-full ">
                  <Text className="font-poppins_regular text-sm text-white">
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Link>
    </SwipeableRow>
  );
};

export default Message;
