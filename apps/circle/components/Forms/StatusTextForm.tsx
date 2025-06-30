import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// components
import ThemeIcon from "../UI/ThemeIcon";

// icons
import { MoveLeft, Palette, Smile } from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// expo router
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const StatusTextForm = () => {
  // colors
  const Colors = [
    "#FE9B72",
    "#181828",
    "#FFD3AC",
    "#6A66FF",
    "#E87052",
    "#2669ED",
    "#4632EB",
  ];

  const { width } = Dimensions.get("screen");

  const topPadding = useSafeAreaInsets().top;
  const bottomPadding = useSafeAreaInsets().bottom;
  const fabExpanded = useSharedValue(0);
  const selectedColorIndex = useSharedValue(0); // Track selected color
  const buttonScales = Colors.map(() => useSharedValue(1));

  const router = useRouter();

  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const [statusText, setStatusText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // function to determine if the background is a dark color then make the text dynamic
  const isLightColor = (hexColor: string) => {
    "worklet";
    const hex = hexColor.replace("#", "");

    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance using the relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if light (luminance > 0.5)
    return luminance > 0.5;
  };

  const getTextColor = (backgroundColor: string) => {
    "worklet";
    return isLightColor(backgroundColor) ? "#000000" : "#FFFFFF";
  };

  const toggleFAB = () => {
    fabExpanded.value = withSpring(fabExpanded.value === 0 ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleColorSelect = (index: number) => {
    // Animate button press
    buttonScales[index].value = withSpring(
      0.8,
      {
        damping: 15,
        stiffness: 200,
      },
      () => {
        buttonScales[index].value = withSpring(1, {
          damping: 15,
          stiffness: 200,
        });
      }
    );

    // Update selected color
    selectedColorIndex.value = withTiming(index, {
      duration: 300,
    });

    // Close FAB after selection
    toggleFAB();
  };

  const backgroundStyle = useAnimatedStyle(() => {
    // Create input and output ranges for all colors
    const inputRange = Colors.map((_, index) => index);
    const outputRange = Colors;

    const backgroundColor = interpolateColor(
      selectedColorIndex.value,
      inputRange,
      outputRange
    );

    return {
      backgroundColor,
    };
  });

  // Main FAB rotation
  const mainFabStyle = useAnimatedStyle(() => {
    const rotate = interpolate(fabExpanded.value, [0, 1], [0, 45]);

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  // Sub-button animations
  const CreateColorDisplay = (index: number) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        fabExpanded.value,
        [0, 1],
        [0, -(60 * (index + 1))]
      );

      const opacity = interpolate(fabExpanded.value, [0, 0.5, 1], [0, 0, 1]);
      const scale = interpolate(fabExpanded.value, [0, 1], [0, 1]);
      const display = fabExpanded.value === 0 ? "none" : "flex";
      return {
        transform: [{ translateY }, { scale }],
        opacity,
        display,
      };
    });
  };

  const textColorStyle = useAnimatedStyle(() => {
    const textColors = Colors.map((color) => getTextColor(color));
    const inputRange = Colors.map((_, index) => index);

    const textColor = interpolateColor(
      selectedColorIndex.value,
      inputRange,
      textColors
    );

    return {
      color: textColor,
    };
  });

  return (
    <Animated.View
      className="flex-1 relative"
      style={[{ paddingTop: topPadding + 10 }, backgroundStyle]}
    >
      <View className="px-2" style={{ height: topPadding + 20 }}>
        <View className="flex-row items-center justify-between mb-2 px-4 mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ThemeIcon icon={MoveLeft} size={28} lightColor="#fff" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <TouchableOpacity>
              <ThemeIcon icon={Smile} lightColor="#fff" />

              {statusText.length > 600 && (
                <Animated.Text
                  style={[
                    {
                      position: "absolute",
                      bottom: 10,
                      right: 20,
                      fontSize: 12,
                      opacity: 0.7,
                    },
                    textColorStyle,
                  ]}
                >
                  {700 - statusText.length}
                </Animated.Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* input */}

      <View className="flex-1 px-4 items-start">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? topPadding + 10 : 0}
          style={{ flex: 1 }}
        >
          <Animated.View style={textColorStyle}>
            <TextInput
              value={statusText}
              onChangeText={setStatusText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a status..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              multiline={true}
              textAlignVertical="center"
              style={{
                flex: 1,
                width: width - 32,
                fontSize:
                  statusText.length > 60
                    ? 24
                    : statusText.length > 30
                      ? 32
                      : 40,
                fontWeight: "600",
                textAlign: "center",
                paddingHorizontal: 20,
                paddingVertical: 20,
                lineHeight:
                  statusText.length > 60
                    ? 28
                    : statusText.length > 30
                      ? 36
                      : 44,
                color: "#fff", // fallback color
              }}
              maxLength={700}
              scrollEnabled={true}
              returnKeyType="default"
              autoCorrect={true}
              spellCheck={true}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </View>

      {/* input */}

      {/* color pickers */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 12,
          paddingBottom: Math.max(bottomPadding, 20),
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {statusText.trim().length > 0 && (
          <View
            style={{
              position: "absolute",
              left: 12,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 20,
                marginLeft: 8,
              }}
              onPress={() => {
                // Handle status posting here
                console.log("Status:", statusText);
              }}
            >
              <Animated.Text
                style={[
                  {
                    fontSize: 14,
                    fontWeight: "600",
                  },
                  textColorStyle,
                ]}
              >
                Post
              </Animated.Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FAB Buttons Container */}
        <View
          style={{
            position: "relative",
            alignItems: "flex-end", // Align to the right
            justifyContent: "flex-end",
          }}
        >
          {/* Sub Buttons */}
          {Colors.map((color, index) => (
            <AnimatedTouchableOpacity
              key={index}
              style={[
                {
                  position: "absolute",
                  bottom: 15,
                  right: 5,
                  width: 42,
                  height: 42,
                  borderRadius: 24,
                  backgroundColor: color,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  zIndex: 2,
                },
                CreateColorDisplay(index),
              ]}
              onPress={() => handleColorSelect(index)}
              activeOpacity={0.8}
            />
          ))}

          {/* Main FAB Button - Fixed size */}
          <View>
            <AnimatedTouchableOpacity
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                zIndex: 10,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
              onPress={toggleFAB}
              activeOpacity={0.8}
            >
              <Animated.View style={mainFabStyle}>
                <ThemeIcon
                  icon={Palette}
                  darkColor="#fff"
                  lightColor="#fff"
                  size={24}
                />
              </Animated.View>
            </AnimatedTouchableOpacity>
          </View>
        </View>
      </View>
      {/* color pickers */}
      <StatusBar style="inverted" />
    </Animated.View>
  );
};

export default StatusTextForm;
