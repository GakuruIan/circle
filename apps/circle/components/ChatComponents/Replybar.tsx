import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

// imessage props
import { IMessage } from "react-native-gifted-chat";

import Animated, {
  FadeInDown,
  FadeOutDown,
  Easing,
} from "react-native-reanimated";

// components
import ThemeIcon from "../UI/ThemeIcon";

// icons
import { CircleX } from "lucide-react-native";

interface replyProps {
  clearMessage: () => void;
  message: IMessage | null;
  isDark: boolean;
}

const Replybar = ({ isDark, clearMessage, message }: replyProps) => {
  return (
    <>
      {message && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown.delay(100)
            .duration(300)
            .easing(Easing.out(Easing.cubic))}
          style={{
            height: 80,
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            paddingHorizontal: 12,
            backgroundColor: isDark ? "#171a1c" : "#E4E9EB",
            borderRadius: 8,
            marginBottom: 4,
            marginHorizontal: 4,
            flex: 1,
          }}
        >
          <View className="flex-1">
            <Text className="text-text font-poppins_semibold tracking-tight dark:text-white">
              {message?.user.name}
            </Text>
            <Text className="text-sm font-poppins_regular dark:text-white">
              {message!.text.length > 40
                ? message.text.substring(0, 40) + "..."
                : message.text}
            </Text>
          </View>

          {message?.image && (
            <Image
              src={message?.image}
              className="size-16 rounded-lg"
              style={{ aspectRatio: 1 }}
            />
          )}

          <View className=" items-end ">
            <TouchableOpacity activeOpacity={0.7} onPress={clearMessage}>
              <ThemeIcon icon={CircleX} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default Replybar;
