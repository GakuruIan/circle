import React from "react";
import { Text, View } from "react-native";

const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <View>
      <Text className="font-poppins_regular text-2xl tracking-wide font-semibold dark:text-white">
        {title}
      </Text>
    </View>
  );
};

export default HeaderTitle;
