import React, { useState, useEffect } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Pressable,
  Alert,
} from "react-native";

// mutations
import { useCreateUser } from "@/hooks/mutations/useCreateUser";

// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SafeAreaView } from "react-native-safe-area-context";

// components
import Input from "@/components/UI/Input";
import ThemeIcon from "@/components/UI/ThemeIcon";
import Button from "@/components/UI/Button";

// utils
import { Colors } from "@/constants/Colors";
import { PickMediaFromLibrary } from "@/utils/FilePicker";

// icons
import { Plus, Trash } from "lucide-react-native";

// routing
import { router } from "expo-router";

// user store
import { useUser } from "@/hooks/stores/userStore";

const profileSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "username cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "Username must start with a letter and contain only letters, numbers, and underscores.",
    ),
  about: z
    .string({ required_error: "About is required" })
    .min(1, "About cannot be null.")
    .max(200, "About cannot be more than 200 characters.")
    .regex(
      /^[\w\s.,!?'"@#&()\-:;]*$/,
      "About can only contain letters, numbers, spaces, and basic punctuation.",
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Setup = () => {
  const { setUser, user } = useUser();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/chats");
    }
  }, [user]);

  const [isLoading, setLoading] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);

  const createUserMutation = useCreateUser();

  const { control, handleSubmit } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: ProfileFormData) => {
    setLoading(true);
    try {
      const { username, about } = values;
      const formData = new FormData();

      formData.append("name", username);
      formData.append("about", about);

      if (capturedMedia) {
        const fileName = capturedMedia?.split("/").pop()!;
        const fileType = fileName.split(".").pop();

        formData.append("photo", {
          uri: capturedMedia,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      const user = await createUserMutation.mutateAsync(formData);

      setUser(user);

      router.replace("/(tabs)/chats");
    } catch (error) {
      console.error(error);
      Alert.alert("Something went wrong", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilePick = async () => {
    try {
      const uri = await PickMediaFromLibrary(["images"]);

      if (uri) {
        setCapturedMedia(uri);
      }
    } catch (error) {
      console.log("Error:", error?.message);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-300 px-4">
      <View className="mt-10">
        <Text className="dark:text-white font-poppins_regular text-3xl mb-2">
          Let’s Get to Know You
        </Text>
        <Text className="text-gray-400 dark:text-gray-500 text-base font-quicksand mb-3">
          Add a profile picture, pick a username, and write a little about
          yourself.
        </Text>

        <View className="mt-6">
          <View className="items-center justify-center mt-4 mb-4">
            {capturedMedia ? (
              <View className="relative size-32 gap-y-2 items-center ">
                <Image
                  className="h-full w-full rounded-full"
                  source={{ uri: capturedMedia }}
                  style={{ flex: 1, aspectRatio: 1 }}
                  resizeMode="cover"
                />
                <Pressable className="bg-rose-600 absolute -bottom-5 p-2 rounded-full items-center justify-center">
                  <ThemeIcon icon={Trash} darkColor="#fff" lightColor="#fff" />
                </Pressable>
              </View>
            ) : (
              <TouchableOpacity
                className="size-32  rounded-full  border border-dashed items-center justify-center gap-y-4 bg-light-200 dark:bg-dark-200 px-4"
                onPress={handleFilePick}
              >
                <ThemeIcon
                  icon={Plus}
                  darkColor={Colors.dark_gray}
                  lightColor={Colors.light_gray}
                />
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-4">
            <Text className="dark:text-white font-poppins_regular tracking-wider text-base mb-2">
              Username
            </Text>
            <Input
              name="username"
              placeholder="e.g GakuruCodes"
              control={control}
              className="w-full"
            />
          </View>

          <View className="mt-2">
            <Text className="dark:text-white font-poppins_regular tracking-wider text-base mb-2">
              About
            </Text>
            <Input
              name="about"
              placeholder="e.g Busy now"
              control={control}
              className="w-full"
            />
          </View>

          <View className="mt-4">
            <Button
              onPress={handleSubmit(onSubmit)}
              label="Finish"
              loading={isLoading}
              loadingText="Setting up..."
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setup;
