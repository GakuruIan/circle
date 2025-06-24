import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SafeAreaView } from "react-native-safe-area-context";

// components
import Input from "@/components/UI/Input";
import ThemeIcon from "@/components/UI/ThemeIcon";

// utils
import { Colors } from "@/constants/Colors";

// icons
import Button from "@/components/UI/Button";
import { Plus } from "lucide-react-native";

const profileSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "username cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "Username must start with a letter and contain only letters, numbers, and underscores."
    ),
  about: z
    .string({ required_error: "About is required" })
    .min(1, "About cannot be null.")
    .max(200, "About cannot be more than 200 characters.")
    .regex(
      /^[\w\s.,!?'"@#&()\-:;]*$/,
      "About can only contain letters, numbers, spaces, and basic punctuation."
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Setup = () => {
  const {
    control,
    handleSubmit,

    formState: { isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });
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
          <View className=" items-center justify-center mt-4 mb-4">
            <TouchableOpacity className="size-32  rounded-full  border border-dashed items-center justify-center gap-y-4 bg-light-200 dark:bg-dark-200 px-4">
              <ThemeIcon
                icon={Plus}
                darkColor={Colors.dark_gray}
                lightColor={Colors.light_gray}
              />
            </TouchableOpacity>
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
              label="Finish"
              loading={isSubmitting}
              loadingText="Setting up..."
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setup;
