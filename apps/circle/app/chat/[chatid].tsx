import React, { useCallback, useEffect, useState, useRef } from "react";

import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
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

//components
import ChatMessageBox from "@/components/ChatComponents/ChatMessageBox";
import Replybar from "@/components/ChatComponents/Replybar";

import {
  SwipeableProps,
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

// sending message hook
import { useSendMessage } from "@/hooks/mutations/useSendMessage";

// fetch messages hook
import { useFetchChatMessages } from "@/hooks/queries/useFetchChatMessages";

// expo router
import { useLocalSearchParams } from "expo-router";

// user store
import { useUser } from "@/hooks/stores/userStore";

type CustomSwipeProps = SwipeableProps & SwipeableMethods;

const Chat = () => {
  // chat id
  const { chatid } = useLocalSearchParams<{ chatid: string }>();

  // current user
  const { user } = useUser();

  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  // send message mutation
  const sendMutation = useSendMessage();

  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  // fetching messages
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    status,
    isFetchingNextPage,
  } = useFetchChatMessages(chatid);

  // flatten the messages
  const queryMessages = data?.pages.flatMap((page) => page.messages) ?? [];

  // format the message for gifted chat
  const formattedMessages = queryMessages.map((m) => ({
    _id: m.id,
    text: m.text,
    createdAt: new Date(m.sentAt),
    user: {
      _id: m.sender?.id,
      name: m.sender?.name,
      avatar: m.sender?.profileImage,
    },
  }));

  const messages = formattedMessages;

  const SwipeableRowRef = useRef<CustomSwipeProps | null>(null);

  useEffect(() => {
    if (replyMessage && SwipeableRowRef.current) {
      SwipeableRowRef.current?.close();
      SwipeableRowRef.current = null;
    }
  }, [replyMessage]);

  const onSend = useCallback(
    (messages = []) => {
      const newMessage = messages[0];

      const payload = {
        chatId: chatid,
        text: newMessage.text,
        repliedToId: replyMessage?._id ?? null,
        senderId: user?.id,
      };

      sendMutation.mutateAsync(payload);
    },
    [chatid, replyMessage?._id, user?.id]
  );

  const updateRowRef = useCallback(
    (ref: any, message: IMessage) => {
      if (ref && replyMessage && message._id === replyMessage._id) {
        SwipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  const styles = StyleSheet.create({
    composer: {
      color: isDark ? "#fff" : "#000",
    },
  });

  if (isError) {
    return (
      <View className="flex-1 bg-light-100 dark:bg-dark-100 items-center justify-center">
        <Text className="dark:text-white">Something went wrong</Text>
      </View>
    );
  }

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
          {isLoading ? (
            <View className="flex-col flex-1 gap-2 items-center justify-center">
              <ActivityIndicator />

              <Text className="text-gray-500">Getting messages...</Text>
            </View>
          ) : (
            <GiftedChat
              bottomOffset={-insets.bottom}
              messages={messages}
              loadEarlier={hasNextPage}
              isLoadingEarlier={isFetchingNextPage}
              onLoadEarlier={() => fetchNextPage()}
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
                        backgroundColor: isDark
                          ? Colors.interp_dark_bg
                          : "#fff",

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
                    <TouchableOpacity className="h-12  items-center justify-center ml-2">
                      <ThemeIcon icon={SmilePlus} />
                    </TouchableOpacity>
                  )}
                />
              )}
              user={{
                _id: user?.id,
                name: user?.name,
                avatar: user?.profileImage,
              }}
              renderMessage={(props) => (
                <ChatMessageBox
                  updateRowRef={updateRowRef}
                  setReplyOnSwipeOpen={setReplyMessage}
                  {...props}
                />
              )}
              renderFooter={() => (
                <Replybar
                  clearMessage={() => setReplyMessage(null)}
                  isDark={isDark}
                  message={replyMessage}
                />
              )}
            />
          )}
          {Platform.OS === "android" && (
            <KeyboardAvoidingView behavior="padding" />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default Chat;
