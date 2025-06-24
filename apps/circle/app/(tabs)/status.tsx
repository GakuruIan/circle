import React from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";

// components
import Avatar from "@/components/UI/Avatar";
import ThemeIcon from "@/components/UI/ThemeIcon";

// icons
import { Camera, Feather, Image, Mic, Plus } from "lucide-react-native";

import { router } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const Status = () => {
  const fabExpanded = useSharedValue(0);

  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const toggleFAB = () => {
    fabExpanded.value = withSpring(fabExpanded.value === 0 ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  };

  // Overlay animation
  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(fabExpanded.value, [0, 1], [0, 0.3]);

    return {
      opacity,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  const CreateSubButtonStyle = (index) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        fabExpanded.value,
        [0, 1],
        [0, -(65 * (index + 1))]
      );

      const opacity = interpolate(fabExpanded.value, [0, 0.5, 1], [0, 0, 1]);
      const scale = interpolate(fabExpanded.value, [0, 1], [0, 1]);

      return {
        transform: [{ translateY }, { scale }],
        opacity,
      };
    });
  };

  const subButtons = [
    { icon: Camera, label: "Camera", color: "#2669ED" },
    { icon: Image, label: "Gallery", color: "#298A6D" },
    { icon: Mic, label: "Voice", color: "#DC1652" },
    { icon: Feather, label: "Text", color: "#E87052" },
  ];

  return (
    <View className="flex-1 relative px-2 dark:bg-dark-300 bg-white">
      <SectionList
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        sections={[
          {
            title: "Recent status",
            data: [1, 2, 3, 4, 5],
          },
          {
            title: "Seen status",
            data: [1, 2, 3, 4, 5],
          },
        ]}
        keyExtractor={(item) => item?.toString()}
        ListHeaderComponent={() => (
          <View className="mb-4">
            <View className="">
              <View className="flex-row items-center gap-x-2">
                <View className="relative flex-row">
                  <Avatar variant="md" />
                </View>
                <View>
                  <Text className="font-poppins font-semibold dark:text-white">
                    My status
                  </Text>
                  <Text className="font-poppins text-sm text-gray-500">
                    Tap to add status update
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="mb-4">
            <View className="flex-row items-center gap-x-2">
              <View className="relative flex-row">
                <Avatar variant="md" />
              </View>
              <View>
                <Text className="font-poppins font-medium text-base dark:text-white">
                  Username status
                </Text>
                <Text className="font-poppins text-sm text-gray-500">
                  20 minutes ago
                </Text>
              </View>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View className="py-2">
            <Text className="font-poppins font-semibold text-gray-400">
              {title}
            </Text>
          </View>
        )}
      />

      {/* FAB Container */}
      <View>
        {/* Background Overlay */}
        <AnimatedTouchableOpacity
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: fabExpanded.value > 0.1 ? 1 : -1,
            },
            overlayStyle,
          ]}
          onPress={toggleFAB}
          activeOpacity={1}
        />

        {/* FAB Buttons Container */}
        <View
          style={{
            position: "absolute",
            bottom: 80,
            right: 12,
            alignItems: "flex-end",
          }}
        >
          {/* Sub Buttons */}
          {subButtons.map((button, index) => (
            <AnimatedTouchableOpacity
              key={index}
              style={[
                {
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: button.color,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  zIndex: 2,
                },
                CreateSubButtonStyle(index),
              ]}
              onPress={() => {
                toggleFAB(); // Close FAB after selection
                router.push(`/(status)/${button.label}`);
              }}
            >
              <ThemeIcon
                icon={button.icon}
                darkColor="#fff"
                lightColor="#fff"
                size={20}
              />
            </AnimatedTouchableOpacity>
          ))}

          {/* Main FAB Button - Fixed size */}
          <AnimatedTouchableOpacity
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              zIndex: 10,
            }}
            className="bg-primary"
            onPress={toggleFAB}
            activeOpacity={0.8}
          >
            <Animated.View style={mainFabStyle}>
              <ThemeIcon
                icon={Plus}
                darkColor="#fff"
                lightColor="#fff"
                size={24}
              />
            </Animated.View>
          </AnimatedTouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Status;
