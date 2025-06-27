import React, { useEffect, useRef } from "react";
import {
  IMessage,
  Message,
  MessageProps,
  isSameDay,
  isSameUser,
} from "react-native-gifted-chat";

import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Reply } from "lucide-react-native";
import ThemeIcon from "../UI/ThemeIcon";

type ChatMessageBoxProps = {
  setReplyOnSwipeOpen: (message: IMessage) => void;
  updateRowRef: (ref: any, message: IMessage) => void;
} & MessageProps<IMessage>;

const ChatMessageBox = ({
  setReplyOnSwipeOpen,
  updateRowRef,
  ...props
}: ChatMessageBoxProps) => {
  const currentMessageRef = useRef<IMessage | undefined>(props.currentMessage);

  useEffect(() => {
    currentMessageRef.current = props.currentMessage;
  }, [props.currentMessage]);

  const isNextMyMessage =
    props.currentMessage &&
    props.nextMessage &&
    isSameUser(props.currentMessage, props.nextMessage) &&
    isSameDay(props.currentMessage, props.nextMessage);

  const RenderLeftActions = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value - 30 }],
    }));

    return (
      <Animated.View
        style={[styleAnimation, { flexDirection: "row", alignItems: "center" }]}
      >
        <ThemeIcon icon={Reply} darkColor="#fff" lightColor="#000" />
      </Animated.View>
    );
  };

  const handleSwipeOpen = () => {
    const message = currentMessageRef.current;
    if (message) {
      setReplyOnSwipeOpen({ ...message });
    }
  };

  return (
    <ReanimatedSwipeable
      ref={(ref) => {
        if (ref && props.currentMessage) {
          updateRowRef(ref, props.currentMessage);
        }
      }}
      friction={1}
      enableTrackpadTwoFingerGesture
      leftThreshold={20}
      renderLeftActions={RenderLeftActions}
      onSwipeableOpen={handleSwipeOpen}
    >
      <Message {...props} />
    </ReanimatedSwipeable>
  );
};

export default ChatMessageBox;
