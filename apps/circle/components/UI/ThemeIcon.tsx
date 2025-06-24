import React from "react";
import { View } from "react-native";
//color scheme
import { useColorScheme } from "nativewind";

// lucide icon
import { LucideIcon } from "lucide-react-native";

//utils
import { cn } from "@/lib/utils";

interface iconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  lightColor?: string;
  darkColor?: string;
  [key: string]: any;
}

const ThemeIcon: React.FC<iconProps> = ({
  icon: Icon,
  size = 22,
  className = "",
  lightColor = "#000",
  darkColor = "#fff",
  ...props
}) => {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? darkColor : lightColor;
  return (
    <View className={cn("items-center justify-center", className)}>
      <Icon size={size} color={iconColor} {...props} />
    </View>
  );
};

export default ThemeIcon;
