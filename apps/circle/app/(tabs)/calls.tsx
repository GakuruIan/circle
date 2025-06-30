import React from "react";
import { SectionList, Text, View } from "react-native";

// components
import Avatar from "@/components/UI/Avatar";
import ThemeIcon from "@/components/UI/ThemeIcon";

// icons
import { Phone, PhoneIncoming, Video } from "lucide-react-native";

const calls = () => {
  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-2">
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={[
          {
            title: "Favorites",
            data: [1],
          },
          {
            title: "Recent",
            data: [1, 2, 3, 4, 5],
          },
        ]}
        keyExtractor={(item) => item?.toString()}
        renderItem={({ item }) => (
          <View className="mb-4">
            <View className="flex-row items-center gap-x-3 w-full">
              <View className="relative flex-row">
                <Avatar variant="md" />
              </View>
              <View className="flex-row justify-between items-center flex-1">
                <View className="">
                  <Text className="font-poppins font-medium text-base dark:text-white mb-0.5">
                    Username status
                  </Text>
                  <View className="flex-row items-center gap-x-4">
                    {/* have the phone symbol green for recieved calls and rose for missed calls */}
                    <ThemeIcon
                      icon={PhoneIncoming}
                      size={18}
                      darkColor="#DC1652" // 03BD49
                      lightColor="#DC1652" // 03BD49
                    />

                    <Text className="font-poppins text-sm text-gray-500">
                      20 minutes ago
                    </Text>
                  </View>
                </View>

                {/* icons */}
                <View className="flex-row gap-x-4 items-center">
                  <ThemeIcon icon={Phone} size={22} />

                  <ThemeIcon icon={Video} size={22} />
                </View>
              </View>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View className="py-2">
            <Text className="font-poppins font-semibold text-gray-400">
              {title}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default calls;
