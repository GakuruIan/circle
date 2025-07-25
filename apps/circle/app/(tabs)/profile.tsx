import React, { useState, useCallback } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";

// routing
import { useFocusEffect } from "@react-navigation/native";

// firebase auth
import auth from "@react-native-firebase/auth";

//utils
import { PickMediaFromLibrary } from "@/utils/FilePicker";

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

// hooks
import { useUpdateUser } from "@/hooks/mutations/useUpdateUser";

// stores
import { useUser } from "@/hooks/stores/userStore";
import { router } from "expo-router";

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
  const { updateUser, user } = useUser();
  const updateUserMutation = useUpdateUser();
  const [isLoading, setLoading] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        router.replace("/(auth)/signup");
      }
    }, [])
  );

  const {
    control,
    handleSubmit,

    formState: { isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

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

      const user = await updateUserMutation.mutateAsync(formData);

      updateUser(user);
    } catch (error) {
      console.error(error);
      Alert.alert("Something went wrong", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-2.5">
      <View className="mt-4 items-center justify-between relative w-full mb-6">
        {/* 
        {
          capturedMedia ? <Avatar variant="xl"/> :<Avatar variant="xl"/>
        } */}

        <Avatar variant="xl" />

        <TouchableOpacity
          className="absolute -bottom-5 bg-primary p-2.5 rounded-full"
          activeOpacity={0.7}
          onPress={handleFilePick}
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
          defaultValue={user?.name}
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
          defaultValue={user?.about}
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
