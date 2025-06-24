import React from "react";
import { Image, View } from "react-native";

import { cn } from "@/lib/utils";

// import dummy image
import pic from "@/assets/images/llama.jpg";

interface avatarProps {
  variant?: "xs" | "sm" | "md" | "lg" | "xl";
  url?: string;
}

const Avatar: React.FC<avatarProps> = ({ variant = "sm", url }) => {
  return (
    <View
      className={cn(
        " items-center justify-center border-2 border-primary rounded-full p-1 overflow-hidden",
        variant === "xs" && "size-9",
        variant === "sm" && "size-10",
        variant === "md" && "size-16",
        variant === "lg" && "size-20",
        variant === "xl" && "size-36"
      )}
    >
      <Image
        source={pic}
        resizeMode="cover"
        resizeMethod="resize"
        style={{ aspectRatio: 1 }}
        className={cn(
          "rounded-full",
          variant === "xs" && "size-7",
          variant === "sm" && "size-8",
          variant === "md" && "size-14",
          variant === "lg" && "size-18",
          variant === "xl" && "size-34"
        )}
      />
    </View>
  );
};

export default Avatar;
