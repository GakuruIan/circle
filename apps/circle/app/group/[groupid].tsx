import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// reanimated
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// components
import Avatar from "@/components/UI/Avatar";
import ThemeIcon from "@/components/UI/ThemeIcon";
import Wrapper from "@/components/UI/Wrapper";

// utils colors
import { Colors } from "@/constants/Colors";

// image
import pic from "@/assets/images/llama.jpg";

// icons
import {
  AudioLines,
  BookUser,
  CircleAlert,
  EllipsisVertical,
  HeartOff,
  MoveLeft,
  Search,
  ThumbsDown,
} from "lucide-react-native";

//status bar
import { StatusBar } from "expo-status-bar";

// theming

import { useColorScheme } from "nativewind";

const User = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const initialbgColor = isDark ? Colors.initial_dark_bg : "#fff";
  const bgColor = isDark ? Colors.interp_dark_bg : Colors.interp_light_bg;

  const insets = useSafeAreaInsets();

  const { width: windowWidth } = Dimensions.get("window");

  const offsetValue = 150;

  const topBarHeight = insets.top + 60;
  const avatarSize = 136;
  const smallAvatarSize = avatarSize * 0.3;
  const initialAvatarY = 112;

  const targetY = topBarHeight / 2 - smallAvatarSize / 2 - 5.5;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  //   avatar animation
  const avatarAnimation = useAnimatedStyle(() => {
    const yTranslation = targetY - initialAvatarY;
    const translateY = interpolate(
      scrollY.value,
      [0, offsetValue],
      [0, yTranslation],
      Extrapolation.CLAMP
    );

    const xvalue = windowWidth / 2 - 2 * 8 - 48;
    const translateX = interpolate(
      scrollY.value,
      [0, offsetValue],
      [0, -xvalue],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, offsetValue],
      [1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { translateX }, { scale }],
    };
  });

  // name animation
  const nameAnimatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100, offsetValue],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollY.value,
      [0, offsetValue],
      [-28, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, offsetValue],
      [28, 0],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateX }, { translateY }] };
  });

  // header animation
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, offsetValue],
      [initialbgColor, bgColor]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      {/* topbar */}
      <Animated.View
        style={[
          headerAnimatedStyle,
          { height: insets.top + 60, paddingTop: insets.top },
        ]}
        className="bg-white dark:bg-dark-200 flex-row items-center justify-between z-10 px-2"
      >
        <View className="flex-row  items-center ">
          <Pressable className="ml-2">
            <ThemeIcon icon={MoveLeft} size={24} />
          </Pressable>

          <View className="mx-16">
            <Animated.Text
              style={[nameAnimatedStyles]}
              className="dark:text-white font-poppins_regular text-base tracking-tight"
            >
              Group name
            </Animated.Text>
          </View>
        </View>
        <Pressable>
          <ThemeIcon icon={EllipsisVertical} size={24} />
        </Pressable>
      </Animated.View>

      <Animated.View className="items-center justify-center w-full absolute z-50 top-28">
        <Animated.Image
          style={[avatarAnimation]}
          source={pic}
          resizeMode="cover"
          resizeMethod="resize"
          className={"rounded-full size-34"}
        />
      </Animated.View>

      {/* topbar */}

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Wrapper>
          <View
            style={{ paddingTop: insets.top }}
            className="items-center justify-between relative w-full mb-6 mt-18"
          >
            <Text className="dark:text-white mt-4 font-poppins_regular tracking-tight font-medium text-3xl">
              Group name
            </Text>

            <Pressable className="mt-1.5">
              <Text className="dark:text-gray-400 text-gray-500 font-poppins_regular tracking-tight font-medium text-base">
                Group - 20 members
              </Text>
            </Pressable>
          </View>

          {/* group actions */}
          <View className="flex-row flex-1 gap-x-6 items-center mb-6 justify-center">
            <TouchableOpacity className="bg-light-100 h-20 w-32 items-center dark:bg-dark-100 p-4 rounded-md">
              <ThemeIcon icon={AudioLines} />
              <Text className="dark:text-white mt-2 font-poppins_regular text-base tracking-tight font-medium">
                Voice Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-light-100 h-20 w-28 items-center dark:bg-dark-100 p-4 rounded-md">
              <ThemeIcon icon={Search} />
              <Text className="dark:text-white mt-2 font-poppins_regular text-base tracking-tight font-medium">
                Search
              </Text>
            </TouchableOpacity>
          </View>
          {/* Group actions */}
        </Wrapper>

        <Wrapper className="mt-2" headerTitle="About">
          <View>
            <Text className="dark:text-white text-base font-poppins_regular mb-1.5 tracking-tight">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aspernatur eaque perferendis facilis non laboriosam fugit.
            </Text>

            <Text className="dark:text-gray-400 text-gray-500 text-base font-poppins_regular">
              09/09/2025
            </Text>
          </View>
        </Wrapper>

        {/* shared media */}
        <Wrapper className="mt-2">
          <View className="flex-row flex-1 items-center justify-between mb-1.5">
            <Text className="dark:text-gray-500 text-gray-600  font-poppins_regular tracking-wide font-bold mb-2 text-lg">
              Media, links and docs
            </Text>

            <Text className="dark:text-gray-500 text-gray-600  font-poppins_regular tracking-wide font-bold mb-2 text-base">
              2
            </Text>
          </View>
          <View>
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8]}
              keyExtractor={(item) => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="size-22 mr-1">
                  <Image
                    source={pic}
                    alt="shared media"
                    style={{ aspectRatio: 1 }}
                    className="h-full w-full rounded-lg"
                  />
                </View>
              )}
            />
          </View>
        </Wrapper>

        {/* members of  group */}
        <Wrapper className="mt-2" headerTitle="Members">
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="flex-row items-center gap-x-1 py-1.5">
                <Avatar variant="md" />
                <View className="flex-row flex-1 items-center justify-between ml-1">
                  <View className="flex-1">
                    <Text className="dark:text-white font-poppins_regular tracking-tight ">
                      Username
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="text-sm text-gray-500 dark:text-gray-400  font-poppins_regular"
                    >
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Recusandae, quidem.
                    </Text>
                  </View>
                  <Text className="text-gray-500  dark:text-gray-400 text-sm font-poppins_regular">
                    +254 798 777 666
                  </Text>
                </View>
              </View>
            )}
          />
        </Wrapper>

        {/* danger zone */}

        <Wrapper className="mt-2 pb-6" headerTitle="Actions">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center gap-x-4 mb-2 py-3"
          >
            <ThemeIcon icon={HeartOff} />
            <Text className="dark:text-white font-poppins_regular tracking-tight font-medium text-lg">
              Remove from favorites
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center gap-x-4 mb-2 py-3"
          >
            <ThemeIcon icon={BookUser} />
            <Text className="dark:text-white font-poppins_regular tracking-tight font-medium text-lg">
              Add list
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center gap-x-4 mb-2 py-3"
          >
            <ThemeIcon icon={CircleAlert} darkColor={Colors.danger} />
            <Text
              style={{ color: Colors.danger }}
              className="font-poppins_regular tracking-tight font-medium text-lg"
            >
              Exit group
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center gap-x-4 mb-2 py-3"
          >
            <ThemeIcon icon={ThumbsDown} darkColor={Colors.danger} />
            <Text
              style={{ color: Colors.danger }}
              className="font-poppins_regular tracking-tight font-medium text-lg"
            >
              Report group
            </Text>
          </TouchableOpacity>
        </Wrapper>
      </Animated.ScrollView>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={isDark ? "#000" : "#fff"}
      />
    </View>
  );
};

export default User;
