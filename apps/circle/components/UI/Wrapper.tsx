import React from "react";
import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

interface props {
  children: React.ReactNode;
  headerTitle?: string;
  className?: string;
}

const Wrapper: React.FC<props> = ({ children, headerTitle, className }) => {
  return (
    <View className={cn("px-4 py-4 dark:bg-dark-200 bg-white", className)}>
      {headerTitle && (
        <Text className="dark:text-gray-500 text-gray-600  font-poppins_regular tracking-wide font-bold mb-2 text-lg">
          {headerTitle}
        </Text>
      )}

      <View>{children}</View>
    </View>
  );
};

export default Wrapper;
