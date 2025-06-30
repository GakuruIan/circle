import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// icons
import { Folder, MoveLeft, Send } from "lucide-react-native";

// components
import ThemeIcon from "../UI/ThemeIcon";

// expo router
import { useRouter } from "expo-router";

// colors
import { Colors } from "@/constants/Colors";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// utils function
import { PickMediaFromLibrary } from "@/utils/FilePicker";
import { useColorScheme } from "nativewind";

const StatusImageForm = () => {
  const topPadding = useSafeAreaInsets().top;
  const bottomPadding = useSafeAreaInsets().bottom;
  const [loading, setLoading] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const router = useRouter();

  const { height, width } = Dimensions.get("screen");

  const handleFilePick = async () => {
    try {
      setLoading(true);
      const uri = await PickMediaFromLibrary(["videos", "images"]);

      if (uri) {
        setCapturedMedia(uri);
        setShowPreview(true);
      }
    } catch (error) {
      console.log("Error:", error?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilePick();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#03BD49" />
      </View>
    );
  }

  return (
    <View
      className="flex-1  bg-white dark:bg-dark-300"
      style={{ paddingTop: topPadding + 10 }}
    >
      <View className="px-2" style={{ height: topPadding + 25 }}>
        <View className="flex-row items-center justify-between mb-2 px-4 mt-2 ">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ThemeIcon icon={MoveLeft} size={28} lightColor="#000" />
            </TouchableOpacity>

            <Text className="dark:text-white text-2xl font-poppins_bold ml-8">
              Choose Image
            </Text>
          </View>

          <TouchableOpacity onPress={handleFilePick}>
            <ThemeIcon icon={Folder} darkColor="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {showPreview && capturedMedia && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS === "ios" ? bottomPadding + 30 : 0
          }
          style={{ flex: 1 }}
        >
          <View className="flex-1">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: capturedMedia }}
                style={{
                  width: width,
                  height: undefined,
                  aspectRatio: 1,
                  maxHeight: height * 0.6,
                }}
                resizeMode="cover"
              />

              <View
                style={{
                  backgroundColor: isDark ? Colors.interp_dark_bg : "#fff",
                  alignItems: "center",
                  borderTopWidth: 0,
                  paddingVertical: 2,
                  paddingHorizontal: 8,
                  marginHorizontal: 4,
                  borderRadius: 40,
                  flexDirection: "row",
                  gap: 4,
                  marginTop: 14,
                  width: "100%",
                }}
              >
                <TextInput
                  className="flex-1 dark:text-white placeholder:dark:text-gray-400 placeholder:text-gray-500"
                  placeholder="write your caption"
                />
                <TouchableOpacity className="flex items-center justify-center bg-primary size-14 rounded-full">
                  <ThemeIcon icon={Send} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default StatusImageForm;
