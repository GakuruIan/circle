import React, { useCallback, useEffect, useState } from "react";

import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// components
import Avatar from "@/components/UI/Avatar";
import ThemeIcon from "@/components/UI/ThemeIcon";

// icons
import {
  Camera,
  ChevronLeft,
  Paperclip,
  Phone,
  SendHorizontal,
  SmilePlus,
  Video,
} from "lucide-react-native";

// gift chat
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";

// background image
import darkDoodle from "@/assets/images/dark_doodle.jpg";
import lightDoodle from "@/assets/images/light_doodle.jpg";
// theming
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

const Chat = () => {
  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState("");

  // useFocusEffect(
  //   useCallback(() => {
  //     if (Platform.OS === "android") {
  //       AvoidSoftInput.setAdjustResize();
  //       AvoidSoftInput.setEnabled(true);
  //     }
  //     return () => {
  //       if (Platform.OS === "android") {
  //         AvoidSoftInput.setEnabled(false);
  //         AvoidSoftInput.setAdjustPan();
  //       }
  //     };
  //   }, [])
  // );

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const styles = StyleSheet.create({
    composer: {
      color: isDark ? "#fff" : "#000",
    },
  });

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-100 ">
      {/* topbar */}
      <View
        style={[{ height: insets.top + 60, paddingTop: insets.top }]}
        className="flex-row items-center w-full justify-between px-2.5"
      >
        <View className="flex-row items-center">
          <ThemeIcon icon={ChevronLeft} size={24} className="mr-2" />

          {/* user avatar,name and last seen */}
          <View className="flex-row items-center">
            <Avatar variant="sm" />
            <View className="ml-1.5">
              <Text
                numberOfLines={1}
                className="font-poppins_regular text-base dark:text-white"
              >
                Username
              </Text>
              {/* last seen */}
              <Text className="text-sm font-poppins_regular dark:text-white">
                Online
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-x-6">
          <ThemeIcon icon={Video} size={24} />
          <ThemeIcon icon={Phone} size={20} />
        </View>
      </View>
      {/* topbar */}

      <ImageBackground
        source={isDark ? darkDoodle : lightDoodle}
        className="flex-1 "
      >
        <View className="flex-1" style={{ marginBottom: insets.bottom }}>
          <GiftedChat
            bottomOffset={-insets.bottom}
            messages={messages}
            renderAvatar={null}
            onInputTextChanged={setMessage}
            maxComposerHeight={100}
            minInputToolbarHeight={60}
            onSend={(messages: any) => onSend(messages)}
            renderSend={(props) => (
              <View className="flex-row h-12  items-center justify-center gap-3.5  px-3">
                {message.length > 0 ? (
                  <Send
                    {...props}
                    containerStyle={{ justifyContent: "center" }}
                  >
                    <View className="bg-primary p-2 rounded-full items-center justify-center">
                      <ThemeIcon
                        icon={SendHorizontal}
                        darkColor="#fff"
                        lightColor="#fff"
                      />
                    </View>
                  </Send>
                ) : (
                  <View className="flex-row items-center gap-x-5">
                    <ThemeIcon icon={Paperclip} />
                    <ThemeIcon icon={Camera} />
                  </View>
                )}
              </View>
            )}
            textInputProps={styles.composer}
            renderBubble={(props) => {
              return (
                <Bubble
                  {...props}
                  textStyle={{
                    left: {
                      color: isDark ? "#fff" : "#000",
                    },
                    right: {
                      color: "#fff",
                    },
                  }}
                  wrapperStyle={{
                    left: {
                      backgroundColor: isDark ? Colors.interp_dark_bg : "#fff",

                      borderRadius: 10,
                      padding: 4,
                    },
                    right: {
                      backgroundColor: "#6A66FF",
                      padding: 4,
                      borderRadius: 10,
                    },
                  }}
                />
              );
            }}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={{
                  backgroundColor: isDark ? Colors.interp_dark_bg : "#fff",
                  alignItems: "center",
                  borderTopWidth: 0,
                  paddingVertical: 6,
                  paddingHorizontal: 6,
                  marginHorizontal: 4,
                  borderRadius: 40,
                }}
                renderActions={() => (
                  <View className="h-12  items-center justify-center ml-2">
                    <ThemeIcon icon={SmilePlus} />
                  </View>
                )}
              />
            )}
            user={{
              _id: 1,
            }}
          />
          {Platform.OS === "android" && (
            <KeyboardAvoidingView behavior="padding" />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default Chat;
