import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// components
import Avatar from "@/components/UI/Avatar";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import ThemeIcon from "@/components/UI/ThemeIcon";

// icons
import { Pencil } from "lucide-react-native";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "username cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "Username must start with a letter and contain only letters, numbers, and underscores."
    ),
  about: z
    .string()
    .min(1, "About cannot be null.")
    .max(200, "About cannot be more than 200 characters.")
    .regex(
      /^[\w\s.,!?'"@#&()\-:;]*$/,
      "About can only contain letters, numbers, spaces, and basic punctuation."
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const {
    control,
    handleSubmit,

    formState: { isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: ProfileFormData) => {
    console.log(values);
  };
  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-2.5">
      <View className="mt-4 items-center justify-between relative w-full mb-6">
        <Avatar variant="xl" />

        <TouchableOpacity
          className="absolute -bottom-5 bg-primary p-2.5 rounded-full"
          activeOpacity={0.7}
        >
          <ThemeIcon icon={Pencil} darkColor="#fff" lightColor="#fff" />
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
          label="Update Profile"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          loadingText="Updating..."
        />
      </View>
    </View>
  );
};

export default Profile;
