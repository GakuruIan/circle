import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

// icons
import { Trash2 } from "lucide-react-native";

import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ThemeIcon from "./ThemeIcon";

const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 90 }],
    };
  });

  return (
    <Animated.View
      style={[styleAnimation, { flexDirection: "row", alignItems: "center" }]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.rightAction]}
        className="items-center  justify-center bg-rose-600"
      >
        <ThemeIcon icon={Trash2} darkColor="#fff" lightColor="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - 90 }],
    };
  });

  return (
    <Animated.View
      style={[styleAnimation, { flexDirection: "row", alignItems: "center" }]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.rightAction]}
        className="items-center   justify-center bg-blue-600"
      >
        <ThemeIcon icon={Trash2} darkColor="#fff" lightColor="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

interface props {
  children: React.ReactNode;
}

export default function SwipeableRow({ children }: props) {
  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeable}
      friction={1}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}
      renderLeftActions={LeftAction}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: { width: 90, height: 50 },
  swipeable: {
    width: "100%",
  },
});
