import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

// components
import StatusCameraForm from "@/components/Forms/StatusCameraForm";
import StatusImageForm from "@/components/Forms/StatusImageForm";
import StatusTextForm from "@/components/Forms/StatusTextForm";

const allowedTypes = ["Gallery", "Text", "Voice", "Camera"] as const;
type AllowedType = (typeof allowedTypes)[number];

const StatusType = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();

  const currentType = type;

  useEffect(() => {
    if (!allowedTypes.includes(currentType as AllowedType)) {
      // Invalid route type: redirect or go back
      router.replace("/status"); // fallback route
    }
  }, [currentType, router]);

  if (!currentType || !allowedTypes.includes(currentType as AllowedType)) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color="#03BD49" />
      </View>
    );
  }

  if (!allowedTypes.includes(type)) {
    return (
      <View>
        <Text>Invalid status type</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-dark-300">
      <View className="flex-1  relative">
        {currentType === "Gallery" && <StatusImageForm />}

        {currentType === "Text" && <StatusTextForm />}
        {currentType === "Voice" && (
          <Text className="dark:text-white text-xl font-poppins_bold">
            {" "}
            Voice
          </Text>
        )}
        {currentType === "Camera" && <StatusCameraForm />}
      </View>
    </View>
  );
};

export default StatusType;
