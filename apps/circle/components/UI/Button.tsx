import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

// utils
import { cn } from "@/lib/utils";

interface buttonProps extends TouchableOpacityProps {
  label: string;
  className?: string;
  textClassName?: string;
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "ghost" | "destructive";
  icon?: React.ReactNode;
}

export default function Button({
  label,
  variant = "primary",
  className,
  textClassName,
  loading = false,
  loadingText = "Loading",
  icon,
  ...props
}: buttonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={cn(
        "rounded-md px-4 py-4  flex items-center justify-center",
        variant === "primary" && "bg-primary",

        variant === "ghost" && "bg-light-100 dark:bg-dark-100",
        variant === "destructive" && "bg-rose-600 ",
        className
      )}
      {...props}
    >
      {loading ? (
        <View className="flex-row items-center gap-x-2">
          <ActivityIndicator color={"#fff"} />
          <Text className="font-poppins_light text-white ">{loadingText}</Text>
        </View>
      ) : (
        <View className="flex-row items-center gap-x-2">
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={cn(
              "font-semibold font-poppins tracking-wide",
              variant === "primary" && "text-white ",
              variant === "ghost" && "text-gray-800 dark:text-gray-400",
              textClassName
            )}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
